import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTrackPageView } from './ApplicationErrorContents.hooks';
import styles from './ApplicationErrorContents.module.scss';
import { pagesPath } from '@/utils/$path';
/**
 * ApplicationErrorContents
 *
 * - NOTE: ApplicationError and RootErrorBoundary are shared error content
 *         but if you want to separate them, pass props to RootErrorBoundary
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
					{t('mobile.components.error.applicationErrorContents.mainTitle')}
				</span>
				<span className={styles.errorTitleSide}>
					{t('mobile.components.error.applicationErrorContents.sideTitle')}
				</span>
			</h1>
			<p className={styles.errorAreaText}>
				{t('mobile.components.error.applicationErrorContents.description')}
			</p>
			<div className={styles.goToTop}>
				<a className={styles.gotoTopLink} href={pagesPath.$url().pathname}>
					{t('mobile.components.error.applicationErrorContents.linkCaption')}
				</a>
			</div>
		</div>
	);
};
ApplicationErrorContents.displayName = `ApplicationErrorContents`;
