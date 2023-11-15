import { Canceler } from 'axios';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	MouseEvent,
} from 'react';
import { useSelector } from 'react-redux';
import { Suggestion } from './types';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { suggestCombo } from '@/api/services/suggestCombo';
import { suggestKeyword } from '@/api/services/suggestKeyword';
import { suggestPartNumber } from '@/api/services/suggestPartNumber';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useOrderNoListedProductModal } from '@/components/pc/modals/OrderNoListedProductModal';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ectLogger } from '@/logs/ectLogger';
import { getUnpublishedList } from '@/logs/ectLogger/search';
import { Flag } from '@/models/api/Flag';
import { SuggestComboResponse } from '@/models/api/msm/ect/combo/SuggestComboResponse';
import { SuggestKeywordResponse } from '@/models/api/msm/ect/keyword/SuggestKeywordResponse';
import { SearchType } from '@/models/api/msm/ect/log/message';
import {
	PartNumber,
	PartNumberType,
	SuggestPartNumberResponse,
} from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';
import { selectAuthenticated } from '@/store/modules/auth';
import { pagesPath } from '@/utils/$path';
import { notEmpty } from '@/utils/predicate';
import { useReserve, useTimer } from '@/utils/timer';

/** keyword suggest delay from change keyword */
const KEYWORD_SUGGEST_DELAY = 80;
/** part number suggest delay from change keyword */
const PART_NUMBER_SUGGEST_DELAY = 500;

// Max combo response count
const MAX_COMBO_SUGGESTION_COUNT = 10;

const LOG_DELAY = 3000;

// TODO: stg0 では未掲載品も送信していそうだが、正しい動きであるか分析チームに確認中。
const GA_MEASURE_TYPES = new Array<string>(
	PartNumberType.NORMAL,
	PartNumberType.NO_CATALOG
);

type Payload = {
	keyword: string;
	active: boolean;
	isReSearch: boolean;
};

type SuggestionResponse<R> = {
	searchKeyword: string;
	response?: R;
};

/**
 * Suggests keywords based on entered keyword.
 */
