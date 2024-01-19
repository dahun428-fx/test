import classNames from 'classnames';
import React, { forwardRef } from 'react';
import styles from './Button.module.scss';
import {
	ButtonBase,
	ButtonBaseProps,
	LinkButtonBaseProps,
	LinkButtonBase,
} from './ButtonBase';

export const Themes = [
	'strong',
	'conversion',
	'default',
	'default-sub',
	'default-sub-tiny',
] as const;
export type Theme = typeof Themes[number];

// TODO: 消す予定
const oldIconList = [
	'right-arrow',
	'save',
	'copy',
	'application',
	'large-right-arrow',
	'zip',
	'refresh',
	'quote',
	'search',
] as const;

export const Icons = [
	'up-arrow',
	'down-arrow',
	'left-arrow',
	'order-now',
	'cart',
	'download',
	'pdf',
	'price-check',
	'apply-sample',
	'add-my-component',
	'similar-search',
	'wos-quote',
	'plus',
	'minus',
	...oldIconList,
] as const;
export type Icon = typeof Icons[number];

export type ButtonProps = ButtonBaseProps & {
	/** ボタンのカラーテーマ */
	theme?: Theme;
	icon?: Icon;
};

export type LinkButtonProps = LinkButtonBaseProps & {
	/** ボタンのカラーテーマ */
	theme?: Theme;
	icon?: Icon;
};

/**
 * Button Component.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, theme = 'default', icon, ...props }, ref) => {
		return (
			<ButtonBase
				ref={ref}
				className={classNames(styles.button, styles.prefixIcon, className)}
				data-theme={theme}
				data-icon={icon}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

/**
 * Link Button Component.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	({ className, theme = 'default', icon, ...props }, ref) => {
		return (
			<LinkButtonBase
				ref={ref}
				className={classNames(styles.button, styles.prefixIcon, className)}
				data-theme={theme}
				data-icon={icon}
				{...props}
			/>
		);
	}
);
LinkButton.displayName = 'LinkButton';
