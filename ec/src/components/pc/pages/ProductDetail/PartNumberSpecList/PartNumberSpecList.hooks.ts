import { useMemo } from 'react';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	selectCompletedPartNumber,
	selectCompleteFlag,
	selectSeries,
	selectCurrentPartNumberResponse,
} from '@/store/modules/pages/productDetail';
import { keyBy } from '@/utils/collection';
import { rohsFlagDisp } from '@/utils/domain/rohs';
import { selected } from '@/utils/domain/spec';

type BasicSpec = {
	specName: string;
	specType: 'spec' | 'rohs' | 'regulation' | 'alteration';
	specValueDisp: string;
	specUnit?: string;
};

export const SPEC_VALUE_FALLBACK = '-';

/** Part number spec list hook */
export const usePartNumberSpecList = () => {
	const series = useSelector(selectSeries);
	const partNumberResponse = useSelector(selectCurrentPartNumberResponse);
	const completedPartNumber = useSelector(selectCompletedPartNumber);
	const completeFlag = useSelector(selectCompleteFlag);

	const partNumberMap = useMemo(() => {
		return keyBy(completedPartNumber?.specValueList ?? [], 'specCode');
	}, [completedPartNumber]);

	const regulationValueMap = useMemo(() => {
		return keyBy(
			completedPartNumber?.regulationValueList ?? [],
			'regulationCode'
		);
	}, [completedPartNumber]);

	const specList =
		useMemo(() => {
			if (!completedPartNumber) {
				return null;
			}

			const data: BasicSpec[] =
				partNumberResponse?.specList?.map(spec => {
					return {
						specName: spec.specName,
						specType: 'spec',
						specValueDisp:
							partNumberMap[spec.specCode]?.specValueDisp ??
							SPEC_VALUE_FALLBACK,
						specUnit: spec.specUnit,
					};
				}) ?? [];

			if (completedPartNumber.rohsFlag || Flag.isTrue(series.rohsFrameFlag)) {
				data.push({
					specType: 'rohs',
					specName: '',
					specValueDisp: rohsFlagDisp(completedPartNumber.rohsFlag),
				});
			}

			if (partNumberResponse?.regulationList) {
				partNumberResponse.regulationList.forEach(regulation => {
					data.push({
						specType: 'regulation',
						specName: regulation.regulationName,
						specValueDisp:
							regulationValueMap[regulation.regulationCode]?.regulationValue ??
							SPEC_VALUE_FALLBACK,
					});
				});
			}

			// Add alteration Spec list
			if (partNumberResponse?.alterationSpecList) {
				partNumberResponse.alterationSpecList.map(spec => {
					if (spec.specValueList.filter(selected).length > 0) {
						spec.specValueList.filter(selected).map(valueList => {
							data.push({
								specType: 'alteration',
								specName: spec.specName,
								specValueDisp: valueList.specValueDisp,
							});
						});
					} else {
						spec.specValueList
							.filter(specValueItem => Flag.isTrue(specValueItem.defaultFlag))
							.map(valueList => {
								data.push({
									specType: 'alteration',
									specName: spec.specName,
									specValueDisp: valueList.specValueDisp,
								});
							});
					}
				});
			}

			return data;
		}, [
			completedPartNumber,
			partNumberMap,
			partNumberResponse,
			regulationValueMap,
			series.rohsFrameFlag,
		]) ?? [];

	return {
		specList,
		isPartNumberComplete:
			Flag.isTrue(completeFlag) && partNumberResponse?.totalCount === 1,
	};
};
