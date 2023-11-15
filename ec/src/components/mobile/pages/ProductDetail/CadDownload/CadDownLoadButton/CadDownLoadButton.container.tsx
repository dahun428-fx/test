import { CadDownLoadButton as Presenter } from './CadDownLoadButton';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { useSelector } from '@/store/hooks';
import {
	selectCurrentPartNumberResponse,
	selectMainPhotoUrl,
	selectMoldExpressType,
	selectSeries,
} from '@/store/modules/pages/productDetail';

/** CAD download button container */
export const CadDownLoadButton: React.VFC = ({}) => {
	const {
		brandCode,
		brandName,
		seriesCode,
		seriesName,
		cadDownloadButtonType,
	} = useSelector(selectSeries);
	const { partNumberList, cadIdList, completeFlag } =
		useSelector(selectCurrentPartNumberResponse) ?? {};
	const moldExpressType = useSelector(selectMoldExpressType);
	const seriesImage = useSelector(selectMainPhotoUrl);

	// index zero? cloned from pc PartNumberHeader.tsx by dragon
	const partNumber = partNumberList?.[0]?.partNumber;

	if (!partNumber) {
		return null;
	}

	if (cadDownloadButtonType === CadDownloadButtonType.OFF) {
		return null;
	}

	return (
		<Presenter
			brandCode={brandCode}
			seriesCode={seriesCode}
			partNumber={partNumber}
			cadId={cadIdList?.join() ?? ''}
			cadDownloadButtonType={cadDownloadButtonType}
			completeFlag={completeFlag}
			moldExpressType={moldExpressType}
			brandName={brandName}
			seriesName={seriesName}
			seriesImage={seriesImage}
			dropdownPosition="bottom"
		/>
	);
};
CadDownLoadButton.displayName = 'CadDownLoadButton';
