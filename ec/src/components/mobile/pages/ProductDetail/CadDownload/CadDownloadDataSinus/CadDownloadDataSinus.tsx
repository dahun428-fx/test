import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CadDownloadDataSinus.module.scss';

/** CAD Download Data Sinus */
export const CadDownloadDataSinus: VFC = () => {
	const [t] = useTranslation();

	return (
		<div>
			<h3 className={styles.title}>
				{t('mobile.pages.productDetail.cadDownload.cadDownloadDataSinus.title')}
			</h3>
			<div className={styles.message}>
				{t(
					'mobile.pages.productDetail.cadDownload.cadDownloadDataSinus.message'
				)}
			</div>
		</div>
	);
};
CadDownloadDataSinus.displayName = 'CadDownloadDataSinus';
