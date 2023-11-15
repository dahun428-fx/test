import { createSelector } from '@reduxjs/toolkit';
import { QueryCondition } from '@/components/pc/domain/category/context';
import { AppState } from '@/store';
import { convertCadTypeToQueryParameter } from '@/utils/domain/category';
import {
	selected,
	flatSpecValueList,
	stringifySpecValues,
} from '@/utils/domain/spec';
import { removeEmptyProperties } from '@/utils/object';

export function selectCategoryResponse(state: AppState) {
	return state.category.categoryResponse;
}

export function selectSeriesResponse(state: AppState) {
	return state.category.seriesResponse;
}

export function selectBrandResponse(state: AppState) {
	return state.category.brandResponse;
}

export function selectBrandIndexList(state: AppState) {
	return state.category?.brandIndexList ?? [];
}

/** previous search series condition  */
export const selectPreviousSearchSeriesCondition = createSelector(
	selectSeriesResponse,
	response => {
		if (!response) {
			return {};
		}

		const { cadTypeList, daysToShipList, brandList, cValue, seriesSpecList } =
			response;

		const selectedSpec: Record<string, string[]> = {};
		seriesSpecList.forEach(spec => {
			const flatMapSpecValueList = flatSpecValueList(spec.specValueList);

			selectedSpec[spec.specCode] = flatMapSpecValueList
				.filter(selected)
				.map(item => item.specValue);
		});

		const selectedBrandCode = brandList
			.filter(selected)
			.map(({ brandCode }) => brandCode);

		// cad type
		const selectedCadTypeList = cadTypeList
			.filter(selected)
			.map(({ cadType }) => cadType);

		// days to ship
		const selectedDaysToShip = daysToShipList.find(selected);

		// TODO: append other conditions if needed (e.g. categorySpec when implementing spec filter)
		return {
			brandCode: selectedBrandCode,
			cValueFlag: cValue.selectedFlag,
			cadType: selectedCadTypeList,
			daysToShip: selectedDaysToShip?.daysToShip,
			...removeEmptyProperties(selectedSpec),
		};
	}
);

export function selectDaysToShipList(state: AppState) {
	return state.category.seriesResponse?.daysToShipList ?? [];
}

export function selectParams(state: AppState) {
	const params: QueryCondition = {};

	if (!state.category.seriesResponse) {
		return params;
	}

	const { cadTypeList, brandList, seriesSpecList } =
		state.category.seriesResponse;

	const selectedBrandCode = brandList
		.filter(selected)
		.map(({ brandCode }) => brandCode);

	const selectedCadTypeList = cadTypeList
		.filter(selected)
		.map(({ cadType }) => cadType);

	if (Array.isArray(selectedBrandCode) && selectedBrandCode.length > 0) {
		params.Brand = selectedBrandCode.join(',');
	}

	if (Array.isArray(selectedCadTypeList) && selectedCadTypeList.length > 0) {
		params.CAD = convertCadTypeToQueryParameter(
			selectedCadTypeList.sort().join(',')
		);
	}

	const categorySpecParam = stringifySpecValues(seriesSpecList);
	if (categorySpecParam) {
		params.CategorySpec = categorySpecParam;
	}

	return params;
}
