import classNames from 'classnames';
import React, { AnchorHTMLAttributes, forwardRef, FC } from 'react';
import { UrlObject } from 'url';
import styles from './Anchor.module.scss';
import { convertToURLString } from '@/utils/url';

export const Themes = ['primary', 'secondary'] as const;
export type Theme = typeof Themes[number];

export type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
	href: string | UrlObject;
	newTab?: boolean;
	theme?: Theme;
	disabled?: boolean;
};

/** Anchor component */
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

		if (disabled) {
			return <span className={styles.disabled}>{children}</span>;
		}

		return (
			<a
				href={hrefValue}
				ref={ref}
				target={target}
				data-theme={theme}
				className={classNames(styles.anchor, className)}
				{...props}
			>
				{children}
			</a>
		);
	}
);

Anchor.displayName = 'Anchor';
