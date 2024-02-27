import { useSelector, useStore } from '@/store/hooks';
import { PartNumberHeader as Presenter } from './PartNumberHeader';
import {
	clearPartNumberFilter,
	selectCurrentPartNumberResponse,
	selectMainPhotoUrl,
	selectMoldExpressType,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { Flag } from '@/models/api/Flag';
import { getMisumiOrVona } from '@/utils/domain/log';

type Props = {
	seriesCode: string;
	showsAllSpec?: boolean;
};
export const PartNumberHeader: React.VFC<Props> = ({
	seriesCode,
	showsAllSpec = false,
}) => {
	const series = useSelector(selectSeries);
	const response = useSelector(selectCurrentPartNumberResponse);
	const store = useStore();
	const moldExpressType = useSelector(selectMoldExpressType);
	const seriesImage = useSelector(selectMainPhotoUrl);
	const router = useRouter();
	const { Tab } = router.query;

	const handleClearFilter = useCallback(() => {
		const pageSize = getPartNumberPageSize(Tab);
		const payload: SearchPartNumberRequest = {
			seriesCode,
			pageSize,
		};
		if (showsAllSpec) {
			payload.allSpecFlag = Flag.TRUE;
		}

		clearPartNumberFilter(store)(payload);
	}, [Tab, seriesCode, showsAllSpec, store]);

	if (!response || response.partNumberList[0] == null) {
		return null;
	}

	return (
		<Presenter
			{...{
				maxGuideCount: response.maxGuideCount ?? 0, // zero? copied from deleted CartIn.tsx by dragon
				guideCount: response.guideCount ?? 0, // zero? copied from deleted CartIn.tsx by dragon
				totalCount: response.totalCount ?? 0, // zero? copied from deleted CartIn.tsx by dragon
				completeFlag: response.completeFlag,
				partNumber: response.partNumberList[0].partNumber,
				onClearFilter: handleClearFilter,
				cad3DPreviewFlag: series.cad3DPreviewFlag,
				brandCode: series.brandCode,
				seriesCode,
				cadId: response.cadIdList?.join() ?? '',
				cadDownloadButtonType: series.cadDownloadButtonType,
				moldExpressType,
				brandName: series.brandName,
				seriesName: series.seriesName,
				productImageList: series.productImageList,
				seriesImage,
				misumiOrVona: getMisumiOrVona(series.misumiFlag),
			}}
		/>
	);
};

PartNumberHeader.displayName = 'PartNumberHeader';
