import { useMemo } from 'react';
import { NormalizedSpec } from './types';
import { Flag } from '@/models/api/Flag';
import { OpenCloseType } from '@/models/api/constants/OpenCloseType';
import {
	AlterationNumericSpec,
	AlterationSpec,
	NumericSpec,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import {
	SeriesSpec,
	SpecViewType,
} from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import {
	flatSpecValueList,
	getAvailableSpecCount,
	isSelectedSpec,
	notHidden,
} from '@/utils/domain/spec';
import { notEmpty, notNull } from '@/utils/predicate';
import { PartiallyRequired } from '@/utils/type';
import { PartNumberSpec as CategoryPartNumberSpec } from '@/models/api/msm/ect/categoryPartNumber/SearchCategoryPartNumberResponse';
import { ParametricUnitPartNumberSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';

/**
 * Normalize any spec types.
 * @param spec {PartNumberSpec | AlterationSpec}
 * @return {NormalizedSpec}
 */
export function normalize(
	spec: PartNumberSpec | AlterationSpec | SeriesSpec
): NormalizedSpec {
	// remove no value entry.
	const {
		numericSpec,
		...restSpec
	}: PartNumberSpec | AlterationSpec | SeriesSpec = JSON.parse(
		JSON.stringify(spec)
	);

	return {
		...restSpec,
		openCloseType:
			'openCloseType' in restSpec
				? restSpec.openCloseType
				: OpenCloseType.DISABLE,
		selectedFlag: getSelectedFlagOrElse(
			restSpec,
			Flag.toFlag(isSelectedSpec(spec))
		),
		refinedFlag: getSelectedFlagOrElse(
			restSpec,
			Flag.toFlag(
				isSelectedSpec(spec) ||
					getAvailableSpecCount(restSpec.specValueList) === 1
			)
		),
		...normalizedNumericSpec(numericSpec),
		specValueList: normalizeSpecValueList(restSpec),
	};
}

function normalizedNumericSpec(
	numericSpec?: NumericSpec | AlterationNumericSpec
) {
	if (numericSpec && notEmpty(numericSpec.specValueRangeList)) {
		return { numericSpec: { hiddenFlag: Flag.FALSE, ...numericSpec } };
	}
}

function normalizeSpecValueList(
	spec: Omit<PartNumberSpec | AlterationSpec | SeriesSpec, 'numericSpec'>
) {
	const specValueList =
		spec.specViewType !== SpecViewType.AGGREGATION
			? spec.specValueList
			: flatSpecValueList(spec.specValueList).map(flatSpecValue => ({
					childSpecValueList: [],
					...flatSpecValue,
			  }));

	return specValueList.map(value => ({
		defaultFlag: Flag.FALSE,
		hiddenFlag: Flag.FALSE,
		...value,
		childSpecValueList: (value.childSpecValueList ?? []).map(child => ({
			hiddenFlag: Flag.FALSE,
			...child,
		})),
	}));
}

/**
 * Normalize Alteration spec types.
 * @param spec {AlterationSpec}
 * @return {NormalizedSpec}
 */
export function normalizeAlteration(
	spec: PartNumberSpec | AlterationSpec | SeriesSpec
): NormalizedSpec {
	return {
		...normalize(spec),
		specValueList: normalizeAlterationSpecValueList(spec),
	};
}

function normalizeAlterationSpecValueList(
	spec: Omit<PartNumberSpec | AlterationSpec | SeriesSpec, 'numericSpec'>
) {
	return spec.specValueList.map(value => ({
		defaultFlag: Flag.FALSE,
		hiddenFlag: Flag.FALSE,
		...value,
		childSpecValueList: (value.childSpecValueList ?? []).map(child => ({
			hiddenFlag: Flag.FALSE,
			...child,
		})),
	}));
}

function getSelectedFlagOrElse(
	spec: PartNumberSpec | AlterationSpec | SeriesSpec,
	another: Flag
): Flag {
	return 'selectedFlag' in spec ? spec.selectedFlag : another;
}

export function isAvailableNumericSpec(
	spec: NormalizedSpec
): spec is PartiallyRequired<NormalizedSpec, 'numericSpec'> {
	return notNull(spec.numericSpec) && notHidden(spec.numericSpec);
}

export function useNormalizeSpec(
	spec:
		| PartNumberSpec
		| CategoryPartNumberSpec
		| AlterationSpec
		| SeriesSpec
		| ParametricUnitPartNumberSpec,
	allowNormalizeAlteration?: boolean
) {
	return useMemo(() => {
		if (allowNormalizeAlteration) {
			return normalizeAlteration(spec as PartNumberSpec);
		}
		return normalize(spec as PartNumberSpec);
	}, [allowNormalizeAlteration, spec]);
}
