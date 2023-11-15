import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { PartNumberHeader as Presenter } from './PartNumberHeader';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	clearPartNumberFilter,
	selectCurrentPartNumberResponse,
	selectMainPhotoUrl,
	selectMoldExpressType,
	selectSeries,
	selectTemplateType,
} from '@/store/modules/pages/productDetail';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';

type Props = {
	seriesCode: string;
	showsAllSpec?: boolean;
};

/**
 * PartNumberHeader container
 * WARN: Experimental. Violates development rules. Container implementation is forbidden, implement with hooks.
 */
export const PartNumberHeader: React.VFC<Props> = ({
	seriesCode,
	showsAllSpec = false,
}) => {
	const series = useSelector(selectSeries);
	const response = useSelector(selectCurrentPartNumberResponse);
	const store = useStore();
	const templateType = useSelector(selectTemplateType);
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
				// TODO: templateType should get get in order of Template query parameter -> series
				templateType: templateType || series.templateType,
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
			}}
		/>
	);
};
PartNumberHeader.displayName = 'PartNumberHeader';
