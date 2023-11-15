import classNames from 'classnames';
import React, { useCallback } from 'react';
import styles from './TextArea.module.scss';

type Props = Partial<Pick<HTMLElement, 'className'>> &
	Partial<
		Pick<
			HTMLTextAreaElement,
			| 'defaultValue'
			| 'placeholder'
			| 'maxLength'
			| 'disabled'
			| 'readOnly'
			| 'wrap'
		>
	> & {
		selectAllOnFocus?: boolean;
		onChange?: (value: string) => void;
		onFocus?: (event: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
		onKeyUp?: (value: string) => void;
	};

export const TextArea: React.VFC<Props> = ({
	className,
	defaultValue,
	disabled,
	readOnly,
	selectAllOnFocus,
	onChange,
	onFocus,
	onKeyUp,
	...restProps
}) => {
	const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				onChange && onChange(event.target.value);
			},
			[onChange]
		);

	const handleFocus: React.FocusEventHandler<HTMLTextAreaElement> = useCallback(
		event => {
			if (selectAllOnFocus) {
				event.target.select();
			}
			onFocus && onFocus(event);
		},
		[onFocus, selectAllOnFocus]
	);

	const handleKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> =
		useCallback(
			event => {
				onKeyUp && onKeyUp(event.currentTarget.value);
			},
			[onKeyUp]
		);

	return (
		<textarea
			{...{
				defaultValue,
				disabled,
				readOnly,
				'aria-disabled': disabled,
				'aria-readonly': readOnly,
				onChange: handleChange,
				onFocus: handleFocus,
				onKeyUp: handleKeyUp,
				...restProps,
			}}
			className={classNames(styles.textArea, className)}
		/>
	);
};
TextArea.displayName = 'TextArea';
