import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChangePayload } from './types';
import { Flag } from '@/models/api/Flag';
import {
	PartNumberSpec,
	SpecValue,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { notHidden, selected } from '@/utils/domain/spec';
import { useNormalizeSpec } from '@/utils/domain/spec/normalize';

export const useSpecValueSelector = ({
	spec,
	onChange,
}: {
	spec: PartNumberSpec | SeriesSpec;
	onChange: (payload: ChangePayload) => void;
}) => {
	const normalizedSpec = useNormalizeSpec(spec);
	const [selectedValues, setSelectedValues] = useState<string[]>([]);

	const { specCode, specValueList: rawSpecValueList } = normalizedSpec;

	const specValueList = useMemo(
		() => rawSpecValueList.filter(notHidden),
		[rawSpecValueList]
	);

	const onClick = useCallback(
		({ specValue, specValueDisp, selectedFlag }: SpecValue) => {
			const next = nextSelectedSpecValues(specValue, selectedValues);
			setSelectedValues(next);
			onChange({
				selectedSpecs: { [specCode]: next },
				log: {
					specName: normalizedSpec.specName,
					specValueDisp,
					selected: !Flag.isTrue(selectedFlag),
				},
			});
		},
		[normalizedSpec.specName, onChange, selectedValues, specCode]
	);

	const onClear = useCallback(() => {
		onChange({ selectedSpecs: { [specCode]: [] } });
	}, [onChange, specCode]);

	useEffect(() => {
		setSelectedValues(
			specValueList.filter(selected).map(value => value.specValue)
		);
	}, [specValueList]);

	return { normalizedSpec, selectedValues, onClick, onClear };
};

export function nextSelectedSpecValues(
	value: string,
	prevSelectedValues: string[]
) {
	const next = [...prevSelectedValues];
	const index = next.indexOf(value);
	if (index < 0) {
		next.push(value);
	} else {
		next.splice(index, 1);
	}
	return next;
}
