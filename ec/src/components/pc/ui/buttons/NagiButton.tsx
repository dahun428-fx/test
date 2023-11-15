import classNames from 'classnames';
import React, { forwardRef } from 'react';
import {
	ButtonBase,
	ButtonBaseProps,
	LinkButtonBase,
	LinkButtonBaseProps,
} from './ButtonBase';
import styles from './NagiButton.module.scss';

export type ColorTheme = 'primary' | 'secondary' | 'tertiary';

export type ButtonProps = ButtonBaseProps & {
	theme?: ColorTheme;
};

export type LinkButtonProps = LinkButtonBaseProps & {
	theme?: ColorTheme;
};

/**
 * 凪デザイン？のボタン
 * @deprecated
 */
export const NagiButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, theme = 'primary', ...props }, ref) => {
		return (
			<ButtonBase
				ref={ref}
				data-theme={theme}
				className={classNames(styles.nagiButton, className)}
				{...props}
			/>
		);
	}
);
NagiButton.displayName = 'NagiButton';

/**
 * 凪デザイン？のリンクボタン
 * @deprecated
 */
export const NagiLinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
	({ className, theme = 'primary', ...props }, ref) => {
		return (
			<LinkButtonBase
				ref={ref}
				data-theme={theme}
				className={classNames(styles.nagiButton, className)}
				{...props}
			/>
		);
	}
);
NagiLinkButton.displayName = 'NagiLinkButton';
