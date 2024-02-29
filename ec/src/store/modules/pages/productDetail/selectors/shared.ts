import { createSelector } from '@reduxjs/toolkit';
import { Flag } from '@/models/api/Flag';
import SimilarSearchType from '@/models/api/constants/SimilarSearchType';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { TabType } from '@/models/api/msm/ect/series/shared';
import { wysiwygTabConfig } from '@/models/domain/series/tab';
import type { Wysiwyg } from '@/models/domain/series/wysiwyg';
import { AppState } from '@/store';
import { assertNotNull } from '@/utils/assertions';
import { priceNeedsQuote } from '@/utils/domain/price';
import { getSpecAttributes } from '@/utils/domain/spec';
import { fromEntries, pick } from '@/utils/object';
import { notEmpty } from '@/utils/predicate';

/** product review response */
export function selectReviewResponse(state: AppState) {
	return state.productDetail.reviewResponse;
}

/** product detail template */
export function selectTemplateType(state: AppState) {
	return state.productDetail.templateType;
}

/** search series response(detail) */
export function selectSeriesResponse(state: AppState) {
	return state.productDetail.seriesResponse;
}

/** search partNumber response(search) */
export function selectPartNumberResponse(state: AppState) {
	return state.productDetail.partNumberResponse;
}

/** Part number list */
export const selectPartNumberList = createSelector(
	[selectPartNumberResponse],
	partNumberResponse => {
		assertNotNull(partNumberResponse?.partNumberList);
		return partNumberResponse.partNumberList;
	}
);

/** Part number total count */
export const selectPartNumberTotalCount = createSelector(
	[selectPartNumberResponse],
	partNumberResponse => partNumberResponse?.totalCount
);

/**
 * Current search partNumber response
 * Search by user selected criteria
 */
export function selectCurrentPartNumberResponse(state: AppState) {
	return state.productDetail.currentPartNumberResponse;
}

/** load state of part number list */
export function selectPartNumberListLoading(state: AppState) {
	return state.productDetail.loading ?? false;
}

/** page of part number list */
export function selectPartNumberListPage(state: AppState) {
	return state.productDetail.page ?? 1;
}

/** Current part number list */
export const selectCurrentPartNumberList = createSelector(
	[selectCurrentPartNumberResponse],
	currentPartNumberResponse => currentPartNumberResponse?.partNumberList ?? []
);

/** Current part number total count */
export const selectCurrentPartNumberTotalCount = createSelector(
	[selectCurrentPartNumberResponse],
	currentPartNumberResponse => currentPartNumberResponse?.totalCount
);

/** Raw interest recommend response */
export function selectInterestRecommendResponse(state: AppState) {
	return state.productDetail.interestRecommendResponse;
}

/** product details download parameters on simple template */
export const selectSimpleProductDetailsDownloadParameters = (
	partNumber: string
) =>
	createSelector(
		[selectSeriesResponse, selectCurrentPartNumberResponse],
		(seriesResponse, partNumberResponse) => {
			assertNotNull(seriesResponse);
			assertNotNull(partNumberResponse);
			return {
				seriesInfo: seriesResponse,
				partNumberInfo: {
					...partNumberResponse,
					// REFER: ect-web-my/src_front/vcommon/common/js/_vona2/objects/detail_simple.js#renderedList
					// Specified part number info
					// NOTE: 予めスペックで絞られた状態で、商品詳細に遷移してきた場合、
					//       対象の型番が型番リスト内に存在しないことがあるが、それは現行通り。
					partNumberList: partNumberResponse?.partNumberList.filter(
						pn => pn.partNumber === partNumber
					),
					totalCount: 1,
					// NOTE: Error files will be downloaded unless the completeFlag=TRUE.
					completeFlag: Flag.TRUE,
				},
			};
		}
	);

/** Raw Series info */
export function selectSeries(state: AppState) {
	const [series] = state.productDetail.seriesResponse?.seriesList ?? [];
	assertNotNull(series);
	return series;
}

export function selectSeriesWithCurrency(state: AppState) {
	const response = state.productDetail.seriesResponse;
	assertNotNull(response);
	const { currencyCode, seriesList } = response;
	assertNotNull(seriesList[0]);
	return { ...seriesList[0], currencyCode };
}

export function selectFirstPartNumberWithCurrency(state: AppState) {
	const response = state.productDetail.currentPartNumberResponse;
	assertNotNull(response);
	const { currencyCode, partNumberList, completeFlag } = response;
	return { ...partNumberList[0], currencyCode, completeFlag };
}

