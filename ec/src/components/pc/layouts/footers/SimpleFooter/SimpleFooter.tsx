import { useTranslation } from 'react-i18next';
import styles from './SimpleFooter.module.scss';

/**
 * simple layout footer
 */
export const SimpleFooter: React.VFC = () => {
	const { t } = useTranslation();
	return (
		<div className={styles.footer}>
			<div className={styles.copyright}>
				{t('components.ui.layouts.footers.footer.copyright')}
			</div>
		</div>
	);
};
SimpleFooter.displayName = 'SimpleFooter';
