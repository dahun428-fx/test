import classNames from 'classnames';
import React, { AnchorHTMLAttributes, forwardRef, FC } from 'react';
import { UrlObject } from 'url';
import styles from './Anchor.module.scss';
import { convertToURLString } from '@/utils/url';

const themeList = ['primary', 'secondary', 'tertiary'] as const;
export type Theme = typeof themeList[number];

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
 * Anchor link
 */
export const Anchor: FC<Props> = forwardRef<HTMLAnchorElement, Props>(
	(
		{
			href,
			children,
			newTab,
			className,
			target = newTab ? '_blank' : undefined,
			theme = 'primary',
			disabled,
			...props
		},
		ref
	) => {
		const hrefValue =
			typeof href === 'string' ? href : convertToURLString(href);

		return disabled ? (
			<span className={classNames(styles.disabled, className)} {...props}>
				{children}
			</span>
		) : (
			<a
				href={hrefValue}
				ref={ref}
				target={target}
				data-theme={theme}
				className={classNames(styles.anchorLink, className)}
				{...props}
			>
				{children}
			</a>
		);
	}
);

Anchor.displayName = `Anchor`;
