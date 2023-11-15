import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSinusPreview } from './SinusPreview.hooks';
import styles from './SinusPreview.module.scss';
import { CadPreviewError } from '@/components/pc/pages/CadPreview/CadPreviewError';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { SinusParameters } from '@/models/api/msm/ect/cad/PreviewCadResponse';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

export type Props = {
	params: SinusParameters;
	brandCode: string;
	seriesCode: string;
	partNumber: string;
};

/**
 * SINUS preview
 */
export const SinusPreview: React.VFC<Props> = ({
	params,
	brandCode,
	seriesCode,
	partNumber,
}) => {
	const { loading, previewUrl, errorState } = useSinusPreview({
		params,
		brandCode,
		seriesCode,
		partNumber,
	});
	const { t } = useTranslation();

	/** handle click cad guide link */
	const handleClickGuide = () => {
		openSubWindow(url.sinusGuide, '_blank', { width: 990, height: 800 });
	};

	return (
		<div className={styles.container}>
			{loading ? (
				<div className={styles.loader}>
					<BlockLoader />
				</div>
			) : errorState ? (
				<CadPreviewError errorType={errorState} isSinus />
			) : (
				<div className={styles.preview}>
					<iframe src={previewUrl} className={styles.iframe} allowFullScreen />
					<div className={styles.help} onClick={handleClickGuide}>
						{t('pages.cadPreview.sinusPreview.operationGuide')}
					</div>
				</div>
			)}
		</div>
	);
};
SinusPreview.displayName = 'SinusPreview';
