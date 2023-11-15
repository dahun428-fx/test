import classNames from 'classnames';
import NextLink from 'next/link';
import { AnchorHTMLAttributes, FC } from 'react';
import { UrlObject } from 'url';
import { Anchor } from './Anchor';
import styles from './LinkListItem.module.scss';

export const Themes = ['default', 'dark'] as const;
export type Theme = typeof Themes[number];

export type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
	/** href */
	href: string | UrlObject;
	/** disabled */
	disabled?: boolean;
	/** is open link new tab or not */
	newTab?: boolean;
	/** link color theme */
	theme?: Theme;
	isAnchor?: boolean;
};

/** LinkListItem component */
export const LinkListItem: FC<Props> = ({
	href,
	disabled,
	newTab,
	children,
	theme = 'default',
	isAnchor = true,
}) => {
	if (disabled) {
		return (
			<span className={classNames(styles.itemLink, styles.disabled)}>
				{children}
			</span>
		);
	}

	if (isAnchor) {
		return (
			<li>
				<Anchor
					className={classNames(styles.itemLink, {
						[String(styles.itemLinkNewTab)]: newTab,
					})}
					href={href}
					target={newTab ? '_blank' : '_self'}
					rel="noreferrer"
					data-theme={theme}
				>
					{children}
				</Anchor>
			</li>
		);
	}

	return (
		<li>
			<NextLink href={href}>
				<a className={styles.itemLink} data-theme={theme}>
					{children}
				</a>
			</NextLink>
		</li>
	);
};

LinkListItem.displayName = `LinkListItem`;