/**
 * Raw part number info for the specified part number.
 * @param partNumber
 */
export function selectPartNumber(partNumber: string) {
	return createSelector(selectCurrentPartNumberResponse, response => {
		if (!response) {
			return null;
		}
		return (
			response.partNumberList.find(pn => pn.partNumber === partNumber) ?? null
		);
	});
}

/** Series response currencyCode */
export function selectSeriesCurrency(state: AppState) {
	return state.productDetail.seriesResponse?.currencyCode;
}

/** Part number response currencyCode */
export function selectPartNumberCurrency(state: AppState) {
	return state.productDetail.currentPartNumberResponse?.currencyCode;
}

export function selectInputPartNumber(state: AppState) {
	return state.productDetail.inputPartNumber;
}

/**
 * Returns a part number info only if the part number has been refined to one
 * and the part number is definite. Otherwise, null is returned.
 * - 型番が1件に絞り込まれ、型番確定している場合のみ型番の情報を返す。それ以外は null を返す。
 * - REVIEW: 命名は completed で良いか？
 */
export const selectCompletedPartNumber = createSelector(
	[selectCurrentPartNumberList, selectCompleteFlag],
	(partNumberList, completeFlag) => {
		if (partNumberList == null || completeFlag == null) {
			return null;
		}

		if (partNumberList.length !== 1 || Flag.isFalse(completeFlag)) {
			return null;
		}

		return partNumberList[0];
	}
);

/** Raw series spec list */
export function selectSeriesSpecList(state: AppState) {
	const specList = state.productDetail.seriesResponse?.specList;
	assertNotNull(specList);
	return specList;
}

export function selectPartNumberSpecList(state: AppState) {
	return state.productDetail.currentPartNumberResponse?.specList ?? [];
}

export function selectPriceCache(state: AppState) {
	return state.productDetail.priceCache;
}

/** Part number regulation list */
export function selectRegulationList(state: AppState) {
	return state.productDetail.currentPartNumberResponse?.regulationList ?? [];
}

/** The Series standard spec list */
export const selectStandardSpecList = createSelector(
	[selectSeries, selectSeriesSpecList],
	(series, specList) => {
		return series.standardSpecValueList.map(specValue => ({
			...specValue,
			...getSpecAttributes(specValue.specCode, specList),
		}));
	}
);

/** Part number is completed? */
export function selectCompleteFlag(state: AppState) {
	return state.productDetail.currentPartNumberResponse?.completeFlag;
}

/** Part number is simple? */
export function selectPartNumberSimpleFlag(partNumber: string) {
	return createSelector(
		selectPartNumber(partNumber),
		partNumber => partNumber?.simpleFlag
	);
}

/** Category code List from top to bottom */
export const selectCategoryCodeList = createSelector(selectSeries, series => {
	const categoryCodeList = series.categoryList.map(
		category => category.categoryCode
	);
	if (series.categoryCode) {
		return [...categoryCodeList, series.categoryCode];
	}
	return categoryCodeList;
});

/** Category info List from top to bottom */
export const selectCategoryInfoList = createSelector(
	selectSeries,
	({ categoryCode = '', categoryName = '', categoryList }) => {
		const categoryInfoList = categoryList.map(
			({ categoryCode, categoryName }) => ({ categoryCode, categoryName })
		);

		return [...categoryInfoList, { categoryCode, categoryName }];
	}
);

/**
 * Part number spec list for search similar
 * @param partNumber
 */
export const selectSearchSimilarSpecList = createSelector(
	[selectPartNumberSpecList, selectCompletedPartNumber],
	(specList, partNumber) => {
		if (!partNumber) {
			return [];
		}

		const specValues = fromEntries(
			partNumber.specValueList
				.filter(spec => !!spec.specCode)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				.map(value => [value.specCode!, value])
		);

		return specList
			.map(spec => ({ ...spec, ...specValues[spec.specCode] }))
			.filter(
				spec =>
					(spec.similarSearchType === SimilarSearchType.USE_CHECKIN ||
						spec.similarSearchType === SimilarSearchType.USE_CHECKOUT) &&
					spec.specValue !== undefined
			);
	}
);

export const selectRelatedDigitalBook = createSelector(selectSeries, series => {
	const { digitalBookList = [], digitalBookNoticeText } = series;
	return { digitalBookList, digitalBookNoticeText };
});

