import { CancelToken } from 'axios';
import { TFunction } from 'react-i18next';
import { Dispatch } from 'redux';
import { selectPrevSearchCondition } from './selectors/complex';
import { actions } from './slice';
import {
	selectCompletedPartNumber,
	selectFirstPartNumberWithCurrency,
	selectInputPartNumber,
	selectPriceCache,
	selectShowsPartNumberListPanel,
	selectShowsSpecPanel,
} from '.';
import { checkPrice } from '@/api/services/checkPrice';
import { searchFaq } from '@/api/services/searchFaq';
import { searchInterestRecommend } from '@/api/services/searchInterestRecommend';
import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchPurchaseRecommend } from '@/api/services/searchPurchaseRecommend';
import { searchRelatedPartNumber } from '@/api/services/searchRelatedPartNumber';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { searchUnitLibrary } from '@/api/services/searchUnitLibrary';
import { ApplicationError } from '@/errors/ApplicationError';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { searchPartNumber$search as parametricUnitSearchPartNumber } from '@/api/services/parametricUnit';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { AppStore, store } from '@/store';
import { selectUser } from '@/store/modules/auth';
import { selectSeries } from '@/store/modules/pages/productDetail/selectors/shared';
import { assertNotNull } from '@/utils/assertions';
import {
	correctPriceIfPurchaseLinkUser,
	getMinOrderQuantity,
} from '@/utils/domain/price';
import { assertQuantity } from '@/utils/domain/quantity';
import { getTemplateType } from '@/utils/domain/series';
import { shouldRetrySpecSearch, selected } from '@/utils/domain/spec';
import { fromEntries } from '@/utils/object';
import { notNull } from '@/utils/predicate';
import {
	searchProductReviews,
	searchReviewConfig,
	searchReviewInfo,
} from '@/api/services/review/review';
import {
	getPageSize as getReviewPageSize,
	isAvailaleReviewState,
} from '@/utils/domain/review';
import { first } from '@/utils/collection';
import {
	ReviewConfig,
	ReviewSortType,
} from '@/models/api/review/SearchReviewResponse';
import { QnaConfig, QnaSortType } from '@/models/api/qna/SearchQnaResponse';
import {
	searchProductQnas,
	searchQnaConfig,
	searchQnaInfo,
} from '@/api/services/qna/qna';
import {
	isAvailaleQnaState,
	getPageSize as getQnaPageSize,
} from '@/utils/domain/qna';

type LoadPayload = {
	seriesCode: string;
	partNumber?: string;
	page: number;
	template?: string;
	seriesResponse: SearchSeriesResponse$detail;
	partNumberResponse: SearchPartNumberResponse$search;
};

/**
 * Load series and part number information for product detail page.
 */
