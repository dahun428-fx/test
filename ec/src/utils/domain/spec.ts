import Big from 'big.js';
import { TFunction } from 'react-i18next';
import { Option as DisplayTypeOption } from '@/components/pc/ui/controls/select/DisplayTypeSwitch';
import { config } from '@/config';
import { Flag } from '@/models/api/Flag';
import {
	AlterationNumericSpec,
	AlterationSpec,
	CadType,
	ChildSpecValue,
	DaysToShip,
	NumericSpec,
	PartNumberSpec,
	SearchPartNumberResponse$search,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import {
	NumericSpec as SeriesNumericSpec,
	SeriesSpec,
	SpecValue as SeriesSpecValue,
	CValue,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { Spec, StandardSpecValue } from '@/models/api/msm/ect/series/shared';
import { Cookie, getCookie } from '@/utils/cookie';
import { getDaysToShipMessageSpecFilter } from '@/utils/domain/daysToShip';
import { fromEntries } from '@/utils/object';
import { notEmpty } from '@/utils/predicate';

/**
 * Create days to ship value list
 * @param {DaysToShip[]} daysToShipListSpec
 * @param {TFunction} t
/** SpecValueRange of series search or part number search api response */
type SpecValueRange = {
	minValue?: number;
	maxValue?: number;
	stepValue?: number;
};

type ValidateSpecValueForRangePayload = {
	value: string;
	specValueRangeList: SpecValueRange[];
};

export function hidden(spec: { hiddenFlag?: Flag }) {
	return Flag.isTrue(spec.hiddenFlag);
}

export function notHidden(spec: { hiddenFlag?: Flag }) {
	return Flag.isFalse(spec.hiddenFlag);
}

export function selected(spec: { selectedFlag?: Flag; hiddenFlag?: Flag }) {
	return Flag.isTrue(spec.selectedFlag) && notHidden(spec);
}

export function notSelected(spec: { selectedFlag?: Flag; hiddenFlag?: Flag }) {
	return Flag.isFalse(spec.selectedFlag) && notHidden(spec);
}

function selectedAndHidden(spec: { selectedFlag?: Flag; hiddenFlag?: Flag }) {
	return Flag.isTrue(spec.selectedFlag) && hidden(spec);
}

export function someSelected(
	specList: { selectedFlag?: Flag; hiddenFlag?: Flag }[]
) {
	return specList.some(selected);
}

export function someUnselected(
	specList: { selectedFlag?: Flag; hiddenFlag?: Flag }[]
) {
	return specList.some(notSelected);
}

export function flatSpecValueList(
	specValueList: SpecValue[] | SeriesSpecValue[]
) {
	return specValueList.flatMap(specValue =>
		notEmpty(specValue.childSpecValueList)
			? specValue.childSpecValueList
			: specValue
	);
}

export function getAvailableSpecCount(specValueList: SpecValue[]) {
	return flatSpecValueList(specValueList).filter(notHidden).length;
}

/**
 * Returns selected and NOT hidden spec count.
 */
export function getSelectedSpecCount(specValueList: SpecValue[]) {
	return flatSpecValueList(specValueList).filter(selected).length;
}

/**
 * Returns NOT selected and NOT hidden spec count.
 */
export function getNotSelectedSpecCount(specValueList: SpecValue[]) {
	return flatSpecValueList(specValueList).filter(notSelected).length;
}

export function isSelectedSpec(spec: {
	specValueList: SpecValue[];
	numericSpec?: NumericSpec | AlterationNumericSpec | SeriesNumericSpec;
}) {
	if (
		spec.numericSpec &&
		notHidden(spec.numericSpec) &&
		notEmpty(spec.numericSpec.specValue)
	) {
		return true;
	}
	return getSelectedSpecCount(spec.specValueList) > 0;
}

/** Find spec info */
export function findSpec(specCode: string | undefined, specList: Spec[]) {
	if (!specCode) {
		return null;
	}
	return specList.find(spec => specCode === spec.specCode) ?? null;
}

/** Get spec name */
export function getSpecName(
	specCode: string | undefined,
	specList: Spec[]
): string;
export function getSpecName(spec: {
	specName: string;
	specUnit?: string;
}): string;
export function getSpecName(
	specOrSpecCode: string | undefined | { specName: string; specUnit?: string },
	specList: Spec[] = []
) {
	if (typeof specOrSpecCode === 'object') {
		const spec = specOrSpecCode;
		return spec.specUnit ? `${spec.specName}(${spec.specUnit})` : spec.specName;
	}

	const spec = findSpec(specOrSpecCode, specList);

	if (!spec) {
		return '';
	}

	const { specUnit, specName } = spec;
	if (specUnit) {
		return `${specName}(${specUnit})`;
	}
	return specName;
}

/**
 * Get spec attributes
 * @param specCode
 * @param specList
 */
export function getSpecAttributes(
	specCode: string | undefined,
	specList: Spec[]
) {
	const spec = findSpec(specCode, specList);

	if (!spec) {
		return null;
	}

	const { specUnit, specName, specType } = spec;
	return {
		specName: specUnit ? `${specName} (${specUnit})` : specName,
		specType,
	};
}

export function getRohsDisp(rohsFlag: string) {
	switch (rohsFlag) {
		case '1':
			return '6';
		case '2':
			return '10';
		default:
			return '-';
	}
}

/**
 * To string spec code and spec value;
 * @param specValue
 * @returns - queryString
 */
export function stringifyBasicSpecValue(specValue: StandardSpecValue) {
	return `${specValue.specCode}::${specValue.specValue}`;
}

/**
 * To string spec code and spec values;
 * @param seriesSpecList {SeriesSpec[]} - series spec items.
 * @returns {string} - category spec parameters.
 */
export function stringifySpecValues(seriesSpecList: SeriesSpec[]) {
	const selectedSpecs = seriesSpecList.filter(({ specValueList }) =>
		specValueList.some(selected)
	);

	if (!selectedSpecs.length) {
		return;
	}

	return selectedSpecs
		.sort((l, r) =>
			l.specCode === r.specCode ? 0 : l.specCode > r.specCode ? 1 : -1
		)
		.map(spec => {
			const { specValueList, specCode } = spec;
			const selectedValues = specValueList.filter(selected);
			return `${specCode}::${selectedValues
				.map(item => item.specValue)
				.sort()
				.join(',')}`;
		})
		.join('\t');
}

/**
 * To Spec List from Spec::Value text.
 * @param specParams
 * @returns
 */
export function parseSpecValue(
	specParams: string | undefined
): Record<string, string | string[]> | undefined {
	if (!specParams) {
		return undefined;
	}

	const specList = specParams.split('\t');

	return fromEntries(
		specList.map<[string, string | string[]]>(spec => {
			const [specCode, specValues] = spec.split('::');

			if (specValues == null) {
				return [specCode, ''];
			}

			return [specCode, specValues.split(',')];
		})
	);
}

/**
 * Spec value text is linkable when it is not numeric.
 * @param specValueDisp
 * @returns
 */
export function isNumericString(specValueDisp: string): boolean {
	return !!specValueDisp.match(/^[\-]?([1-9]\d*|0)(\.\d+)?$/);
}

/**
 * SpecValueRange is valid or not
 */
export function isValidSpecValueRange({
	minValue,
	maxValue,
	stepValue,
}: SpecValueRange) {
	return minValue != null && maxValue != null && stepValue != null;
}

/**
 * Returns whether the value is valid for the SpecValueRange.
 * We name it validate because it returns a message (isValid if it returns a boolean).
 * - SpecValueRange に対して有効な value かを返します。
 *   message を返すので validate と命名しています。(boolean を返すなら isValid)
 */
export function validateSpecValueForRange(
	payload: ValidateSpecValueForRangePayload,
	t: TFunction
): string | null {
	if (payload.value === '') {
		return null; // correct value
	}

	if (!isNumericString(payload.value)) {
		return t('utils.domain.spec.notNumericalStringError');
	}

	if (payload.value.match(/\.\d{4}([^0]+)/)) {
		return t('utils.domain.spec.tooManyDecimalPlacesError');
	}

	const value = new Big(payload.value);
	for (const specValueRange of payload.specValueRangeList) {
		const { minValue, maxValue, stepValue } = specValueRange;
		// If null, it is a broken submission and not even displayed.
		// No validation checks will be performed for this reason.
		// Please have the submitted content revised.
		// もし null なら、それは壊れた入稿であり、表示もされていない。
		// このためバリデーションチェックもしない。入稿を直していただく。
		if (minValue == null || maxValue == null || stepValue == null) {
			continue;
		}

		const min = new Big(minValue);
		const max = new Big(maxValue);
		const step = new Big(stepValue);

		if (
			(value.gte(min) &&
				value.lte(max) &&
				step.gt(0) &&
				value.minus(min).mod(step).eq(0)) ||
			(min.eq(max) && value.eq(min) && step.eq(0))
		) {
			return null; // correct value
		}
	}

	return t('utils.domain.spec.outOfRangeError');
}

/**
 * Get part number page size
 */
export function getSeriesListPageSize(): number {
	const defaultConfigPageSize = config.pagination.series.size;
	const defaultConfigPageSizeList = config.pagination.series.sizeList;
	const detailItemPerPage = getCookie(Cookie.VONA_ITEM_SEARCH_PER_PAGE);

	const pageSize =
		detailItemPerPage &&
		defaultConfigPageSizeList.includes(Number(detailItemPerPage))
			? Number(detailItemPerPage)
			: defaultConfigPageSize;
	return pageSize;
}

export function hasSpecVisibilityToggle(
	spec: PartNumberSpec | AlterationSpec | SeriesSpec,
	numericInputValue?: string
) {
	const flatMapSpecValueList = flatSpecValueList(spec.specValueList);

	if (
		!!spec.numericSpec &&
		!!numericInputValue &&
		flatMapSpecValueList.filter(notSelected).length > 0
	) {
		return true;
	}

	if (flatMapSpecValueList.filter(selected).length === 0) {
		return false;
	}

	if (
		flatMapSpecValueList.filter(notHidden).length ===
		flatMapSpecValueList.filter(selected).length
	) {
		if (spec.numericSpec) {
			return !!numericInputValue && Flag.isFalse(spec.numericSpec.hiddenFlag);
		}

		return false;
	}

	return true;
}

/** Get display method */
function toDisplayMethod(type?: string) {
	if (!type) {
		return DisplayTypeOption.LIST;
	}

	const displayLayout: Record<string, DisplayTypeOption> = {
		'1': DisplayTypeOption.LIST,
		'2': DisplayTypeOption.PHOTO,
		'3': DisplayTypeOption.DETAIL,
	} as const;

	return displayLayout[type] ?? DisplayTypeOption.LIST;
}

/** Convert Display method to display type */
export function toDisplayType(displayMethod?: DisplayTypeOption) {
	const displayType: Record<DisplayTypeOption, string> = {
		[DisplayTypeOption.LIST]: '1',
		[DisplayTypeOption.PHOTO]: '2',
		[DisplayTypeOption.DETAIL]: '3',
	} as const;

	return displayMethod ? displayType[displayMethod] : displayType.dispList;
}

/** Get default display type */
export function getDefaultDisplayType({
	displayTypeQuery,
	seriesDisplayType,
}: {
	displayTypeQuery: string | undefined;
	seriesDisplayType: string | undefined;
}) {
	const currentDisplayType = [
		DisplayTypeOption.LIST,
		DisplayTypeOption.PHOTO,
		DisplayTypeOption.DETAIL,
	].find(type => type === displayTypeQuery);

	return currentDisplayType ?? toDisplayMethod(seriesDisplayType);
}

/** Get spec by specValue */
export function findSpecValue(specValue: string, specValueList: SpecValue[]) {
	return specValueList.find(value => value.specValue === specValue);
}

/** Check spec need to retry */
function hasSelectedAndHiddenSpec(
	specValueList: SpecValue[] | ChildSpecValue[] | DaysToShip[] | CadType[]
) {
	return specValueList.some(spec => selectedAndHidden(spec));
}

/** Check part number search response need to retry */
export function shouldRetrySpecSearch(
	partNumberResponse: SearchPartNumberResponse$search
) {
	const {
		partNumberSpecList = [],
		daysToShipList = [],
		cadTypeList = [],
	} = partNumberResponse;

	const hasSelectedAndHiddenDaysToShip =
		hasSelectedAndHiddenSpec(daysToShipList);
	const hasSelectedAndHiddenCadTypeList = hasSelectedAndHiddenSpec(cadTypeList);
	const hasSelectedAndHiddenPartNumberSpecList = partNumberSpecList.some(
		partNumberSpec => {
			return partNumberSpec.specValueList.some(spec => {
				const childSpecValueList = spec.childSpecValueList ?? [];
				const hasSelectedAndHiddenChildSpec = childSpecValueList.some(
					childSpec =>
						!(
							(partNumberSpec.numericSpec?.specValue === childSpec.specValue &&
								notHidden(partNumberSpec.numericSpec)) ||
							!selectedAndHidden(childSpec)
						)
				);

				if (hasSelectedAndHiddenChildSpec) {
					return true;
				}

				return (
					selectedAndHidden(spec) &&
					!(
						partNumberSpec.numericSpec?.specValue === spec.specValue &&
						notHidden(partNumberSpec.numericSpec)
					)
				);
			});
		}
	);

	return (
		hasSelectedAndHiddenDaysToShip ||
		hasSelectedAndHiddenCadTypeList ||
		hasSelectedAndHiddenPartNumberSpecList
	);
}

/** Check spec need to retry */
export function validateFilter(
	condition: { [s: string]: unknown } | ArrayLike<unknown>
) {
	const isValid = Object.values(condition).some(item =>
		Array.isArray(item) ? item.length > 0 : item !== undefined
	);
	return isValid;
}

/**
 * Create days to ship value list
 * @param {DaysToShip[]} daysToShipListSpec
 * @param {TFunction} t
 */
export const createDaysToShipValueList = (
	daysToShipListSpec: DaysToShip[],
	t: TFunction
) => {
	const notHiddenDaysToShipList = daysToShipListSpec
		.filter(daysToShipItem => notHidden(daysToShipItem))
		.map(daysToShipItem => {
			return {
				...daysToShipItem,
				textLabel: getDaysToShipMessageSpecFilter(daysToShipItem.daysToShip, t),
			};
		});

	if (!notHiddenDaysToShipList.length) {
		return [];
	}

	/** 'All' as default then empty selected item */
	const allValue = {
		daysToShip: undefined,
		hiddenFlag: Flag.FALSE,
		selectedFlag: daysToShipListSpec.some(selected) ? Flag.FALSE : Flag.TRUE,
		textLabel: t('utils.domain.daysToShip.all'),
	};

	return [allValue, ...notHiddenDaysToShipList];
};

/** Get CValue */
export function getCValue(cValue: CValue) {
	return Flag.isTrue(cValue.cValueFlag) && Flag.isFalse(cValue.hiddenFlag)
		? cValue
		: null;
}
