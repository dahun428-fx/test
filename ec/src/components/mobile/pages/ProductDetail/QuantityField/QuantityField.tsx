import classNames from 'classnames';
import React, {
	FormEvent,
	FocusEvent,
	KeyboardEvent,
	CompositionEvent,
	useRef,
	useEffect,
	useState,
	forwardRef,
	InputHTMLAttributes,
} from 'react';
import styles from './QuantityField.module.scss';

type Theme = 'default' | 'sub';
type Size = 's' | 'm';

type Props = Pick<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
	name?: string;
	/**
	 * quantity value.
	 * If this value is null, input el value is empty.
	 */
	value: number | null;
	placeholder?: string;
	onChange?: (value: number | null) => void;
	onChangeByTrigger?: (value: number) => void;
	onBlur?: (value: number | null) => void;
	onPressEnter?: (value: number | null) => void;
	step?: number;
	min?: number;
	max?: number;
	className?: string;
	invalid?: boolean;
	disabled?: boolean;
	theme?: Theme;
	size?: Size;
};

/** Converts full-width numbers in a string to their half-width equivalent. */
function toHalfWidthNumber(value: string) {
	return value.replace(/[０-９]/g, c =>
		String.fromCharCode(c.charCodeAt(0) - 0xfee0)
	);
}

/**
 * Quantity Input Field.
 */
export const QuantityField = forwardRef<HTMLInputElement, Props>(
	(
		{
			name,
			value,
			onChange,
			onChangeByTrigger,
			onPressEnter,
			onBlur,
			className,
			step = 1,
			min = 1,
			max = 99999,
			invalid,
			theme = 'default',
			size = 'm',
			...restProps
		},
		ref
	) => {
		const initialValue = String(value ?? '');
		const [innerValue, setInnerValue] = useState(initialValue);
		const compositingRef = useRef(false);
		const numerical = Number(innerValue);

		/** Handles change event */
		const handleChange = (event: FormEvent<HTMLInputElement>) => {
			// If compositing, no operation.
			if (compositingRef.current) {
				return setInnerValue(event.currentTarget.value);
			}
			change(event.currentTarget.value);
		};

		/**
		 * Handles composition end.
		 * Converts value to half-width.
		 */
		const handleCompositionEnd = (
			event: CompositionEvent<HTMLInputElement>
		) => {
			compositingRef.current = false;
			change(toHalfWidthNumber(event.currentTarget.value));
		};

		/** Selects value on focus */
		const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
			event.currentTarget.select();
		};

		/** Updates qty. */
		const change = (value: string) => {
			if (value === '') {
				onChange?.(null);
				return setInnerValue(value);
			}

			const numerical = Number(value);
			// If not number value, revert previous value.
			if (Number.isNaN(numerical)) {
				return setInnerValue(initialValue);
			}
			const next = String(numerical); // If empty, set as-is.
			onChange?.(numerical);
			setInnerValue(next);
		};

		/**
		 * Handles click plus button.
		 */
		const handleClickPlus = () => {
			if (compositingRef.current) {
				return;
			}

			const value = Number(innerValue);
			const next = value - (value % step) + step;
			if (next <= max) {
				onChangeByTrigger?.(next);
				onChange?.(next);
				setInnerValue(String(next));
			}
		};

		/**
		 * Handles click minus button.
		 */
		const handleClickMinus = () => {
			if (compositingRef.current) {
				return;
			}

			const value = Number(innerValue);
			const next = value - (value % step || step);
			if (next >= min) {
				onChangeByTrigger?.(next);
				onChange?.(next);
				setInnerValue(String(next));
			}
		};

		const handleBlur = () => {
			onBlur?.(innerValue === '' ? null : numerical);
		};

		const handleKeypress = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				onPressEnter?.(innerValue === '' ? null : numerical);
			}
		};

		useEffect(() => {
			if (value !== Number(innerValue)) {
				setInnerValue(String(value ?? ''));
			}
			// NOTE: Update the "defaultValue" only when the props "value" is updated.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value]);

		return (
			<div className={styles.container}>
				<button
					className={styles.button}
					type="button"
					disabled={!Number.isNaN(numerical) && numerical - step < min}
					onClick={handleClickMinus}
					data-theme={theme}
					data-size={size}
				>
					-
				</button>
				<input
					className={classNames(styles.input, className)}
					type="text"
					ref={ref}
					value={innerValue}
					name={name}
					autoComplete="off"
					aria-invalid={invalid}
					maxLength={5}
					onChange={handleChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					onKeyPress={handleKeypress}
					onCompositionStart={() => (compositingRef.current = true)}
					onCompositionEnd={handleCompositionEnd}
					data-theme={theme}
					data-size={size}
					{...restProps}
				/>
				<button
					className={styles.button}
					type="button"
					disabled={!Number.isNaN(numerical) && numerical + step > max}
					onClick={handleClickPlus}
					data-theme={theme}
					data-size={size}
				>
					+
				</button>
			</div>
		);
	}
);
QuantityField.displayName = 'QuantityField';
