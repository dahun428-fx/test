import { useMemo } from 'react';
import { ConfiguredSpecifications as Presenter } from './ConfiguredSpecifications';
import { Flag } from '@/models/api/Flag';
import { useSelector } from '@/store/hooks';
import {
	selectCompletedPartNumber,
	selectCompleteFlag,
	selectCurrentPartNumberResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { keyBy } from '@/utils/collection';
import { rohsFlagDisp } from '@/utils/domain/rohs';
import { selected } from '@/utils/domain/spec';

export const SPEC_VALUE_FALLBACK = '-';

type Props = {
	className?: string;
};

export type BasicSpec = {
	specName: string;
	specType: 'spec' | 'rohs' | 'regulation' | 'alteration';
	specValueDisp: string;
	specUnit?: string;
};

// TODO: PartNumberSpecList に改名
export const ConfiguredSpecifications: React.VFC<Props> = ({ className }) => {
	const completeFlag = useSelector(selectCompleteFlag);
	const series = useSelector(selectSeries);
	const partNumberResponse = useSelector(selectCurrentPartNumberResponse);
	const completedPartNumber = useSelector(selectCompletedPartNumber);

	const partNumberMap = useMemo(() => {
		return keyBy(completedPartNumber?.specValueList ?? [], 'specCode');
	}, [completedPartNumber]);

	const regulationValueMap = useMemo(() => {
		return keyBy(
			completedPartNumber?.regulationValueList ?? [],
			'regulationCode'
		);
	}, [completedPartNumber]);

	const specList = useMemo(() => {
		if (!completedPartNumber) {
			return null;
		}

		const basicSpecList: BasicSpec[] =
			partNumberResponse?.specList?.map(spec => {
				return {
					specName: spec.specName,
					specType: 'spec',
					specValueDisp:
						partNumberMap[spec.specCode]?.specValueDisp ?? SPEC_VALUE_FALLBACK,
					specUnit: spec.specUnit,
				};
			}) ?? [];

		// Add alteration Spec list
		if (partNumberResponse?.alterationSpecList) {
			partNumberResponse.alterationSpecList.map(spec => {
				if (spec.specValueList.filter(selected).length > 0) {
					spec.specValueList.filter(selected).map(valueList => {
						basicSpecList.push({
							specType: 'alteration',
							specName: spec.specName,
							specValueDisp: valueList.specValueDisp,
						});
					});
				} else {
					spec.specValueList
						.filter(specValueItem => Flag.isTrue(specValueItem.defaultFlag))
						.map(valueList => {
							basicSpecList.push({
								specType: 'alteration',
								specName: spec.specName,
								specValueDisp: valueList.specValueDisp,
							});
						});
				}
			});
		}

		if (completedPartNumber.rohsFlag || Flag.isTrue(series.rohsFrameFlag)) {
			basicSpecList.push({
				specType: 'rohs',
				specName: 'RoHS',
				specValueDisp: rohsFlagDisp(completedPartNumber.rohsFlag),
			});
		}

		if (partNumberResponse?.regulationList) {
			partNumberResponse.regulationList.forEach(regulation => {
				basicSpecList.push({
					specType: 'regulation',
					specName: regulation.regulationName,
					specValueDisp:
						regulationValueMap[regulation.regulationCode]?.regulationValue ??
						SPEC_VALUE_FALLBACK,
				});
			});
		}

		return basicSpecList;
	}, [
		completedPartNumber,
		partNumberMap,
		partNumberResponse,
		regulationValueMap,
		series.rohsFrameFlag,
	]);

	if (Flag.isFalse(completeFlag) || !specList) {
		return null;
	}

	return <Presenter specList={specList} className={className} />;
};
