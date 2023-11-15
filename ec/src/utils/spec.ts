import { Flag } from '@/models/api/Flag';
import { PartNumberSpec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse';

/**
 * Check existing visible spec
 * @param spec
 * @returns
 */
function existsVisibleSpec(spec: PartNumberSpec | SeriesSpec): boolean {
	if (spec.specValueList.length === 0) {
		return false;
	}

	return spec.specValueList.some(
		specValue =>
			Flag.isFalse(specValue.hiddenFlag) ||
			specValue.childSpecValueList?.some(childSpecValue =>
				Flag.isFalse(childSpecValue.hiddenFlag)
			)
	);
}

/**
 * Check whole of spec value
 * @param spec
 * @returns
 */
export function isSpecHidden(spec: PartNumberSpec | SeriesSpec): boolean {
	if (existsVisibleSpec(spec)) {
		return false;
	}

	if (spec.numericSpec && Flag.isFalse(spec.numericSpec.hiddenFlag)) {
		return false;
	}

	return true;
}
