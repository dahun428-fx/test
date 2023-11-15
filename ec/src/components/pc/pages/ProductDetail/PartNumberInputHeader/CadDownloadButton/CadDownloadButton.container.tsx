import React from 'react';
import { CadDownLoadButton as Presenter } from '@/components/pc/domain/CadDownload';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { useSelector } from '@/store/hooks';
import {
	selectCurrentPartNumberResponse,
	selectInputPartNumber,
	selectMainPhotoUrl,
	selectMoldExpressType,
	selectSeries,
} from '@/store/modules/pages/productDetail';

export const CadDownloadButton: React.VFC = () => {
	const series = useSelector(selectSeries);
	const partNumberResponse = useSelector(selectCurrentPartNumberResponse);
	const moldExpressType = useSelector(selectMoldExpressType);
	const seriesImage = useSelector(selectMainPhotoUrl);
	const inputPartNumber = useSelector(selectInputPartNumber);

	if (
		series.cadDownloadButtonType === CadDownloadButtonType.OFF ||
		partNumberResponse == null
	) {
		return null;
	}

	const { completeFlag, cadIdList, partNumberList } = partNumberResponse;

	return (
		<Presenter
			seriesCode={series.seriesCode}
			seriesName={series.seriesName}
			seriesImage={seriesImage}
			brandCode={series.brandCode}
			brandName={series.brandName}
			cadDownloadButtonType={series.cadDownloadButtonType}
			partNumber={partNumberList[0]?.partNumber ?? inputPartNumber ?? ''}
			completeFlag={completeFlag}
			cadId={cadIdList?.join(',') ?? ''}
			moldExpressType={moldExpressType}
			dropdownPosition="bottom"
		/>
	);
};
CadDownloadButton.displayName = 'CadDownloadButton';
