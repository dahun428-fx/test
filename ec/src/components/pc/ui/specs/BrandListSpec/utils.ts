import { Flag } from '@/models/api/Flag';
import { CValue } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

export function getCValue(cValue: CValue) {
	return Flag.isTrue(cValue.cValueFlag) && Flag.isFalse(cValue.hiddenFlag)
		? cValue
		: null;
}
