import { Canceler } from 'axios';
import { useMemo, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { UrlObject } from 'url';
import { useDebouncedCallback } from 'use-debounce';
import { Suggestion } from './type';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { suggestCombo } from '@/api/services/suggestCombo';
import { suggestKeyword } from '@/api/services/suggestKeyword';
import { suggestPartNumber } from '@/api/services/suggestPartNumber';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { useOrderNoListedProductModal } from '@/components/mobile/modals/OrderNoListedProductModal';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ectLogger } from '@/logs/ectLogger';
import { getUnpublishedList } from '@/logs/ectLogger/search';
import { Flag } from '@/models/api/Flag';
import {
	SuggestComboResponse,
	PartNumber as ComboPartNumber,
} from '@/models/api/msm/ect/combo/SuggestComboResponse';
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
import { useReserve } from '@/utils/timer';

// Limit search response count
const MAX_SUGGESTION_COUNT = 5;
// Max combo response count
const MAX_COMBO_SUGGESTION_COUNT = 10;
// Keyword suggest delay from change keyword
const KEYWORD_SUGGEST_DELAY = 80;
// Part number suggest delay from change keyword
const PART_NUMBER_SUGGEST_DELAY = 420;
// Loading delay when keyword change. Keep the suggestion modal is not blinked.
const LOADING_DELAY = 500;

const LOG_DELAY = 3000;

// TODO: On stg0, event will be sent to GA when clicking to No Product Page part number suggestion
// Need to re-check requirement for this behavior.
const GA_MEASURE_TYPES = new Array<string>(
	PartNumberType.NORMAL,
	PartNumberType.NO_CATALOG
);

/**
 * Search suggestion hook
 * */