export const useSuggestKeyword = ({ keyword, active, isReSearch }: Payload) => {
	const [loading, setLoading] = useState(false);
	const [{ searchKeyword, response }, setResponse] = useState<
		SuggestionResponse<SuggestKeywordResponse>
	>({ searchKeyword: keyword });
	// TODO: cancel の機構を作り直す
	const { generateToken } = useApiCancellation();
	const cancelerRef = useRef<Canceler>();
	const { debounce, isSleeping } = useTimer();
	// logger
	const reserveLog = useReserve(ectLogger.search.keywordSuggest, LOG_DELAY);

	const reload = useCallback(
		(keyword: string) => {
			// NOTE: cancel API right after keyword changed
			cancelerRef.current?.();
			// Load without waiting while idle.
			const throttle = loading || isSleeping() ? KEYWORD_SUGGEST_DELAY : 0;
			// Assume that the waiting time is also during loading.
			setLoading(true);

			debounce(async () => {
				try {
					const now = Date.now();
					const response = await suggestKeyword(
						{ keyword },
						generateToken(c => (cancelerRef.current = c))
					);
					setResponse({ searchKeyword: keyword, response });
					setLoading(false);
					reserveLog({ keyword, response, duration: Date.now() - now });
				} catch (error) {
					// If pending api call is canceled, the next input is given and the load is restarted.
					// So do not set loading to false.
					if (error instanceof ApiCancelError) {
						return;
					}
					setLoading(false);
					throw error;
				}
			}, throttle);
		},
		[debounce, generateToken, isSleeping, loading, reserveLog]
	);

	useEffect(() => {
		if (keyword && active) {
			reload(keyword);
		} else if (!keyword) {
			cancelerRef.current?.();
			setLoading(false);
			setResponse({ searchKeyword: keyword });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyword, active]);

	// Converts view model.
	const keywordList = useMemo<Suggestion[]>(() => {
		if (!response || !response.keywordList) {
			return [];
		}

		return response.keywordList.map((item, index, items) => {
			const href = pagesPath.vona2.result.$url({
				query: {
					Keyword: item,
					isReSearch: Flag.toFlag(isReSearch),
				},
			});
			return {
				keyword: item,
				href,
				sendClickLog: () => {
					ectLogger.search.clickSuggest({
						searchType: SearchType.KEYWORD_SUGGEST,
						keyword: searchKeyword,
						index,
						href,
						selectedKeyword: item,
						suggestionsCount: items.length,
					});
				},
			};
		});
	}, [isReSearch, response, searchKeyword]);

	return { loadingKeyword: loading, keywordList };
};

/**
 * Suggests part numbers based on entered keyword.
 */
export const useSuggestPartNumber = ({
	keyword,
	active,
	isReSearch,
}: Payload) => {
	const [loading, setLoading] = useState(false);
	const [{ searchKeyword, response }, setResponse] = useState<
		SuggestionResponse<SuggestPartNumberResponse>
	>({ searchKeyword: keyword });
	const [comboResponse, setComboResponse] = useState<SuggestComboResponse>();
	const { generateToken } = useApiCancellation();
	const cancelerRef = useRef<Canceler>();
	const { debounce, cancel } = useTimer();
	const reserveLog = useReserve(ectLogger.search.partNumberSuggest, LOG_DELAY);
	const reserveSuggestComboLog = useReserve(
		ectLogger.search.partNumberSuggest,
		LOG_DELAY
	);

	const getLinkBehavior = usePartNumberLinkBehavior(isReSearch);

	const loadCombo = useCallback(
		async (keyword: string, notDiscontinuedPartNumbers: PartNumber[]) => {
			try {
				const excludeInnerCode = notDiscontinuedPartNumbers
					.map(partNumber => partNumber.innerCode)
					.join(',');

				const requestStartTime = Date.now();
				const response = await suggestCombo(
					{
						partNumber: keyword,
						count:
							MAX_COMBO_SUGGESTION_COUNT - notDiscontinuedPartNumbers.length,
						excludeInnerCode,
					},
					generateToken(c => (cancelerRef.current = c))
				);

				setComboResponse(response);

				const impressionItems = response.partNumberList.filter(
					({ partNumberType }) => GA_MEASURE_TYPES.includes(partNumberType)
				);
				if (impressionItems.length) {
					ga.ecommerce.viewItemList(
						impressionItems.map(item => ({
							seriesCode: item.seriesCode,
							itemListName: ItemListName.SUGGEST_PREVIEW,
						}))
					);
				}

				reserveSuggestComboLog({
					keyword,
					response,
					duration: Date.now() - requestStartTime,
					isCombo: true,
				});
			} catch (error) {
				if (error instanceof ApiCancelError) {
					return;
				}
				throw error;
			}
		},
		[generateToken, reserveSuggestComboLog]
	);

	const reload = useCallback(
		(keyword: string) => {
			// NOTE: cancel API right after keyword changed
			cancelerRef.current?.();
			// Assume that the waiting time is also during loading.
			setLoading(true);

			debounce(async () => {
				try {
					const now = Date.now();
					const response = await suggestPartNumber(
						{ keyword },
						generateToken(c => (cancelerRef.current = c))
					);

					const notDiscontinuedPartNumbers = response.partNumberList.filter(
						partNumber =>
							partNumber.partNumberType !== PartNumberType.DISCONTINUED
					);
					if (
						Flag.isTrue(response.comboFlag) &&
						notDiscontinuedPartNumbers.length < MAX_COMBO_SUGGESTION_COUNT
					) {
						await loadCombo(keyword, notDiscontinuedPartNumbers);
					} else {
						setComboResponse(undefined);
					}

					const impressionItems = response.partNumberList.filter(
						({ partNumberType }) => GA_MEASURE_TYPES.includes(partNumberType)
					);
					if (impressionItems.length) {
						ga.ecommerce.viewItemList(
							impressionItems.map(item => ({
								seriesCode: item.seriesCode ?? '',
								itemListName: ItemListName.SUGGEST_PREVIEW,
							}))
						);
					}

					setResponse({ searchKeyword: keyword, response });
					setLoading(false);
					reserveLog({ keyword, response, duration: Date.now() - now });
				} catch (error) {
					if (error instanceof ApiCancelError) {
						return;
					}
					setLoading(false);
					throw error;
				}
			}, PART_NUMBER_SUGGEST_DELAY);
		},
		[debounce, generateToken, loadCombo, reserveLog]
	);

	useEffect(() => {
		if (keyword && active) {
			reload(keyword);
		} else if (!keyword) {
			// Canceling debounced callbacks if there is
			// to avoid showing result when keyword is empty
			cancel();
			cancelerRef.current?.();
			setLoading(false);
			setResponse({ searchKeyword: keyword });
			setComboResponse(undefined);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [keyword, active]);

	// Converts view model.
	const partNumberList = useMemo<Suggestion[]>(() => {
		if (!response) {
			return [];
		}

		// for log
		const unpublishedList =
			response && getUnpublishedList(response.partNumberList);

		return response.partNumberList
			.filter(
				({ partNumberType }) => partNumberType !== PartNumberType.DISCONTINUED
			)
			.map((item, index, items) => {
				const behavior = getLinkBehavior(item);

				return {
					keyword: item.partNumber,
					label: getPartNumberLabel(item),
					...behavior,
					sendClickLog: () =>
						ectLogger.search.clickSuggest({
							searchType: SearchType.PART_NUMBER_SUGGEST,
							keyword: searchKeyword,
							index,
							href: behavior.href,
							selectedKeyword: item.partNumber,
							suggestionsCount: items.length,
							brandCode: item.brandCode,
							seriesCode: item.seriesCode,
							unpublishedList,
						}),
					sendGAClickLog: GA_MEASURE_TYPES.includes(item.partNumberType)
						? () =>
								ga.ecommerce.selectItem({
									seriesCode: item.seriesCode ?? '',
									itemListName: ItemListName.SUGGEST_PREVIEW,
								})
						: undefined,
				};
			});
	}, [getLinkBehavior, response, searchKeyword]);

	const discontinuedList = useMemo<Suggestion[]>(() => {
		if (!response) {
			return [];
		}
		return response.partNumberList
			.filter(
				({ partNumberType }) => partNumberType === PartNumberType.DISCONTINUED
			)
			.map((item, index, items) => {
				const behavior = getLinkBehavior(item);
				return {
					keyword: item.partNumber,
					label: getPartNumberLabel(item),
					...behavior,
					sendClickLog: () => {
						ectLogger.search.clickSuggest({
							searchType: SearchType.KEYWORD_SUGGEST,
							keyword: searchKeyword,
							index,
							href: behavior.href,
							selectedKeyword: item.partNumber,
							suggestionsCount: items.length,
							brandCode: item.brandCode,
							seriesCode: item.seriesCode,
						});
					},
				};
			});
	}, [getLinkBehavior, response, searchKeyword]);

	const comboPartNumbers = useMemo<Suggestion[]>(() => {
		const partNumberList = comboResponse?.partNumberList ?? [];

		const unpublishedList =
			comboResponse && getUnpublishedList(comboResponse.partNumberList);

		return partNumberList.map((comboPartNumber, index) => {
			const partNumber: PartNumber = {
				...comboPartNumber,
				normalizedKeyword: '',
				searchedKeyword: '',
			};
			const behavior = getLinkBehavior(partNumber);

			return {
				keyword: partNumber.partNumber,
				label: getPartNumberLabel(partNumber),
				...behavior,
				sendClickLog: () => {
					ectLogger.search.clickSuggest({
						searchType: SearchType.COMBO_SUGGEST,
						keyword: searchKeyword,
						index,
						href: behavior.href,
						selectedKeyword: partNumber.partNumber,
						suggestionsCount: partNumberList.length,
						brandCode: partNumber.brandCode,
						seriesCode: partNumber.seriesCode,
						unpublishedList,
					});
				},
				sendGAClickLog: GA_MEASURE_TYPES.includes(partNumber.partNumberType)
					? () =>
							ga.ecommerce.selectItem({
								seriesCode: partNumber.seriesCode ?? '',
								itemListName: ItemListName.SUGGEST_PREVIEW,
							})
					: undefined,
			};
		});
	}, [comboResponse, getLinkBehavior, searchKeyword]);

	return {
		loadingPartNumber: loading,
		partNumberList: [...partNumberList, ...comboPartNumbers],
		discontinuedList,
	};
};

/**
 * Returns the label name according to the part number type.
 */
function getPartNumberLabel(item: PartNumber) {
	const { partNumber, brandName, seriesName, partNumberTypeDisp } = item;
	switch (item.partNumberType) {
		case PartNumberType.NORMAL:
		case PartNumberType.DISCONTINUED:
			return [partNumber, getBrandDisp(brandName, seriesName)]
				.filter(notEmpty)
				.join(' ');
		case PartNumberType.NO_LISTED:
			return `${partNumber}${getBrandDisp(
				brandName,
				seriesName
			)} ※${partNumberTypeDisp}`;
		case PartNumberType.NO_CATALOG:
			return `${partNumber}${getBrandDisp(
				brandName,
				seriesName,
				partNumberTypeDisp
			)}`;
		// NOTE: No C-Navi Product in my.
	}
}

/**
 * Determines part number link behavior by part number type.
 */
function usePartNumberLinkBehavior(isReSearch: boolean) {
	const { orderNoListedProduct } = useNoProductPageOrder();

	return useCallback(
		(item: PartNumber) => {
			switch (item.partNumberType) {
				case PartNumberType.NO_LISTED:
					return {
						onClick: (event?: MouseEvent) => {
							event?.preventDefault();
							orderNoListedProduct(item);
						},
					};
				case PartNumberType.DISCONTINUED:
					return {
						href: pagesPath.vona2.result.$url({
							query: {
								Keyword: item.partNumber,
								isReSearch: Flag.toFlag(isReSearch),
							},
						}),
					};
				default:
					if (item.seriesCode) {
						return {
							href: pagesPath.vona2.detail._seriesCode(item.seriesCode).$url({
								query: {
									PNSearch: item.partNumber,
									HissuCode: item.partNumber,
									searchFlow: 'suggest2products',
									Keyword: item.partNumber,
									list: ItemListName.SUGGEST_PREVIEW,
								},
							}),
						};
					}
					// NOTE: Should not come here.
					return { href: '' };
			}
		},
		[isReSearch, orderNoListedProduct]
	);
}

/**
 * Returns brand label.
 * @param brandName
 * @param seriesName
 * @param partNumberTypeDisp
 */
function getBrandDisp(
	brandName: string | undefined,
	seriesName: string | undefined,
	partNumberTypeDisp?: string | undefined
) {
	const base = [brandName, seriesName].filter(notEmpty).join(' : ');
	if (!base) {
		return '';
	}

	if (!partNumberTypeDisp) {
		return ` [${base}]`;
	}
	return ` [${base} ${partNumberTypeDisp}]`;
}

/**
 * No product page order hook
 */
function useNoProductPageOrder() {
	const showLoginModal = useLoginModal();
	const showOrderNoListedProductModal = useOrderNoListedProductModal();
	const authenticated = useSelector(selectAuthenticated);

	const orderNoListedProduct = async (partNumber: PartNumber) => {
		if (!authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		showOrderNoListedProductModal(partNumber);
	};

	return { orderNoListedProduct };
}

/**
 * Loads and returns authentication state from store
 */
export const useAuth = () => {
	/** Are you logged in? */
	const authenticated = useSelector(selectAuthenticated);

	return { authenticated };
};
