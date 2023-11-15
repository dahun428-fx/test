import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styles from './SimpleLogo.module.scss';
import { pagesPath } from '@/utils/$path';

/**
 * logo for simple layout
 */
export const SimpleLogo: React.VFC = () => {
	const { t } = useTranslation();
	return (
		<Link href={pagesPath.$url()}>
			<a className={styles.logo}>
				{t('components.ui.layouts.headers.header.logo.heading')}
			</a>
		</Link>
	);
};
SimpleLogo.displayName = 'SimpleLogo';
