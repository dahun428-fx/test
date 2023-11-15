import { createSelector } from '@reduxjs/toolkit';
import { Flag } from '@/models/api/Flag';
import { SpecViewType } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { AppState } from '@/store';
import {
	PartNumberSpecTypes,
	SpecValueMap,
	TypeSpec,
} from '@/store/modules/pages/keywordSearch/types';
import { uniq } from '@/utils/collection';
import { classifySeriesList } from '@/utils/domain/series';
import { getSpecName, notHidden, selected } from '@/utils/domain/spec';
import { fromEntries } from '@/utils/object';
import { notEmpty, notNull } from '@/utils/predicate';

export function selectStatus(state: AppState) {
	return state.keywordSearch.status;
}

export function selectKeywordResponse(state: AppState) {
	return state.keywordSearch.keywordResponse;
}

export function selectKeywordBanner(state: AppState) {
	return state.keywordSearch.keywordBannerResponse;
}

export function selectBrandList(state: AppState) {
	return state.keywordSearch.brandResponse?.brandList ?? [];
}

/** brand list for popover */
export function selectBrandIndexList(state: AppState) {
	return state.keywordSearch.brandIndexList ?? [];
}

export function selectComboResponse(state: AppState) {
	return state.keywordSearch.comboResponse;
}

export function selectHitCount(state: AppState) {
	const {
		brandResponse,
		typeResponse,
		keywordBannerResponse,
		keywordResponse,
		seriesResponse,
		categoryResponse,
		fullTextResponse,
		techFullTextResponse,
		ideaNoteResponse,
	} = state.keywordSearch;

	if (
		brandResponse &&
		typeResponse &&
		keywordBannerResponse &&
		keywordResponse &&
		seriesResponse &&
		categoryResponse &&
		fullTextResponse &&
		techFullTextResponse &&
		ideaNoteResponse
	) {
		// NOTE: NOT include COMBO result.
		return (
			brandResponse.totalCount +
			typeResponse.totalCount +
			(keywordBannerResponse.bannerPath ? 1 : 0) +
			keywordResponse.keywordList.length +
			seriesResponse.totalCount +
			categoryResponse.totalCount +
			fullTextResponse.totalCount +
			techFullTextResponse.totalCount +
			ideaNoteResponse.searchCount
		);
	}
	return undefined;
}

export const selectHitCountWithComboList = createSelector(
	[selectHitCount, selectComboResponse],
	(hitCount, comboResponse) => {
		if (hitCount === undefined || !comboResponse) {
			return undefined;
		}
		return hitCount + comboResponse.totalCount;
	}
);

export function selectEachHitCount(state: AppState) {
	const {
		brandResponse,
		typeResponse,
		seriesResponse,
		categoryResponse,
		fullTextResponse,
		techFullTextResponse,
		ideaNoteResponse,
		comboResponse,
	} = state.keywordSearch;

	let discontinued = 0;
	if (typeResponse && typeResponse.totalCount > 0) {
		const { discontinuedList } = classifySeriesList(typeResponse);
		discontinued = discontinuedList.length;
	}

	return {
		brand: brandResponse?.totalCount ?? 0,
		category: categoryResponse?.totalCount ?? 0,
		series: seriesResponse?.totalCount ?? 0,
		fullText: fullTextResponse?.totalCount ?? 0,
		techInfo: techFullTextResponse?.totalCount ?? 0,
		type: typeResponse?.totalCount ?? 0,
		inCADLibrary: ideaNoteResponse?.searchCount ?? 0,
		combo: comboResponse?.totalCount ?? 0,
		discontinued,
	};
}

export function selectCategoryResponse(state: AppState) {
	return state.keywordSearch.categoryResponse;
}

export function selectSeriesResponse(state: AppState) {
	return state.keywordSearch.seriesResponse;
}

export function selectTypeResponse(state: AppState) {
	return state.keywordSearch.typeResponse;
}

export function selectTypePartNumberResponses(state: AppState) {
	return state.keywordSearch.partNumberResponses;
}

