import classNames from 'classnames';
import NextLink from 'next/link';
import React, { AnchorHTMLAttributes, forwardRef, FC } from 'react';
import { UrlObject } from 'url';
import styles from './Link.module.scss';

const themeList = ['primary', 'secondary'] as const;
export type Theme = typeof themeList[number];

export type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
	/** href */
	href: string | UrlObject;
	/** on new tab */
	newTab?: boolean;
	/** text-decoration theme */
	theme?: Theme;
};

/**
 * リンク コンポーネント
 */
export const Link: FC<Props> = forwardRef<HTMLAnchorElement, Props>(
	(
		{
			href,
			children,
			newTab,
			className,
			target = newTab ? `_blank` : undefined,
			theme = 'primary',
			...props
		},
		ref
	) => {
		return (
			<NextLink href={href} passHref>
				<a
					ref={ref}
					target={target}
					className={classNames(
						theme === 'primary' ? styles.primary : styles.secondary,
						className
					)}
					{...props}
				>
					{children}
				</a>
			</NextLink>
		);
	}
);

Link.displayName = `Link`;