export function loadOperation(dispatch: Dispatch) {
	return async ({
		seriesCode,
		partNumber,
		page,
		template,
		seriesResponse,
		partNumberResponse,
	}: LoadPayload) => {
		const series = seriesResponse.seriesList[0];
		assertNotNull(series);

		const templateType = getTemplateType(series.templateType, template);
		const user = selectUser(store.getState());

		dispatch(
			actions.load({
				// Prefer the template specified in the query
				templateType,
				seriesResponse,
				partNumberResponse,
				page,
				// NOTE: Reset sort parameter on first load.
				sort: undefined,
				inputPartNumber:
					templateType === TemplateType.PATTERN_H ||
					templateType === TemplateType.WYSIWYG
						? partNumber
						: undefined,
			})
		);

		const { completeFlag, partNumberList } = partNumberResponse;

		// Load information related to the product

		// If the part number is fixed to a simple part number at the time of initial loading,
		// the related part number is obtained.
		if (
			Flag.isTrue(completeFlag) &&
			Flag.isTrue(partNumberList[0]?.simpleFlag)
		) {
			searchRelatedPartNumber({ seriesCode, partNumber })
				.then(relatedPartNumberResponse =>
					dispatch(actions.update({ relatedPartNumberResponse }))
				)
				.catch(noop);
		}

		//review config
		const reviewConfig: ReviewConfig = await searchReviewConfig()
			.then(reviewResponse => {
				const config = first(reviewResponse?.data);
				dispatch(
					actions.updateReview({
						reviewConfig: config,
					})
				);
				return config;
			})
			.catch(noop);

		if (isAvailaleReviewState(reviewConfig)) {
			//review data
			searchProductReviews({
				order_type: ReviewSortType.ORDER_BY_RATE,
				page_length: getReviewPageSize(reviewConfig.reviewState),
				page_no: 1,
				reg_id: user?.userCode ?? '',
				series_code: seriesCode,
			})
				.then(reviewResponse => {
					dispatch(actions.updateReview({ reviewData: reviewResponse?.data }));
				})
				.catch(noop);
			searchReviewInfo(seriesCode)
				.then(reviewResponse => {
					const reviewInfo = first(reviewResponse?.data);
					dispatch(actions.updateReview({ reviewInfo: reviewInfo }));
				})
				.catch(noop);
		}

		const qnaConfig: QnaConfig = await searchQnaConfig()
			.then(qnaResponse => {
				const config = first(qnaResponse?.data);
				dispatch(
					actions.updateQna({
						qnaConfig: config,
					})
				);
				return config;
			})
			.catch(noop);

		if (isAvailaleQnaState(qnaConfig)) {
			const regId = user?.userCode ?? '';
			searchProductQnas({
				series_code: seriesCode,
				order_type: QnaSortType.ORDER_BY_DEFAULT,
				page_length: getQnaPageSize(qnaConfig.qnaState),
				page_no: 1,
				reg_id: regId,
			})
				.then(qnaResponse => {
					dispatch(actions.updateQna({ qnaData: qnaResponse.data }));
				})
				.catch(noop);
			searchQnaInfo(seriesCode, regId)
				.then(qnaResponse => {
					const qnaInfo = first(qnaResponse?.data);
					dispatch(actions.updateQna({ qnaInfo: qnaInfo }));
				})
				.catch(noop);
		}

		searchFaq({ seriesCode })
			.then(faqResponse => dispatch(actions.update({ faqResponse })))
			.catch(noop);
		searchPurchaseRecommend({ seriesCode, count: 5 })
			.then(purchaseRecommendResponse =>
				dispatch(actions.update({ purchaseRecommendResponse }))
			)
			.catch(noop);
		searchInterestRecommend({ seriesCode })
			.then(response => {
				if (response.totalCount > 0) {
					searchSeries$detail({
						seriesCode: response.interestRecommendList.map(
							({ seriesCode }) => seriesCode
						),
					}).then(({ seriesList }) =>
						dispatch(
							actions.update({
								interestRecommendResponse: response,
								interestRecommendSeriesList: seriesList,
							})
						)
					);
				} else {
					dispatch(
						actions.update({
							interestRecommendResponse: response,
							interestRecommendSeriesList: [],
						})
					);
				}
			})
			.catch(noop);
		searchUnitLibrary({ seriesCode })
			.then(unitLibraryResponse =>
				dispatch(actions.update({ unitLibraryResponse }))
			)
			.catch(noop);
	};
}

/**
 * Clear filter of part number list
 */
export function clearPartNumberFilter(store: AppStore) {
	return async (
		condition?: SearchPartNumberRequest,
		cancelToken?: CancelToken
	) => {
		const { seriesCode } = selectSeries(store.getState());
		store.dispatch(actions.update({ loading: true }));

		try {
			const response = await searchPartNumber$search(
				{ ...condition, seriesCode },
				cancelToken
			);
			store.dispatch(
				actions.update({
					currentPartNumberResponse: response,
					focusesAlterationSpecs: false,
					loading: false,
					page: 1,
				})
			);
		} catch (error) {
			store.dispatch(actions.update({ loading: false }));
			throw error;
		}
	};
}

type SearchOption = {
	clearCurrentCondition?: boolean;
	cancelToken?: CancelToken;
	templateType?: TemplateType;
};

/**
 * Search part number.
 * Updates "currentPartNumberResponse".
 * @param options SearchOption
 * @returns SearchPartNumberResponse
 */
