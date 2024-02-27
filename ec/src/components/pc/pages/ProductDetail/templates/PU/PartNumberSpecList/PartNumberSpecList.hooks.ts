import { useMemo } from 'react';
import { useSelector } from '@/store/hooks';
import {
	selectCompleteFlag,
	selectSeries,
	selectCurrentPartNumberResponse,
	selectCurrentPartNumberList,
} from '@/store/modules/pages/productDetail';
import { first, keyBy } from '@/utils/collection';
import { rohsFlagDisp, shouldShowsRohs } from '@/utils/domain/rohs';
import { selected } from '@/utils/domain/spec';
import { Flag } from '@/models/api/Flag';

type BasicSpec = {
	specName: string;
	specType: 'spec' | 'rohs' | 'regulation' | 'alteration';
	specValueDisp: string;
	specUnit?: string;
};

export const SPEC_VALUE_FALLBACK = '-';

/** Part number spec list hook */
export const usePartNumberSpecList = (showStandardSpec?: boolean) => {
	const series = useSelector(selectSeries);
	const partNumberResponse = useSelector(selectCurrentPartNumberResponse);
	const currentPartNumberList = useSelector(selectCurrentPartNumberList);
	const currentPartNumber = first(currentPartNumberList);
	const completeFlag = useSelector(selectCompleteFlag);

	const partNumberMap = useMemo(() => {
		return keyBy(
			first(partNumberResponse?.partNumberList)?.specValueList ?? [],
			'specCode'
		);
	}, [partNumberResponse?.partNumberList]);

	const regulationValueMap = useMemo(() => {
		return keyBy(
			currentPartNumber?.regulationValueList ?? [],
			'regulationCode'
		);
	}, [currentPartNumber]);

	const specList =
		useMemo(() => {
			if (!currentPartNumber) {
				return null;
			}

			const data: BasicSpec[] = showStandardSpec
				? series.standardSpecValueList.map(spec => {
						return {
							specName: spec.specValueDisp ?? '',
							specType: 'spec',
							specValueDisp: spec.specValueDisp ?? SPEC_VALUE_FALLBACK,
						};
				  })
				: partNumberResponse?.specList?.map(spec => {
						return {
							specName: spec.specName,
							specType: 'spec',
							specValueDisp:
								partNumberMap[spec.specCode]?.specValueDisp ??
								SPEC_VALUE_FALLBACK,
							specUnit: spec.specUnit,
						};
				  }) ?? [];

			if (showStandardSpec) {
				return data;
			}

			if (
				shouldShowsRohs(currentPartNumber.rohsFlag) ||
				Flag.isTrue(series.rohsFrameFlag)
			) {
				data.push({
					specType: 'rohs',
					specName: '',
					specValueDisp: rohsFlagDisp(currentPartNumber.rohsFlag),
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
			currentPartNumber,
			partNumberMap,
			partNumberResponse?.alterationSpecList,
			partNumberResponse?.regulationList,
			partNumberResponse?.specList,
			regulationValueMap,
			series.rohsFrameFlag,
			series.standardSpecValueList,
			showStandardSpec,
		]) ?? [];

	return {
		specList,
		isPartNumberComplete:
			Flag.isTrue(completeFlag) && partNumberResponse?.totalCount === 1,
	};
};
