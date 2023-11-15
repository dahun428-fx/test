import React, { useCallback } from 'react';
import { SpecFrame } from '@/components/pc/pages/ProductDetail/templates/Simple/SpecFilter/specs/SpecFrame';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';
import {
	AlterationSpec,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';

type SpecCode = string;
type SpecValues = string[];

type Props = {
	spec: PartNumberSpec | AlterationSpec;
	onChange: (spec: Record<SpecCode, SpecValues>) => void;
	sendLog: (payload: SendLogPayload) => void;
};

/**
 * Numeric spec
 */
export const NumericSpec: React.VFC<Props> = ({ spec, onChange, sendLog }) => {
	const normalizedSpec = useNormalizeSpec(spec);

	const handleBlur = useCallback(
		(specValue: string) => {
			sendNumericSpecLog({ specValue, prevSpec: normalizedSpec, sendLog });
			// TODO: specValue === '' の場合 {[spec.specCode]: []} を返さないとクリアされない可能性があるので必要なら修正
			onChange(specValue === '' ? {} : { [spec.specCode]: [specValue] });
		},
		[normalizedSpec, onChange, sendLog, spec.specCode]
	);

	const handleClear = useCallback(() => {
		onChange({});
	}, [onChange]);

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