/** Digital catalog */
export const selectDigitalCatalog = createSelector([selectSeries], series => {
	if (!series.digitalBookPdfUrl) {
		return null;
	}

	if (Flag.isTrue(series.misumiFlag)) {
		return {
			digitalBookPdfUrl: series.digitalBookPdfUrl,
			digitalBookPage: series.digitalBookList?.[0]?.digitalBookPage,
			pdfNoticeText: series.pdfNoticeText,
			misumiFlag: series.misumiFlag,
		};
	} else {
		// ect-web-my の単純系テンプレート simple.twig の実装によると、VONA については、
		// digitalBookPage の指定があっても無視する模様。
		// TODO: complex template でどうなのかは要確認。
		// According to the implementation of ect-web-my's simple.twig template,
		// in case of VONA products, even if digitalBookPage is specified,
		// it seems to ignore it.
		// TODO: Please confirm complex template when implementing.
		return {
			digitalBookPdfUrl: series.digitalBookPdfUrl,
			pdfNoticeText: series.pdfNoticeText,
			misumiFlag: series.misumiFlag,
		};
	}
});

export const selectSoleProductAttributes = createSelector(
	[
		selectSeries,
		selectCategoryCodeList,
		selectCurrentPartNumberResponse,
		selectSearchSimilarSpecList,
		selectTemplateType,
		selectInputPartNumber,
	],
	(
		series,
		categoryCodeList,
		partNumberResponse,
		similarSpecList,
		templateType,
		inputPartNumber
	) => {
		assertNotNull(partNumberResponse);
		const { completeFlag, partNumberList } = partNumberResponse;

		// NOTE: パターンH, WYSIWYG においては、型番の入稿がない可能性があるため、
		//       型番が常に入稿される他のテンプレートとは、ロジックを分ける
		if (
			templateType === TemplateType.PATTERN_H ||
			templateType === TemplateType.WYSIWYG
		) {
			return {
				seriesCode: series.seriesCode,
				brandCode: series.brandCode,
				displayStandardPriceFlag: series.displayStandardPriceFlag,
				similarSpecList: [], // NOTE: パターンH, WYSIWYG の商品は類似品検索機能がないため不要
				categoryCodeList: [], // NOTE: パターンH, WYSIWYG の商品は類似品検索機能がないため不要
				partNumber: inputPartNumber,
				// NOTE: 型番が入力されていたら操作可能とするため、擬似的に型番確定状態とする
				completeFlag: Flag.toFlag(inputPartNumber),
			};
		}

		if (partNumberList.length === 1) {
			const [partNumber] = partNumberList;
			assertNotNull(partNumber);
			return {
				completeFlag,
				partNumber: partNumber.partNumber,
				innerCode: partNumber.innerCode,
				brandCode: series.brandCode,
				minQuantity: partNumber.minQuantity,
				orderUnit: partNumber.orderUnit,
				piecesPerPackage: partNumber.piecesPerPackage,
				content: partNumber.content,
				displayStandardPriceFlag: series.displayStandardPriceFlag,
				discontinuedProductFlag: partNumber.discontinuedProductFlag,
				cautionList: partNumber.partNumberCautionList
					.map(caution => caution.partNumberCautionText)
					.filter(notEmpty),
				noticeList: partNumber.partNumberNoticeList
					.map(notice => notice.partNumberNoticeText)
					.filter(notEmpty),
				seriesCode: series.seriesCode,
				categoryName: series.categoryName,
				categoryCodeList,
				similarSpecList,
			};
		}
		return {
			completeFlag,
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			categoryCodeList,
			similarSpecList,
			displayStandardPriceFlag: series.displayStandardPriceFlag,
		};
	}
);

/** alteration specs */
export function selectAlterationSpecList(state: AppState) {
	return (
		state.productDetail.currentPartNumberResponse?.alterationSpecList ?? []
	);
}

/** product detail / related part number response */
export function selectRelatedPartNumberResponse(state: AppState) {
	return state.productDetail.relatedPartNumberResponse;
}

/** product detail / faq response */
export function selectFaqResponse(state: AppState) {
	return state.productDetail.faqResponse;
}

/** product detail / purchase recommend response */
export function selectPurchaseRecommendResponse(state: AppState) {
	return state.productDetail.purchaseRecommendResponse;
}

export function selectInterestRecommendSeriesList(state: AppState) {
	return state.productDetail.interestRecommendSeriesList;
}

export const selectInterestRecommendSeriesSpecValues = createSelector(
	selectInterestRecommendSeriesList,
	seriesList => {
		return fromEntries(
			(seriesList ?? []).map(series => [
				series.seriesCode,
				fromEntries(
					series.standardSpecValueList
						.filter(value => value.specCode != null)
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						.map(value => [value.specCode!, value])
				),
			])
		);
	}
);

