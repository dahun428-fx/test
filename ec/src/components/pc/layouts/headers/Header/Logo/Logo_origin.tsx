import Link from 'next/link';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from './Logo.hooks';
import styles from './Logo.module.scss';
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
		<div className={styles.container}>
			<div className={styles.logoWrapper}>
				{needsHeading ? (
					<h1 className={styles.logo}>
						{t('components.ui.layouts.headers.header.logo.heading')}
					</h1>
				) : (
					<Link href={pagesPath.$url()}>
						<a className={styles.logo}>
							{t('components.ui.layouts.headers.header.logo.heading')}
						</a>
					</Link>
				)}
			</div>
			<div className={styles.catchCopy}>
				<Trans i18nKey="components.ui.layouts.headers.header.logo.catchCopy">
					<span className={styles.emphasis} />
					<span className={styles.emphasis} />
					<span className={styles.emphasis} />
				</Trans>
			</div>
			{!isPurchaseLinkUser && (
				<div className={styles.businessHour}>
					<span>
						<Trans i18nKey="components.ui.layouts.headers.header.logo.businessHour">
							<span className={styles.tel} />
						</Trans>
					</span>
				</div>
			)}
		</div>
	);
};
Logo.displayName = 'Logo';