async function searchPartNumberSearch(
	request: SearchPartNumberRequest,
	options: SearchOption
) {
	let response;
	switch (options.templateType) {
		case TemplateType.PU:
			response = await parametricUnitSearchPartNumber(
				request,
				options.cancelToken
			);
			break;
		default:
			response = await searchPartNumber$search(request, options.cancelToken);
	}
	return response;
}

/**
 * Search part number by condition.
 * Updates "currentPartNumberResponse".
 */
export function searchPartNumberOperation(store: AppStore) {
	return async (
		condition: SearchPartNumberRequest,
		options: SearchOption = {}
	) => {
		let request: SearchPartNumberRequest = {
			specSortFlag: Flag.FALSE,
			allSpecFlag: Flag.FALSE,
			...condition,
		};

		if (!options.clearCurrentCondition) {
			request = {
				...selectPrevSearchCondition(store.getState()),
				...request,
			};
		}
		store.dispatch(actions.update({ loading: true }));

		try {
			const previousCompletedPartNumber = selectCompletedPartNumber(
				store.getState()
			);

			// WARN: cannot get latest response if 'fixedInfo' is set in case of PU template api
			if (options.templateType === TemplateType.PU) {
				delete request['fixedInfo'];
			}

			let response = await searchPartNumberSearch(request, options);
			// NOTE: Retry request when at least 1 spec of partNumberSpecList, daysToShipList, cadTypeList
			// 		 from response contains selectedFlag = 1  and hiddenFlag = 1
			if (shouldRetrySpecSearch(response)) {
				const { partNumberSpecList, daysToShipList, cadTypeList } = response;

				// selective form specs
				const selectedSpecValues = fromEntries(
					partNumberSpecList.map(spec => [
						spec.specCode,
						[
							...spec.specValueList
								.filter(selected)
								.map(value => value.specValue),
							...spec.specValueList
								.flatMap(spec => spec.childSpecValueList)
								.filter(notNull)
								.filter(selected)
								.map(value => value.specValue),
						],
					])
				);

				// cad type
				const selectedCadTypeList = cadTypeList
					.filter(selected)
					.map(({ cadType }) => cadType);

				// days to ship
				const selectedDaysToShip = daysToShipList.find(selected);

				request = {
					...request,
					...selectedSpecValues,
					daysToShip: selectedDaysToShip?.daysToShip,
					cadType: selectedCadTypeList,
				};
				response = await searchPartNumberSearch(request, options);
			}

			store.dispatch(
				actions.update({
					currentPartNumberResponse: response,
					loading: false,
					page: condition.page ?? 1,
					sort: condition.sort,
				})
			);

			if (Flag.isTrue(response.completeFlag)) {
				const [partNumber] = response.partNumberList;
				store.dispatch(
					actions.update({
						quantity: partNumber?.minQuantity ?? partNumber?.orderUnit ?? 1,
					})
				);
			}

			if (
				Flag.isTrue(response.completeFlag) &&
				notNull(response.partNumberList[0])
			) {
				ga.events.partNumberGenerated({ ...response.partNumberList[0] });
				aa.events.sendPartNumberGeneratedOnce();

				// 型番確定していても、前回と同じ型番であればログ送信しない
				if (
					!previousCompletedPartNumber ||
					previousCompletedPartNumber.partNumber !==
						response.partNumberList[0].partNumber
				) {
					const { brandCode, seriesCode } = selectSeries(store.getState());
					ectLogger.partNumber.complete({
						brandCode,
						seriesCode,
						partNumber: response.partNumberList[0].partNumber,
					});
				}
			}
		} catch (error) {
			store.dispatch(actions.update({ loading: false }));
			throw error;
		}
	};
}

export function searchPartNumberWithInput(dispatch: Dispatch) {
	return async (payload: { seriesCode: string; partNumber: string }) => {
		searchPartNumber$search({ ...payload })
			.then(response =>
				dispatch(
					actions.update({
						currentPartNumberResponse: response,
						inputPartNumber: payload.partNumber,
					})
				)
			)
			.catch(noop);
	};
}

export const updatePartNumberSearchConditionOperation = (store: AppStore) => {
	return (condition: Omit<SearchPartNumberRequest, 'seriesCode'>) => {
		store.dispatch(actions.update(condition));
	};
};

