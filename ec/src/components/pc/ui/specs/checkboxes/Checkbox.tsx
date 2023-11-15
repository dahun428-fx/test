import classNames from 'classnames';
import React from 'react';
import styles from './Checkbox.module.scss';

type Props = {
	className?: string;
	checked: boolean;
	disabled?: boolean;
	onClick?: () => void;
	/**
	 * テキストを改行させるとき、true
	 * 現在の対象は、
	 * - メーカーカテゴリー画面[/vona2/maker/[brandCode]/[...categoryCode].pc.tsx]
	 * - カテゴリー画面[/vona2/[...categoryCode].pc.tsx]
	 */
	isBreakWordForText?: boolean;
};

/**
 * Spec checkbox
 */
export const Checkbox: React.FC<Props> = ({
	className,
	checked,
	disabled,
	onClick,
	children,
	isBreakWordForText,
}) => {
	return (
		// I want to change li to input...
		<li
			className={classNames([
				styles.checkbox,
				className,
				{
					[String(styles.wrap)]: isBreakWordForText,
				},
			])}
			role="checkbox"
			aria-checked={checked}
			aria-disabled={disabled}
			onClick={disabled ? undefined : () => onClick && onClick()}
		>
			{children}
		</li>
	);
};
Checkbox.displayName = 'Checkbox';
