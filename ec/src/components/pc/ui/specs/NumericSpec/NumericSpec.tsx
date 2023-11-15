import React, { useCallback, useMemo, useRef } from 'react';
import { SpecFrame } from '@/components/pc/ui/specs/SpecFrame';
import { PopoverTrigger } from '@/components/pc/ui/specs/SpecPopover';
import { NumericSpecField } from '@/components/pc/ui/specs/fields/NumericSpecField';
import {
	AlterationSpec,
	PartNumberSpec,
} from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SeriesSpec } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { sendNumericSpecLog } from '@/utils/domain/spec/logs';
import {
	isAvailableNumericSpec,
	normalize,
} from '@/utils/domain/spec/normalize';
import { SendLogPayload } from '@/utils/domain/spec/types';

type SpecCode = string;
type SpecValues = string[];

type Props = {
	spec: PartNumberSpec | AlterationSpec | SeriesSpec;
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
	sendLog?: (payload: SendLogPayload) => void;
};

/**
 * Numeric spec
 */
export const NumericSpec: React.VFC<Props> = ({ spec, onChange, sendLog }) => {
	const normalizedSpec = useMemo(() => normalize(spec), [spec]);

	const frameRef = useRef<HTMLDivElement>(null);

	const handleBlur = useCallback(
		(specValue: string) => {
			// TODO: specValue === '' の場合 {[spec.specCode]: []} を返さないとクリアされない可能性があるので必要なら修正
			onChange?.(specValue === '' ? {} : { [spec.specCode]: [specValue] });
			sendNumericSpecLog({
				specValue,
				prevSpec: normalizedSpec,
				sendLog: payload => {
					sendLog?.(payload);
				},
			});
		},
		[normalizedSpec, onChange, sendLog, spec.specCode]
	);

	const handleClear = useCallback(() => {
		onChange?.({}, true);
	}, [onChange]);

	if (!isAvailableNumericSpec(normalizedSpec)) {
		return null;
	}

	return (
		<SpecFrame {...{ ...normalizedSpec, onClear: handleClear, ref: frameRef }}>
			<NumericSpecField {...{ spec: normalizedSpec, onBlur: handleBlur }} />
			<PopoverTrigger
				spec={normalizedSpec}
				onClear={handleClear}
				frameRef={frameRef}
			>
				<NumericSpecField {...{ spec: normalizedSpec, onBlur: handleBlur }} />
			</PopoverTrigger>
		</SpecFrame>
	);
};
NumericSpec.displayName = 'NumericSpec';
