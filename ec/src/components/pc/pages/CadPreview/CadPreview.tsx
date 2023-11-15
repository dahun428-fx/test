import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadPreview, useTrackPageView } from './CadPreview.hooks';
import styles from './CadPreview.module.scss';
import { CadPreviewError } from './CadPreviewError';
import { CadenasPreview } from './CadenasPreview';
import { SinusPreview } from './SinusPreview';
import { CadDownLoadButton } from '@/components/pc/domain/CadDownload';
import { Button } from '@/components/pc/ui/buttons';
import { Flag } from '@/models/api/Flag';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { CadSiteType } from '@/models/domain/cad';
import { Query } from '@/pages/vona2/3dpreview.pc';

export type Props = Query & {
	cadDownloadButtonType: CadDownloadButtonType;
	completeFlag: Flag;
};

/**
 * 3D CAD preview
 */
export const CadPreview: React.VFC<Props> = ({
	brandCode,
	seriesCode,
	partNumber,
	cadId,
	completeFlag,
	cadDownloadButtonType,
	moldExpressType,
	brandName,
	seriesName,
	seriesImage,
}) => {
	const { t } = useTranslation();

	// I want to use loading state. (big refactoring)
	const { preview, errorState } = useCadPreview({
		seriesCode,
		partNumber,
		cadId,
	});

	const [showsClose, setShowsClose] = useState(false);

	/** handle click close */
	const handleClickClose = () => {
		window.close();
	};

	useTrackPageView({
		brandCode,
		brandName,
		seriesCode,
		seriesName,
		partNumber,
	});

	useEffect(() => {
		// SSR 側で実行されないように useEffect で判定
		if (
			typeof window !== 'undefined' &&
			window.opener &&
			window.opener !== window.self
		) {
			setShowsClose(true);
		}
	}, []);

	return (
		<>
			<Head>
				<title>{t('pages.cadPreview.title')}</title>
			</Head>
			<div>
				<h1 className={styles.partNumber}>
					{t('pages.cadPreview.partNumber', { partNumber })}
				</h1>
				<div className={styles.preview}>
					{errorState ? (
						<CadPreviewError
							errorType={errorState}
							isSinus={preview?.cadSiteType === CadSiteType.SINUS}
						/>
					) : (
						preview &&
						preview.dynamic3DCadPreviewList[0] &&
						partNumber &&
						(preview.cadSiteType === CadSiteType.SINUS ? (
							<SinusPreview
								{...{
									params: preview.dynamic3DCadPreviewList[0].parameterMap,
									brandCode,
									seriesCode,
									partNumber,
								}}
							/>
						) : preview.cadSiteType === CadSiteType.CADENAS ? (
							<CadenasPreview
								{...{
									params: preview.dynamic3DCadPreviewList[0].parameterMap,
									partNumber,
								}}
							/>
						) : null)
					)}
				</div>
				<ul className={styles.buttons}>
					{showsClose && (
						<li>
							<Button onClick={handleClickClose}>Close</Button>
						</li>
					)}
					<li>
						{cadDownloadButtonType !== CadDownloadButtonType.OFF && (
							<CadDownLoadButton
								brandCode={brandCode}
								cadDownloadButtonType={cadDownloadButtonType}
								seriesCode={seriesCode}
								partNumber={partNumber}
								cadId={cadId}
								completeFlag={completeFlag}
								moldExpressType={moldExpressType}
								brandName={brandName}
								seriesName={seriesName}
								seriesImage={seriesImage}
								dropdownPosition="top"
							/>
						)}
					</li>
				</ul>
			</div>
		</>
	);
};
CadPreview.displayName = 'CadPreview';
