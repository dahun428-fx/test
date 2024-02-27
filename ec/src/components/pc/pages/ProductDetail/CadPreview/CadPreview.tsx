import React from 'react';
import styles from './CadPreview.module.scss';
import { CadDownLoadButton } from '@/components/pc/domain/CadDownload';
import { useCadPreview } from '@/components/pc/pages/CadPreview/CadPreview.hooks';
import { CadPreviewError } from '@/components/pc/pages/CadPreview/CadPreviewError';
import { CadenasPreview } from '@/components/pc/pages/CadPreview/CadenasPreview';
import { SinusPreview } from '@/components/pc/pages/CadPreview/SinusPreview';
import { CatalogDownload } from '@/components/pc/pages/ProductDetail/CatalogDownload';
import { CadSiteType } from '@/models/domain/cad';
import { Query } from '@/pages/vona2/3dpreview.pc';
import {
	CadenasParameters,
	SinusParameters,
} from '@/models/api/msm/ect/cad/PreviewCadResponse';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { Flag } from '@/models/api/Flag';

export type Props = Omit<Query, 'completeFlag'> & {
	cadDownloadButtonType: CadDownloadButtonType;
	completeFlag?: Flag;
	innerCode?: string;
};

/**
 * 3D CAD preview
 */
export const CadPreview: React.VFC<Props> = ({
	brandCode,
	seriesCode,
	innerCode,
	partNumber,
	cadId,
	completeFlag,
	cadDownloadButtonType,
	moldExpressType,
	brandName,
	seriesName,
	seriesImage,
}) => {
	// I want to use loading state. (big refactoring)
	const { preview, errorState } = useCadPreview({
		seriesCode,
		partNumber,
		cadId,
	});

	const params = preview?.dynamic3DCadPreviewList[0]?.parameterMap;
	const hasError = errorState || !partNumber || !params;

	if (hasError) {
		return (
			<CadPreviewError
				errorType={
					errorState ?? !completeFlag
						? 'part-number-incomplete-error'
						: 'unavailable-part-number-error'
				}
				isSinus={preview?.cadSiteType === CadSiteType.SINUS}
			/>
		);
	}

	return (
		<div>
			<div className={styles.preview}>
				{preview.cadSiteType === CadSiteType.SINUS && (
					<SinusPreview
						{...{
							params: params as SinusParameters,
							partNumber,
							brandCode,
							seriesCode,
						}}
					/>
				)}
				{preview.cadSiteType === CadSiteType.CADENAS && (
					<CadenasPreview
						{...{
							params: params as CadenasParameters,
							partNumber,
						}}
					/>
				)}
			</div>
			<ul className={styles.buttons}>
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
				<li>
					<CatalogDownload
						partNumber={partNumber}
						seriesCode={seriesCode}
						innerCode={innerCode}
						cadId={cadId}
					/>
				</li>
			</ul>
		</div>
	);
};
CadPreview.displayName = 'CadPreview';
