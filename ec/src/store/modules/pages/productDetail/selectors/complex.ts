import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/store';
import { selectCurrentPartNumberResponse } from '@/store/modules/pages/productDetail/selectors/shared';
import { selected } from '@/utils/domain/spec';
import { fromEntries } from '@/utils/object';
import { notEmpty, notNull } from '@/utils/predicate';

export const selectPrevSearchCondition = createSelector(
	selectCurrentPartNumberResponse,
	response => {
		if (!response) {
			return {};
		}
		const {
			partNumberSpecList,
			cadTypeList,
			daysToShipList,
			partNumberList,
			alterationSpecList,
		} = response;

		// selective form specs
		const selectedSpecValues = fromEntries(
			partNumberSpecList.map(spec => [
				spec.specCode,
				[
					...spec.specValueList.filter(selected).map(value => value.specValue),
					...spec.specValueList
						.flatMap(spec => spec.childSpecValueList)
						.filter(notNull)
						.filter(selected)
						.map(value => value.specValue),
				],
			])
		);

		// alteration spec values
		const selectedAlterationSpecValues = fromEntries(
			alterationSpecList.map(spec => [
				spec.specCode,
				spec.specValueList.filter(selected).map(value => value.specValue),
			])
		);

		// numeric field specs
		const numericSpecs = fromEntries(
			[...partNumberSpecList, ...alterationSpecList]
				.filter(spec => notEmpty(spec.numericSpec?.specValue))
				.map(spec => [spec.specCode, spec.numericSpec?.specValue])
		);

		// cad type
		const selectedCadTypeList = cadTypeList
			.filter(selected)
			.map(({ cadType }) => cadType);

		// days to ship
		const selectedDaysToShip = daysToShipList.find(selected);

		// TODO: append other conditions
		return {
			...selectedSpecValues,
			...selectedAlterationSpecValues,
			...numericSpecs,
			cadType: selectedCadTypeList,
			daysToShip: selectedDaysToShip?.daysToShip,
			fixedInfo: partNumberList[0]?.fixedInfo,
		};
	}
);

export function selectFocusesAlterationSpecs(state: AppState) {
	return state.productDetail.focusesAlterationSpecs ?? false;
}
