import Link from 'next/link';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from './Logo.hooks';
import styles from '../Header.module.scss';
import { pagesPath } from '@/utils/$path';

type Props = {
	needsHeading: boolean;
};

/**
 * Logo
 */
export const Logo: React.VFC<Props> = ({ needsHeading }) => {
	const { t } = useTranslation();
	const isPurchaseLinkUser = useAuth();

	return (
		<div className={styles.headerLogoWrap}>
			{needsHeading ? (
				<h1 className={styles.headerLogo}>
					<span>{t('components.ui.layouts.headers.header.logo.heading')}</span>
				</h1>
			) : (
				<Link href={pagesPath.$url()}>
					<a className={styles.headerLogo}>
						<span>
							{t('components.ui.layouts.headers.header.logo.heading')}
						</span>
					</a>
				</Link>
			)}
		</div>
	);
};
Logo.displayName = 'Logo';
