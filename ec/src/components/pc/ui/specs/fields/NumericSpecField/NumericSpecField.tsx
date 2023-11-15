import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './NumericSpecField.module.scss';
import { NumericField } from '@/components/pc/ui/fields';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import {
	isValidSpecValueRange,
	validateSpecValueForRange,
} from '@/utils/domain/spec';
import { NumericSpec } from '@/utils/domain/spec/types';

type NumericSpecWithUnit = {
	specUnit?: string;
	numericSpec: NumericSpec;
};

type Props = {
	spec: NumericSpecWithUnit;
	inline?: true;
	className?: string;
	onBlur?: (specValue: string) => void;
};

/**
 * Numeric spec field
 * - NOTE: "fields" directory may only contain NumericSpecField. DO NOT imitate without consideration.
 */
export const NumericSpecField: React.VFC<Props> = ({
	spec,
	inline,
	className,
	onBlur,
}) => {
	const [t] = useTranslation();
	const ref = useRef<HTMLInputElement>(null);
	const { showMessage } = useMessageModal();

	const [value, setValue] = useState(spec.numericSpec.specValue ?? '');

	const handleChange = useCallback((value: string) => {
		setValue(value);
	}, []);

	const handleBlur = useCallback(() => {
		const message = validateSpecValueForRange(
			{
				value,
				specValueRangeList: spec.numericSpec.specValueRangeList,
			},
			t
		);
		if (message) {
			showMessage(message);
			return;
		}

		onBlur?.(value);
	}, [onBlur, spec.numericSpec.specValueRangeList, showMessage, t, value]);

	const handleKeyDownEnter = () => ref.current?.blur();

	useEffect(() => {
		setValue(spec.numericSpec.specValue ?? '');
	}, [spec.numericSpec.specValue]);

	return (
		<div className={classNames(className, { [String(styles.inline)]: inline })}>
			<NumericField
				{...{
					ref,
					value,
					size: 10,
					onChange: handleChange,
					onBlur: handleBlur,
					onKeyDownEnter: handleKeyDownEnter,
					className: styles.textField,
				}}
			/>
			{spec.numericSpec.specValueRangeList
				.filter(isValidSpecValueRange)
				.map((specValueRange, index) => (
					<div key={index} className={styles.range}>
						{spec.specUnit ? (
							<Trans
								i18nKey="components.ui.specs.fields.numericSpecField.range"
								values={{
									min: specValueRange.minValue,
									max: specValueRange.maxValue,
									step: specValueRange.stepValue,
								}}
							>
								<span dangerouslySetInnerHTML={{ __html: spec.specUnit }} />
							</Trans>
						) : (
							t(
								'components.ui.specs.fields.numericSpecField.rangeWithoutUnit',
								{
									min: specValueRange.minValue,
									max: specValueRange.maxValue,
									step: specValueRange.stepValue,
								}
							)
						)}
					</div>
				))}
		</div>
	);
};
