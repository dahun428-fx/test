import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTrackPageView } from './NotFound.hooks';
import styles from './NotFound.module.scss';
import { pagesPath } from '@/utils/$path';

/** Not found */
export const NotFound = () => {
	const { t } = useTranslation();

	useTrackPageView();

	return (
		<>
			<Head>
				<title>{t('pages.notFound.headTitle')}</title>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<div className={styles.pageNotFound}>
				<h1 className={styles.title}>
					<span className={styles.mainTitle}>
						{t('pages.notFound.mainTitle')}
					</span>
					<span className={styles.subTitle}>
						{t('pages.notFound.subTitle')}
					</span>
				</h1>

				<p className={styles.errorMessage}>
					{t('pages.notFound.errorMessage')}
				</p>

				<ol className={styles.reasons}>
					<li className={styles.reasonItem}>
						{t('pages.notFound.reasons.pageHaveBeenDeleted')}
					</li>
					<li className={styles.reasonItem}>
						{t('pages.notFound.reasons.incorrectSearchKeywords')}
					</li>
					<li className={styles.reasonItem}>
						{t('pages.notFound.reasons.clearTheCache')}
					</li>
				</ol>

				<div className={styles.backToHome}>
					<Link href={pagesPath.$url()} passHref>
						<a className={styles.backToHomeButton}>
							{t('pages.notFound.backToHome')}
						</a>
					</Link>
				</div>
			</div>
		</>
	);
};

NotFound.displayName = `NotFound`;