export const useSuggestion = () => {
	const { generateToken } = useApiCancellation();
	const keywordCancelerRef = useRef<Canceler>();
	const partNumberCancelerRef = useRef<Canceler>();
	const loadingTimerRef = useRef<NodeJS.Timeout>();
	const userKeywordRef = useRef<string>('');
	const initializedRef = useRef(false);
	const reserveSuggestKeywordLog = useReserve(
		ectLogger.search.keywordSuggest,
		LOG_DELAY
	);
	const reserveSuggestPartNumberLog = useReserve(
		ectLogger.search.partNumberSuggest,
		LOG_DELAY
	);
	const reserveSuggestComboLog = useReserve(
		ectLogger.search.partNumberSuggest,
		LOG_DELAY
	);
	const showLoginModal = useLoginModal();
	const showOrderNoListedProductModal = useOrderNoListedProductModal();
	const authenticated = useSelector(selectAuthenticated);

	const [keywordResponse, setKeywordResponse] =
		useState<SuggestKeywordResponse>();
	const [partNumberResponse, setPartNumberResponse] =
		useState<SuggestPartNumberResponse>();
	const [comboResponse, setComboResponse] = useState<SuggestComboResponse>();
	const [loadingKeyword, setLoadingKeyword] = useState(false);
	const [loadingPartNumber, setLoadingPartNumber] = useState(false);
	const [loadingCombo, setLoadingCombo] = useState(false);
	const [showsSuggestion, setShowsSuggestion] = useState(false);

	const loadPartNumber = useDebouncedCallback(async (keyword: string) => {
		try {
			setLoadingPartNumber(true);
			partNumberCancelerRef.current?.();

			const requestStartTime = Date.now();
			const response = await suggestPartNumber(
				{
					keyword,
					count: MAX_SUGGESTION_COUNT,
				},
				generateToken(cancel => (partNumberCancelerRef.current = cancel))
			);

			const notDiscontinuedPartNumbers = response.partNumberList.filter(
				partNumber => partNumber.partNumberType !== PartNumberType.DISCONTINUED
			);

			// NOTE: currently fetching up to 10 items but should it be 5 for mobile?
			if (
				Flag.isTrue(response.comboFlag) &&
				notDiscontinuedPartNumbers.length < MAX_COMBO_SUGGESTION_COUNT
			) {
				loadCombo(keyword, notDiscontinuedPartNumbers);
			} else {
				setComboResponse(undefined);
			}

			setPartNumberResponse(response);

			// TODO: Currently, do not send No Product Page Part number to GA
			// Need to re-check requirement to Analyst team when implement [Add To Cart] function
			// for No Product Part number suggestion
			const impressionProducts = response.partNumberList.filter(
				partNumber =>
					partNumber.partNumberType !== PartNumberType.DISCONTINUED &&
					partNumber.partNumberType !== PartNumberType.NO_LISTED
			);

			if (impressionProducts.length > 0) {
				ga.ecommerce.viewItemList(
					impressionProducts.map(product => ({
						seriesCode: product.seriesCode ?? '',
						itemListName: ItemListName.SUGGEST_PREVIEW,
					}))
				);
			}

			setLoadingPartNumber(false);
			reserveSuggestPartNumberLog({
				keyword,
				response,
				duration: Date.now() - requestStartTime,
			});
		} catch (error) {
			setLoadingPartNumber(false);
		}
	}, PART_NUMBER_SUGGEST_DELAY);

	const loadKeyword = useDebouncedCallback(
		async (keyword: string) => {
			userKeywordRef.current = keyword;

			try {
				initializedRef.current = true;
				setLoadingKeyword(true);
				keywordCancelerRef.current?.();

				// NOTE: Trimming on the left and remove duplicated spaces, then convert space to "+"
				const cleanedUpKeyword = keyword
					.replace(/^\s+/, '')
					.replace(/\s+/g, ' ');

				const requestStartTime = Date.now();

				const [response] = await Promise.all([
					suggestKeyword(
						{
							keyword: cleanedUpKeyword,
							count: MAX_SUGGESTION_COUNT,
						},
						generateToken(cancel => (keywordCancelerRef.current = cancel))
					),
					loadPartNumber(cleanedUpKeyword),
				]);

				if (loadingTimerRef.current) {
					clearTimeout(loadingTimerRef.current);
				}

				// NOTE: set a delay before hiding keyword to prevent the dropdown from flashing/blinking
				// The reason is part number suggest API responds very quickly -> causing the dropdown
				// to hide immediately after showing if no result
				loadingTimerRef.current = setTimeout(() => {
					setLoadingKeyword(false);
				}, LOADING_DELAY);

				setKeywordResponse(response);

				reserveSuggestKeywordLog({
					keyword,
					response,
					duration: Date.now() - requestStartTime,
				});
			} catch (error) {
				setLoadingKeyword(false);
			}
		},
		KEYWORD_SUGGEST_DELAY,
		{
			// NOTE: Enable to search when first keyword has been inputted.
			leading: true,
		}
	);

	const loadCombo = useCallback(
		async (keyword: string, notDiscontinuedPartNumbers: PartNumber[]) => {
			try {
				setLoadingCombo(true);

				const excludeInnerCode = notDiscontinuedPartNumbers
					.map(partNumber => partNumber.innerCode)
					.join(',');

				const requestStartTime = Date.now();
				const response = await suggestCombo({
					partNumber: keyword,
					count: MAX_COMBO_SUGGESTION_COUNT - notDiscontinuedPartNumbers.length,
					excludeInnerCode,
				});

				setComboResponse(response);

				// TODO: Currently, do not send No Product Page Part number to GA
				// Need to re-check requirement to Analyst team when implement [Add To Cart] function
				// for No Product Part number suggestion
				const impressionProducts = response.partNumberList.filter(
					partNumber => partNumber.partNumberType !== PartNumberType.NO_LISTED
				);

				if (impressionProducts.length > 0) {
					ga.ecommerce.viewItemList(
						impressionProducts.map(product => ({
							seriesCode: product.seriesCode,
							itemListName: ItemListName.SUGGEST_PREVIEW,
						}))
					);
				}

				setLoadingCombo(false);

				reserveSuggestComboLog({
					keyword,
					response,
					duration: Date.now() - requestStartTime,
					isCombo: true,
				});
			} catch (error) {
				setLoadingCombo(false);
			}
		},
		[reserveSuggestComboLog]
	);

	const keywords = useMemo(() => {
		const keywordList = keywordResponse?.keywordList ?? [];

		return keywordList.map((keyword, index) => {
			const href = pagesPath.vona2.result.$url({
				query: { Keyword: keyword },
			});

			return {
				label: keyword,
				href,
				onClick: () => {
					ectLogger.search.clickSuggest({
						searchType: SearchType.KEYWORD_SUGGEST,
						keyword: userKeywordRef.current,
						index,
						href,
						selectedKeyword: keyword,
						suggestionsCount: keywordList.length,
					});
				},
			};
		});
	}, [keywordResponse]);

	const partNumbers = useMemo<Suggestion[]>(() => {
		const partNumberList = (partNumberResponse?.partNumberList ?? []).filter(
			partNumber => partNumber.partNumberType !== PartNumberType.DISCONTINUED
		);
		const unpublishedList =
			partNumberResponse &&
			getUnpublishedList(partNumberResponse.partNumberList);

		return partNumberList.map((partNumber, index) => {
			const href = getPartNumberHref(partNumber);

			return {
				label: getPartNumberLabel(partNumber),
				href,
				onClick: async () => {
					if (partNumber.partNumberType === PartNumberType.NO_LISTED) {
						if (!authenticated) {
							const result = await showLoginModal();
							if (result !== 'LOGGED_IN') {
								return;
							}
						}

						setShowsSuggestion(false);
						showOrderNoListedProductModal(partNumber);
					}

					if (GA_MEASURE_TYPES.includes(partNumber.partNumberType)) {
						ga.ecommerce.selectItem({
							seriesCode: partNumber.seriesCode ?? '',
							itemListName: ItemListName.SUGGEST_PREVIEW,
						});
					}

					ectLogger.search.clickSuggest({
						searchType: SearchType.PART_NUMBER_SUGGEST,
						keyword: userKeywordRef.current,
						index,
						href: getPartNumberHref(partNumber),
						selectedKeyword: partNumber.partNumber,
						suggestionsCount: partNumberList.length,
						brandCode: partNumber.brandCode,
						seriesCode: partNumber.seriesCode,
						unpublishedList,
					});
				},
			};
		});
	}, [
		authenticated,
		partNumberResponse,
		showLoginModal,
		showOrderNoListedProductModal,
	]);

	const discontinuedPartNumbers = useMemo<Suggestion[]>(() => {
		const discontinuedList = (partNumberResponse?.partNumberList ?? []).filter(
			partNumber => partNumber.partNumberType === PartNumberType.DISCONTINUED
		);

		return discontinuedList.map((partNumber, index) => {
			return {
				label: getPartNumberLabel(partNumber),
				href: getPartNumberHref(partNumber),
				onClick: () => {
					ectLogger.search.clickSuggest({
						searchType: SearchType.KEYWORD_SUGGEST,
						keyword: userKeywordRef.current,
						index,
						href: getPartNumberHref(partNumber),
						selectedKeyword: partNumber.partNumber,
						suggestionsCount: discontinuedList.length,
						brandCode: partNumber.brandCode,
						seriesCode: partNumber.seriesCode,
					});
				},
			};
		});
	}, [partNumberResponse]);

	const comboPartNumbers = useMemo<Suggestion[]>(() => {
		const partNumberList = comboResponse?.partNumberList ?? [];

		const unpublishedList =
			comboResponse && getUnpublishedList(comboResponse.partNumberList);

		return partNumberList.map((partNumber, index) => {
			const href = getPartNumberHref(partNumber);

			return {
				label: getPartNumberLabel(partNumber),
				href,
				onClick: () => {
					if (GA_MEASURE_TYPES.includes(partNumber.partNumberType)) {
						ga.ecommerce.selectItem({
							seriesCode: partNumber.seriesCode ?? '',
							itemListName: ItemListName.SUGGEST_PREVIEW,
						});
					}
					ectLogger.search.clickSuggest({
						searchType: SearchType.COMBO_SUGGEST,
						keyword: userKeywordRef.current,
						index,
						href: getPartNumberHref(partNumber),
						selectedKeyword: partNumber.partNumber,
						suggestionsCount: partNumberList.length,
						brandCode: partNumber.brandCode,
						seriesCode: partNumber.seriesCode,
						unpublishedList,
					});
				},
			};
		});
	}, [comboResponse]);

	const clearSuggestions = () => {
		initializedRef.current = false;
		setKeywordResponse(undefined);
		setPartNumberResponse(undefined);
		setComboResponse(undefined);
	};

	return {
		initializedRef,
		keywords,
		partNumbers: [...partNumbers, ...comboPartNumbers],
		discontinuedPartNumbers,
		loadingKeyword,
		loadingPartNumber,
		loadingCombo,
		showsSuggestion,
		setShowsSuggestion,
		loadKeyword,
		clearSuggestions,
	};
};

