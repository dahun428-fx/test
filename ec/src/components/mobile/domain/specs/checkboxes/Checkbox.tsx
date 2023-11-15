import classNames from 'classnames';
import React from 'react';
import styles from './Checkbox.module.scss';

export const Themes = ['default', 'sub'] as const;
export type Theme = typeof Themes[number];

type Props = {
	className?: string;
	checked: boolean;
	disabled?: boolean;
	theme?: Theme;
	onClick?: () => void;
};

/**
 * Spec checkbox tile
 */
export const Checkbox: React.FC<Props> = ({
	className,
	checked,
	disabled,
	theme = 'default',
	onClick,
	children,
}) => {
	return (
		<div
			className={classNames(styles.checkbox, className)}
			role="checkbox"
			aria-checked={checked}
			aria-disabled={disabled}
			data-theme={theme}
			onClick={disabled ? undefined : () => onClick && onClick()}
		>
			{children}
		</div>
	);
};
Checkbox.displayName = 'Checkbox';
