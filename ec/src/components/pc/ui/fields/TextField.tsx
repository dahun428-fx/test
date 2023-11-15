import classNames from 'classnames';
import React, {
	FocusEvent,
	CompositionEvent,
	useRef,
	useEffect,
	useState,
	forwardRef,
	FormEvent,
	KeyboardEvent,
} from 'react';
import styles from './TextField.module.scss';

type Props = Pick<
	React.InputHTMLAttributes<HTMLInputElement>,
	'className' | 'disabled' | 'placeholder'
> & {
	value: string | null;
	onChange: (value: string) => void;
	onBlur?: () => void;
	onKeyDownEnter?: () => void;
};

/**
 * Text input field
 */
export const TextField = forwardRef<HTMLInputElement, Props>(
	({ value, onChange, onKeyDownEnter, className, ...restProps }, ref) => {
		const initialValue = value ?? '';
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

		/**
		 * Handles composition end.
		 * Converts value to half-width.
		 */
		const handleCompositionEnd = (
			event: CompositionEvent<HTMLInputElement>
		) => {
			compositingRef.current = false;
			change(event.currentTarget.value);
		};

		/** Selects value on focus */
		const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
			event.currentTarget.select();
		};

		const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
			if (onKeyDownEnter && event.key === 'Enter') {
				onKeyDownEnter();
			}
		};

		/** Update value */
		const change = (value: string) => {
			onChange(value);
			setInternalValue(value);
		};

		useEffect(() => {
			if (value !== internalValue) {
				setInternalValue(value ?? '');
			}
			// NOTE: Update the "defaultValue" only when the props "value" is updated.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [value]);

		return (
			<input
				className={classNames(styles.textField, className)}
				type="text"
				ref={ref}
				value={internalValue}
				autoComplete="off"
				onChange={handleChange}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
				onCompositionStart={() => (compositingRef.current = true)}
				onCompositionEnd={handleCompositionEnd}
				{...restProps}
			/>
		);
	}
);
TextField.displayName = 'TextField';
