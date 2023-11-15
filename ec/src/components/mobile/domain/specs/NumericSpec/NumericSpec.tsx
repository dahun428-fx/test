import React, { useCallback } from 'react';
import { SpecFrame } from '@/components/mobile/domain/specs/SpecFrame';
import { NumericSpecField } from '@/components/mobile/domain/specs/fields/NumericSpecField';
import { ChangePayload } from '@/components/mobile/domain/specs/types';
import {
	AlterationSpec,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { getNumericSpecLogList } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';

type Props = {
	spec: PartNumberSpec | AlterationSpec | SeriesSpec;
	onChange: (payload: ChangePayload) => void;
};

/**
 * Numeric spec
 */
export const NumericSpec: React.VFC<Props> = ({ spec, onChange }) => {
	const normalizedSpec = useNormalizeSpec(spec);
	const { specCode } = normalizedSpec;

	const handleBlur = useCallback(
		(specValue: string) => {
			onChange(
				specValue === ''
					? {
							selectedSpecs: { [specCode]: [] },
							log: getNumericSpecLogList(specValue, normalizedSpec),
					  }
					: {
							selectedSpecs: { [specCode]: [specValue] },
							log: getNumericSpecLogList(specValue, normalizedSpec),
					  }
			);
		},
		[normalizedSpec, onChange, specCode]
	);

	const handleClear = useCallback(() => {
		onChange({ selectedSpecs: { [specCode]: [] } });
	}, [onChange, specCode]);

	if (!isAvailableNumericSpec(normalizedSpec)) {
		return null;
	}

	return (
		<SpecFrame {...{ ...normalizedSpec, onClear: handleClear }}>
			<NumericSpecField
				{...{
					spec: normalizedSpec,
					onBlur: handleBlur,
					inline: true,
				}}
			/>
		</SpecFrame>
	);
};
NumericSpec.displayName = 'NumericSpec';
