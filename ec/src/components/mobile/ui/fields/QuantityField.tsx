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

type Props = Pick<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	name?: string;
	/**
	 * quantity value.
	 * If this value is null, input el value is empty.
	 */
	value: number | null;
	placeholder?: string;
	onChange: (value: number | null) => void;
	onBlur?: () => void;
	onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
	step?: number;
	min?: number;
	max?: number;
	className?: string;
	invalid?: boolean;
	disabled?: boolean;
};

function toHalfNumber(value: string) {
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
			onClick,
			className,
			step = 1,
			min = 1,
			max = 99999,
			invalid,
			...restProps
		},
		ref
	) => {
		const initialValue = String(value ?? '');
		const [internalValue, setInternalValue] = useState(initialValue);
		const compositingRef = useRef(false);

		/** Handles change event */
		const handleChange = (event: FormEvent<HTMLInputElement>) => {
			// If compositing, no operation.
			if (compositingRef.current) {
				return setInternalValue(event.currentTarget.value);
			}
			change(event.currentTarget.value);
		};

		const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
			onClick && onClick(event);
		};

		/**
		 * Handles composition end.
		 * Converts value to half-width.
		 */
		const handleCompositionEnd = (
			event: CompositionEvent<HTMLInputElement>
		) => {
			compositingRef.current = false;
			change(toHalfNumber(event.currentTarget.value));
		};

		/** Selects value on focus */
		const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
			event.currentTarget.select();
		};

		/** Updates qty. */
		const change = (value: string) => {
			if (value === '') {
				onChange(null);
				return setInternalValue(value);
			}

			const numeric = Number(value);
			// If not number value, revert previous value.
			if (Number.isNaN(numeric)) {
				return setInternalValue(initialValue);
			}

			// If user entered a decimal place value like 1.2, then revert it to the previous value
			if (numeric % 1 !== 0) {
				return setInternalValue(initialValue);
			}
			const next = String(numeric); // If empty, set as-is.
			onChange(numeric);
			setInternalValue(next);
		};

		/**
		 * Handles key down.
		 * increment on press Up key / decrement on press Down key
		 */
		const handleKeydown = (event: KeyboardEvent) => {
			if (compositingRef.current) {
				return;
			}

			switch (event.key) {
				case 'Up':
				case 'ArrowUp': {
					// suppress caret moves
					event.preventDefault();
					const value = Number(internalValue);
					const next = value - (value % step) + step;
					if (next <= max) {
						change(String(next));
					}
					return;
				}
				case 'Down':
				case 'ArrowDown': {
					const value = Number(internalValue);
					const next = value - (value % step || step);
					if (next >= min) {
						change(String(next));
					}
					return;
				}
			}
		};

		useEffect(() => {
			if (value !== Number(internalValue)) {
				setInternalValue(String(value ?? ''));
			}
			// NOTE: Update the "defaultValue" only when the props "value" is updated.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value]);

		return (
			<input
				className={classNames(styles.quantityField, className)}
				type="text"
				ref={ref}
				value={internalValue}
				name={name}
				autoComplete="off"
				aria-invalid={invalid}
				maxLength={5}
				onChange={handleChange}
				onClick={handleClick}
				onFocus={handleFocus}
				onKeyDown={handleKeydown}
				onCompositionStart={() => (compositingRef.current = true)}
				onCompositionEnd={handleCompositionEnd}
				{...restProps}
			/>
		);
	}
);
QuantityField.displayName = 'QuantityField';