/**
 * Returns the label name according to the part number type.
 */
const getPartNumberLabel = (item: PartNumber | ComboPartNumber) => {
	const {
		partNumber,
		brandName,
		seriesName,
		partNumberTypeDisp,
		partNumberType,
	} = item;

	const brand = [brandName, seriesName].filter(notEmpty).join(' : ');

	switch (partNumberType) {
		case PartNumberType.NORMAL:
		case PartNumberType.DISCONTINUED:
			return `${partNumber}${brand ? ` [${brand}]` : ''}`;
		case PartNumberType.NO_LISTED:
			return `${partNumber} [${brand}] ※${partNumberTypeDisp}`;
		case PartNumberType.NO_CATALOG:
			return `${partNumber} [${brand} ${partNumberTypeDisp}]`;
	}
};

/**
 * Determines part number link behavior by part number type.
 */
const getPartNumberHref = (
	item: PartNumber | ComboPartNumber
): string | UrlObject | undefined => {
	const { seriesCode, partNumber, partNumberType } = item;

	switch (partNumberType) {
		case PartNumberType.NO_LISTED:
			return;
		case PartNumberType.DISCONTINUED:
			return pagesPath.vona2.result.$url({
				query: { Keyword: item.partNumber },
			});
		default:
			return seriesCode
				? pagesPath.vona2.detail._seriesCode(seriesCode).$url({
						query: {
							PNSearch: partNumber,
							HissuCode: partNumber,
							searchFlow: 'suggest2products',
							Keyword: partNumber,
							list: ItemListName.SUGGEST_PREVIEW,
						},
				  })
				: ''; // NOTE: Should not reach here.
	}
};
