import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTrackPageView } from './ApplicationErrorContents.hooks';
import styles from './ApplicationErrorContents.module.scss';
import { pagesPath } from '@/utils/$path';

/**
 * ApplicationErrorContents
 *
 * - NOTE: ApplicationError と RootErrorBoundary が共有で利用するエラーコンテンツ表示部
 *         共有ですが、もし出し分けしたい場合は RootErrorBoundary から props もらうようにしてください
 */
export const ApplicationErrorContents: React.FC = () => {
	/** i18n translator */
	const [t] = useTranslation();

	useTrackPageView();

	//===========================================================================

	return (
		<div className={styles.errorArea}>
			<h1 className={styles.errorTitle}>
				<span className={styles.errorTitleMain}>
					{t('components.error.applicationErrorContents.mainTitle')}
				</span>
				<span className={styles.errorTitleSide}>
					{t('components.error.applicationErrorContents.sideTitle')}
				</span>
			</h1>
			<p className={styles.errorAreaText}>
				{t('components.error.applicationErrorContents.description')}
			</p>
			<div className={styles.backToHome}>
				<Link href={pagesPath.$url().pathname} passHref>
					<a className={styles.backToHomeButton}>
						{t('components.error.applicationErrorContents.linkCaption')}
					</a>
				</Link>
			</div>
		</div>
	);
};
ApplicationErrorContents.displayName = `ApplicationErrorContents`;