export function checkPriceOperation({ getState, dispatch }: AppStore) {
	/**
	 * WARN: 型番未確定時はこの operation を呼んではならない
	 * @throws {AssertionError}
	 * @throws {MsmApiError}
	 */
	async function check(): Promise<void>;
	/**
	 * WARN: 型番未確定時はこの operation を呼んではならない
	 * @param quantity
	 * @param t
	 * @throws {AssertionError}
	 * @throws {MsmApiError}
	 */
	async function check(quantity: number | null, t: TFunction): Promise<void>;
	async function check(qty?: number | null, t?: TFunction): Promise<void> {
		const storeState = getState();
		const firstPartNumber = selectFirstPartNumberWithCurrency(storeState);
		const inputPartNumber = selectInputPartNumber(storeState);
		const series = selectSeries(storeState);
		const priceCache = selectPriceCache(storeState);
		const userInfo = selectUser(storeState);

		// NOTE: 型番未確定時や型番未入力状態では、呼ばれることを想定していない。
		if (Flag.isFalse(firstPartNumber.completeFlag) && inputPartNumber == null) {
			throw new ApplicationError(
				`Can not check price. series: [${series.seriesCode}] partNumber: [${inputPartNumber}] completeFlag: [${firstPartNumber.completeFlag}]`
			);
		}

		// 数量が指定されている場合は、数量要件を満たしているかチェック
		if (qty !== undefined && t) {
			assertQuantity(qty, firstPartNumber, t);
		}

		// 数量が指定されていない場合は、数量要件から最小購入数量を算出して利用する
		const quantity = qty ?? getMinOrderQuantity(firstPartNumber);
		// NOTE: if template is wysiwyg or patternH, should check price using part number entered by user
		const partNumber = inputPartNumber ?? firstPartNumber.partNumber;
		assertNotNull(partNumber);

		// 価格チェックのキャッシュがある場合は利用する
		if (priceCache[`${partNumber}\t${quantity}`]) {
			dispatch(actions.update({ quantity }));
			ga.events.checkPrice({
				partNumberCount: 1,
				partNumber,
				innerCode: firstPartNumber.innerCode,
			});
			return;
		}

		dispatch(actions.update({ checking: true }));

		// check price
		// No specified quantity, derive by minOrderQuantity or orderUnit.
		try {
			const {
				priceList: [price],
			} = await checkPrice({
				productList: [{ partNumber, brandCode: series.brandCode, quantity }],
			});

			assertNotNull(price);

			dispatch(
				actions.updatePriceCache(
					correctPriceIfPurchaseLinkUser(price, userInfo)
				)
			);
			aa.events.sendCheckPrice();
			ga.events.checkPrice({
				partNumberCount: 1,
				partNumber,
				innerCode: firstPartNumber.innerCode,
			});
		} finally {
			dispatch(actions.update({ checking: false }));
		}
	}

	return check;
}

export function updateQuantity(dispatch: Dispatch) {
	return (quantity: number | null) => {
		dispatch(actions.update({ quantity }));
	};
}

export function clearPriceCache(dispatch: Dispatch) {
	return () => {
		dispatch(actions.update({ priceCache: {} }));
	};
}

export function changeFocusesAlterationSpecs(dispatch: Dispatch) {
	return (focuses?: boolean) => {
		dispatch(actions.update({ focusesAlterationSpecs: focuses }));
	};
}

/** Toggle showsSpecPanel for mobile */
export function toggleShowsSpecPanel(store: AppStore) {
	return () => {
		const showsSpecPanel = selectShowsSpecPanel(store.getState());
		store.dispatch(actions.update({ showsSpecPanel: !showsSpecPanel }));
	};
}

/** Toggle showsPartNumberListPanel for mobile */
export function toggleShowsPartNumberListPanel(store: AppStore) {
	return () => {
		const showsPartNumberListPanel = selectShowsPartNumberListPanel(
			store.getState()
		);
		store.dispatch(
			actions.update({ showsPartNumberListPanel: !showsPartNumberListPanel })
		);
	};
}

/**
 * Clear product detail module state.
 */
export function clearOperation(dispatch: Dispatch) {
	return () => {
		dispatch(actions.clear());
	};
}

function noop() {
	// noop
}
