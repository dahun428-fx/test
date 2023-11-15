import classNames from 'classnames';
import React, { forwardRef } from 'react';
import styles from './Button.module.scss';
import {
	ButtonBase,
	ButtonBaseProps,
	LinkButtonBaseProps,
	LinkButtonBase,
} from '@/components/mobile/ui/buttons/ButtonBase';

export const Themes = [
	'strong',
	'conversion',
	'default',
	'default-sub',
] as const;
export type Theme = typeof Themes[number];

export const Icons = [
	'order-now',
	'cart',
	'right-arrow',
	'left-arrow',
	'download',
	'save',
	'pdf',
	'book',
	'copy',
	'application',
	'large-right-arrow',
	'zip',
	'refresh',
	'quote',
	'search',
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

const iconBrightnessMap = new Map<Theme | 'disabled', 'dark' | 'light'>([
	['strong', 'light'],
	['conversion', 'light'],
	['default', 'dark'],
	['default-sub', 'dark'],
	['disabled', 'light'],
]);

function getDataIcon(
	theme: Theme,
	disabled: boolean | undefined,
	icon: Icon | undefined
) {
	if (!icon) {
		return undefined;
	}
	return `${iconBrightnessMap.get(disabled ? 'disabled' : theme)}:${icon}`;
}

/**
 * Button Component.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, theme = 'default', icon, ...props }, ref) => {
		return (
			<ButtonBase
				ref={ref}
				className={classNames(
					styles.button,
					{ [String(styles.prefixIcon)]: !!icon },
					className
				)}
				data-theme={theme}
				data-icon={getDataIcon(theme, props.disabled, icon)}
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
				className={classNames(
					styles.button,
					{ [String(styles.prefixIcon)]: !!icon },
					className
				)}
				data-theme={theme}
				data-icon={getDataIcon(theme, props.disabled, icon)}
				{...props}
			/>
		);
	}
);
LinkButton.displayName = 'LinkButton';