export function selectIdeaNoteResponse(state: AppState) {
	return state.keywordSearch.ideaNoteResponse;
}

/** previous search series condition  */
export const selectPreviousSearchSeriesCondition = createSelector(
	selectSeriesResponse,
	response => generateSelectedSpec(response)
);

export function generateSelectedSpec(
	response?: SearchSeriesResponse$search
): SearchSeriesRequest {
	if (!response) {
		return {};
	}
	const { categoryList, cadTypeList, daysToShipList, brandList, cValue } =
		response;

	// category
	const selectedCategoryList = categoryList
		.filter(selected)
		.filter(notHidden)
		.map(({ categoryCode }) => categoryCode);

	// cad type
	const selectedCadTypeList = cadTypeList
		.filter(selected)
		.filter(notHidden)
		.map(({ cadType }) => cadType);

	// days to ship
	const selectedDaysToShip = daysToShipList.find(selected);

	// brand
	const selectedBrandCode = brandList
		.filter(selected)
		.filter(notHidden)
		.map(({ brandCode }) => brandCode);

	return {
		brandCode: selectedBrandCode,
		cValueFlag: cValue.selectedFlag,
		categoryCode: selectedCategoryList,
		cadType: selectedCadTypeList,
		daysToShip: selectedDaysToShip?.daysToShip,
	};
}

export function selectFullTextResponse(state: AppState) {
	return state.keywordSearch.fullTextResponse;
}

export function selectTechFullTextResponse(state: AppState) {
	return state.keywordSearch.techFullTextResponse;
}

export function selectPartNumberTypes(typeCount?: number) {
	return createSelector(selectTypeResponse, response => {
		// MEMO: loading などの状態が欲しくなってきたらここは変える
		if (!response || response.totalCount === 0) {
			return { totalCount: 0, typeList: [] };
		}

		const { normalList, discontinuedList, unlistedList } =
			classifySeriesList(response);
		return {
			totalCount: response.totalCount,
			typeList: [...normalList, ...discontinuedList, ...unlistedList].slice(
				0,
				typeCount
			),
			currencyCode: response.currencyCode,
		};
	});
}

