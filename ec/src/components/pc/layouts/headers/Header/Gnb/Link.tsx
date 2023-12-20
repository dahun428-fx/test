import NextLink from 'next/link';
import styles from './Gnb.module.scss';
import { useTranslation } from 'react-i18next';
import React from 'react';

export type LinkItem = {
	label: string;
	link: string;
	isNew?: boolean;
};
export const Link: React.FC<LinkItem> = ({ label, link, isNew, children }) => {
	const [t] = useTranslation();

	return (
		<NextLink href={link}>
			{isNew ? (
				<a>
					<span className={styles.n}>
						{t('components.ui.layouts.headers.header.gnb.n')}
					</span>
					{label}
					{children}
				</a>
			) : (
				<a>
					{label}
					{children}
				</a>
			)}
		</NextLink>
	);
};
