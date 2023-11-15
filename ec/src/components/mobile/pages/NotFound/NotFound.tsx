import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTrackPageView } from './NotFound.hooks';
import styles from './NotFound.module.scss';
import { LinkButton } from '@/components/mobile/ui/buttons';
import { pagesPath } from '@/utils/$path';

/** Not found component */
export const NotFound = () => {
	const { t } = useTranslation();

	useTrackPageView();

	return (
		<>
			<Head>
				<title>{t('mobile.pages.notFound.headTitle')}</title>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<div className={styles.pageNotFound}>
				<h1 className={styles.title}>
					<span className={styles.mainTitle}>
						{t('mobile.pages.notFound.mainTitle')}
					</span>
					<span className={styles.subTitle}>
						{t('mobile.pages.notFound.subTitle')}
					</span>
				</h1>
				<p className={styles.errorMessage}>
					{t('mobile.pages.notFound.errorMessage')}
				</p>
				<ol className={styles.reasons}>
					<li className={styles.reasonItem}>
						{t('mobile.pages.notFound.reasons.pageHaveBeenDeleted')}
					</li>
					<li className={styles.reasonItem}>
						{t('mobile.pages.notFound.reasons.incorrectSearchKeywords')}
					</li>
					<li className={styles.reasonItem}>
						{t('mobile.pages.notFound.reasons.clearTheCache')}
					</li>
				</ol>

				<div className={styles.backToHome}>
					<LinkButton
						href={pagesPath.$url().pathname}
						icon="right-arrow"
						size="max"
					>
						{t('mobile.pages.notFound.backToHome')}
					</LinkButton>
				</div>
			</div>
		</>
	);
};

NotFound.displayName = 'NotFound';