export function selectPartNumberTypeSpecs(typeCount?: number) {
	return createSelector(
		[selectPartNumberTypes(typeCount), selectTypePartNumberResponses],
		({ typeList }, partNumberResponses = {}): PartNumberSpecTypes => {
			const responseList = typeList.map(
				type => partNumberResponses[`${type.seriesCode}\t${type.partNumber}`]
			);

			const [firstResponse] = responseList;

			if (responseList.filter(notNull).length === 0 || firstResponse == null) {
				return { specList: [], typeSpecValueList: [] };
			}

			const specList: TypeSpec[] = [];
			const specValueMaps: (SpecValueMap | null)[] = [];

			// タイプリストが1件
			if (typeList.length === 1) {
				const partNumber = responseList[0]?.partNumberList[0];
				// 主に企画廃止品、未掲載品
				if (partNumber == null) {
					return { specList: [], typeSpecValueList: [] };
				}

				const specValueMap = fromEntries(
					partNumber.specValueList.map<[string, string | undefined]>(value => [
						value.specCode,
						value.specValueDisp,
					])
				);

				const specNames = (firstResponse.specList ?? [])
					.filter(
						spec =>
							Flag.isTrue(spec.standardSpecFlag) &&
							specValueMap[spec.specCode] != null
					)
					.map(spec => ({
						specCode: spec.specCode,
						specNameDisp: getSpecName(spec),
					}));

				specList.push(...specNames);
				specValueMaps.push(specValueMap);
			}

			for (const response of responseList) {
				// 主に未掲載品の場合
				if (!response) {
					specValueMaps.push(null);
					continue;
				}

				// 主に企画廃止品の場合
				if (response.partNumberList.length === 0) {
					specValueMaps.push({});
					continue;
				}

				// 型番リストが1件の場合、基本スペックを表示
				if (response.partNumberList.length === 1) {
					const specValueMap = fromEntries(
						// NOTE: 直前で length === 1 のチェックをしているため「!」使用。普通は使っちゃダメ。
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						response.partNumberList[0]!.specValueList.map<
							[string, string | undefined]
						>(value => [value.specCode, value.specValueDisp])
					);

					const specNames = (response.partNumberSpecList ?? [])
						.filter(
							spec =>
								spec.specCode !== 'typeCode' &&
								specValueMap[spec.specCode] != null
						)
						.map(spec => ({
							specCode: spec.specCode,
							specNameDisp: getSpecName(spec),
						}));

					specList.push(...specNames);
					specValueMaps.push(specValueMap);
					continue;
				}

				// 型番候補が複数件ある場合は、各スペックの取りうる範囲を値として表示(partNumberSpecList を表示)
				const partNumberSpecList = response.partNumberSpecList.filter(spec => {
					// タイプは表示しない
					if (spec.specCode === 'typeCode') {
						return false;
					}

					// リスト選択形式は表示しない（numericSpec を表示する可能性があるので対象外）
					if (
						spec.specViewType === SpecViewType.LIST &&
						spec.numericSpec == null
					) {
						return false;
					}

					// 数値範囲リスト、スペック値リストがともにある場合には表示しない
					if (spec.numericSpec != null && spec.specValueList.length > 0) {
						return false;
					}

					// 数値範囲リストが複数件の場合は表示しない
					if (
						spec.numericSpec?.specValueRangeList != null &&
						spec.numericSpec.specValueRangeList.length === 1
					) {
						return false;
					}
					return true;
				});

				specList.push(
					...partNumberSpecList.map(spec => ({
						specCode: spec.specCode,
						specNameDisp: getSpecName(spec),
					}))
				);

				const specValueEntries = partNumberSpecList.map<
					[string, string | undefined]
				>(({ specCode, specValueList, numericSpec }) => {
					// スペック値候補がある場合はそれらを表示
					const visibleSpecValueList = specValueList.filter(notHidden);
					if (visibleSpecValueList.length) {
						return [
							specCode,
							visibleSpecValueList
								.map(({ specValueDisp, childSpecValueList = [] }) => {
									const visibleChildValueList =
										childSpecValueList.filter(notHidden);
									// 子スペックがある場合はそちらも表示する
									if (notEmpty(visibleChildValueList)) {
										const childValues = visibleChildValueList.map(
											child => child.specValueDisp
										);
										return `[${specValueDisp}]${childValues.join(',')}`;
									}
									return specValueDisp;
								})
								.join(','),
						];
					}

					// スペック数値入力範囲が規定されている場合はそちらを表示
					if (numericSpec && numericSpec.specValueRangeList.length) {
						const [range] = numericSpec.specValueRangeList;
						return [
							specCode,
							// NOTE: 直前で length チェックをしているため「!」使用。普通は使っちゃダメ。
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							`[${range!.minValue}~${range!.maxValue}/${range!.stepValue}]`,
						];
					}
					return [specCode, undefined];
				});

				specValueMaps.push(fromEntries(specValueEntries));
			}

			return {
				specList: uniq(specList, spec => spec.specCode),
				typeSpecValueList: typeList.map((type, index) => ({
					seriesStatus: type.seriesStatus,
					valueMap: specValueMaps[index] ?? null,
				})),
			};
		}
	);
}

export function selectHasSeries(state: AppState) {
	return (state.keywordSearch.seriesResponse?.totalCount ?? 0) > 0;
}

export function selectShouldCollapse(state: AppState) {
	return !!state.keywordSearch.shouldCollapse;
}

export function selectResponseTime(state: AppState) {
	return state.keywordSearch.responseTime;
}

export function selectBrandModeFlag(state: AppState) {
	return state.keywordSearch.categoryResponse?.brandModeFlag;
}

/**
 * Spec Panel display state for mobile.
 */
export function selectShowsSpecPanel(state: AppState) {
	return !!state.keywordSearch.showsSpecPanel;
}
