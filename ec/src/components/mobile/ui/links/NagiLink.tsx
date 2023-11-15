import classNames from 'classnames';
import NextLink from 'next/link';
import React, { AnchorHTMLAttributes, forwardRef, FC } from 'react';
import { UrlObject } from 'url';
import styles from './NagiLink.module.scss';

export const Themes = ['primary', 'secondary'] as const;
export type Theme = typeof Themes[number];

export type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
	/** href */
	href: string | UrlObject;
	/** on new tab */
	newTab?: boolean;
	/** link color theme */
	theme?: Theme;
	/** disabled */
	disabled?: boolean;
};

/**
 * Nagi リンク コンポーネント
 */
export const NagiLink: FC<Props> = forwardRef<HTMLAnchorElement, Props>(
	(
		{
			href,
			children,
			newTab,
			className,
			target = newTab ? `_blank` : undefined,
			theme = 'primary',
			disabled,
			...props
		},
		ref
	) => {
		return disabled ? (
			<span className={styles.disabled}>{children}</span>
		) : (
			<NextLink href={href}>
				<a
					ref={ref}
					target={target}
					data-theme={theme}
					className={classNames(styles.nagiLink, className)}
					{...props}
				>
					{children}
				</a>
			</NextLink>
		);
	}
);

NagiLink.displayName = `NagiLink`;