export const selectMoldExpressType = createSelector(
	selectCurrentPartNumberResponse,
	currentPartNumberResponse => {
		const partNumberSpecList =
			currentPartNumberResponse?.partNumberSpecList || [];
		const partNumberSpecItem = partNumberSpecList.find(
			item => item.specCode === 'typeCode'
		);

		if (!partNumberSpecItem) {
			return '';
		}

		return (
			partNumberSpecItem.specValueList.find(item =>
				Flag.isTrue(item.selectedFlag)
			)?.specValue ?? ''
		);
	}
);

export const selectMainPhotoUrl = createSelector(selectSeries, series => {
	if (!series.productImageList.length) {
		return;
	}
	return series.productImageList[0]?.url
		.replace(/(\?.*?)\$[^\$]+\$(&?)/, '$1')
		.replace(/[\?&]+$/, '');
});

export function selectChecking(state: AppState) {
	return state.productDetail.checking ?? false;
}

export function selectQuantity(state: AppState) {
	return state.productDetail.quantity ?? null;
}

export const selectPrice = createSelector(
	[
		selectTemplateType,
		selectFirstPartNumberWithCurrency,
		selectInputPartNumber,
		selectPriceCache,
		selectQuantity,
	],
	(templateType, firstPartNumber, inputPartNumber, cache, quantity) => {
		if (cache == null || quantity == null) {
			return null;
		}

		if (
			templateType === TemplateType.PATTERN_H ||
			templateType === TemplateType.WYSIWYG
		) {
			return cache[`${inputPartNumber}\t${quantity}`] ?? null;
		}

		return cache[`${firstPartNumber.partNumber}\t${quantity}`] ?? null;
	}
);

export const selectSort = (state: AppState) => {
	return state.productDetail.sort;
};

/** Product description WYSIWYG contents list */
export const selectWysiwygList = createSelector([selectSeries], series => {
	// if unknown tabType, draw with VONA pattern (ect-web-my's fallback logic on 2022/8/25)
	const tabList =
		wysiwygTabConfig[series.tabType] ?? wysiwygTabConfig[TabType.VONA];

	const wysiwygList: Wysiwyg[] = tabList
		.map(tab => ({
			id: tab.tabId,
			html: tab.htmlNameList.map(htmlName => series[htmlName] ?? '').join(''),
		}))
		.filter(section => section.html);

	return wysiwygList;
});

type ProductPriceInfo = {
	minStandardUnitPrice?: number;
	maxStandardUnitPrice?: number;
	minCampaignUnitPrice?: number;
	maxCampaignUnitPrice?: number;
	campaignEndDate?: string;
	currencyCode?: string;
};

export const selectProductPriceInfo = createSelector(
	[selectSeriesWithCurrency, selectFirstPartNumberWithCurrency, selectPrice],
	(series, partNumber, price): ProductPriceInfo => {
		// 価格チェック済みの場合、価格チェック結果の単価
		if (price) {
			// 要見積もりの場合は価格を表示しない
			if (priceNeedsQuote(price)) {
				return {
					currencyCode: price.currencyCode,
				};
			}

			// 標準単価より売値が小さい場合のみキャンペーン価格として売値を返す
			if (
				price.standardUnitPrice &&
				price.unitPrice &&
				price.unitPrice < price.standardUnitPrice
			) {
				return {
					minStandardUnitPrice: price.standardUnitPrice,
					minCampaignUnitPrice: price.unitPrice,
					currencyCode: price.currencyCode,
				};
			}
			return {
				minStandardUnitPrice: price.unitPrice,
				currencyCode: price.currencyCode,
			};
		}

		// 型番確定済みであれば、型番の標準単価
		if (Flag.isTrue(partNumber.completeFlag)) {
			return {
				minStandardUnitPrice: partNumber.standardUnitPrice,
				campaignEndDate: partNumber.campaignEndDate,
				minCampaignUnitPrice: partNumber.campaignUnitPrice,
				currencyCode: partNumber.currencyCode,
			};
		}

		// それ以外はシリーズの標準単価
		return pick(
			series,
			'minStandardUnitPrice',
			'maxStandardUnitPrice',
			'campaignEndDate',
			'minCampaignUnitPrice',
			'maxCampaignUnitPrice',
			'currencyCode'
		);
	}
);

export function selectUnitLibraryResponse(state: AppState) {
	return state.productDetail.unitLibraryResponse;
}
