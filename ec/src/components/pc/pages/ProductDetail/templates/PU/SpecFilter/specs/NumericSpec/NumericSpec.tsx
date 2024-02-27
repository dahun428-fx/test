import { ParametricUnitPartNumberSpec } from '@/components/pc/pages/ProductDetail/templates/PU/SpecFilter/SpecFilter.types';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { AlterationSpec } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	useNormalizeSpec,
} from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';
import { useCallback } from 'react';

type Props = {
	spec: ParametricUnitPartNumberSpec | AlterationSpec;
	onChange: (
		specs: Partial<SearchPartNumberRequest>,
		isHiddenSpec?: boolean
	) => void;
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

	if (!isAvailableNumericSpec(normalizedSpec)) {
		return null;
	}

	return (
		<NumericSpecField
			{...{
				spec: normalizedSpec,
				onBlur: handleBlur,
				inline: true,
			}}
		/>
	);
};

NumericSpec.displayName = 'NumericSpec';
