import classNames from 'classnames';
import RcSlider, { SliderTooltip } from 'rc-slider';
import React, { useCallback } from 'react';
import styles from './Slider.module.scss';
import 'rc-slider/assets/index.css';
import { assertNotArray, assertNotNull } from '@/utils/assertions';

type Props = {
	value?: string;
	defaultValue?: string;
	values: string[];
	min?: number;
	max?: number;
	ariaValueTextFormatter?: (index: number) => string;
	onChange?: (value: string) => void;
	onAfterChange?: (value: string) => void;

	className?: string;
	style?: React.CSSProperties;
};

export const Slider: React.VFC<Props> = ({
	value,
	defaultValue,
	values,
	min = 0,
	max = values.length - 1,
	ariaValueTextFormatter,
	onChange,
	onAfterChange,
	className,
	style,
}) => {
	const handleChange = useCallback(
		(value: number | number[]) => {
			if (onChange) {
				assertNotArray(value);
				const selectedValue = values[value];
				assertNotNull(selectedValue);
				onChange(selectedValue);
			}
		},
		[onChange, values]
	);

	const handleAfterChange = useCallback(
		(value: number | number[]) => {
			if (onAfterChange) {
				assertNotArray(value);
				const selectedValue = values[value];
				assertNotNull(selectedValue);
				onAfterChange(selectedValue);
			}
		},
		[onAfterChange, values]
	);

	return (
		<div className={classNames(styles.slider, className)} style={style}>
			<RcSlider
				{...(value != null ? { value: values.indexOf(value) } : undefined)}
				{...(defaultValue != null
					? { defaultValue: values.indexOf(defaultValue) }
					: undefined)}
				prefixCls="misumi-slider"
				min={min}
				max={max}
				tabIndex={0}
				ariaValueTextFormatterForHandle={
					ariaValueTextFormatter || (current => values[current] ?? '')
				}
				onChange={handleChange}
				onAfterChange={handleAfterChange}
				handle={HandleWithTooltip}
			/>
		</div>
	);
};
Slider.displayName = 'Slider';

type HandleProps = {
	className: string;
	prefixCls?: string;
	vertical?: boolean;
	offset: number;
	value: number;
	dragging?: boolean;
	disabled?: boolean;
	min?: number;
	max?: number;
	reverse?: boolean;
	index: number;
	tabIndex?: number;
	ariaLabel: string;
	ariaLabelledBy: string;
	ariaValueTextFormatter?: (value: number) => string;
	style?: React.CSSProperties;
	ref?: React.Ref<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

const HandleWithTooltip = ({
	value,
	dragging,
	index,
	ariaValueTextFormatter,
	...rest
}: HandleProps) => {
	return (
		<SliderTooltip
			overlay={ariaValueTextFormatter?.(value) ?? value}
			prefixCls="misumi-tooltip"
			visible={dragging}
			overlayClassName={styles.tooltip}
			overlayStyle={{ display: !dragging ? 'none' : undefined }}
			key={index}
			placement="top"
		>
			<RcSlider.Handle value={value} {...rest} />
		</SliderTooltip>
	);
};
