import { FC } from 'react';
import styles from './CadDownloadHead.module.scss';
import { useTranslation } from 'react-i18next';
import { NagiLink } from '@/components/pc/ui/links';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

type Props = {
	partNumber: string;
};

export const CadDownloadHead: FC<Props> = ({ partNumber }) => {
	const [t] = useTranslation();

	const handleOpenWindow = (event: React.MouseEvent) => {
		event.preventDefault();
		openSubWindow(url.cadFormatGuide, '_blank', { width: 990, height: 800 });
	};

	return (
		<>
			<h3 className={styles.title}>
				{t('components.domain.cadDownload.cadDownloadHead.title')}
				<NagiLink
					className={styles.buttonHelpIcon}
					href={url.cadGuide}
					target="_blank"
				>
					<span className={styles.helpIcon} />
				</NagiLink>
			</h3>
			<div className={styles.cadDownProductNo}>
				<h4>{t('components.domain.cadDownload.cadDownloadHead.partNumber')}</h4>
				<p>{partNumber}</p>
				<a onClick={e => handleOpenWindow(e)}>
					{t('components.domain.cadDownload.cadDownloadHead.guide')}
				</a>
			</div>
		</>
	);
};
CadDownloadHead.displayName = 'CadDownloadHead';
