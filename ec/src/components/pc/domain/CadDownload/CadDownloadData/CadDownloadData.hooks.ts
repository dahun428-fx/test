import { useMemo, useState } from 'react';
import { downloadCad } from '@/api/services/downloadCad';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useBoolState } from '@/hooks/state/useBoolState';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DynamicParams } from '@/models/domain/cad';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { createParam } from '@/utils/cad';

/**
 * CAD download data hook
 */
export const useCadDownloadData = ({
	moldExpressType,
	partNumber,
	cadId,
	brandCode,
	brandName,
	seriesCode,
	seriesName,
	seriesImage,
}: {
	seriesCode: string;
	moldExpressType?: string;
	partNumber?: string;
	cadId?: string;
	brandCode: string;
	brandName: string;
	seriesName: string;
	seriesImage?: string;
}) => {
	const [cadData, setCadData] = useState<DownloadCadResponse>();
	const { userCode } = useSelector(selectAuth);
	const [loading, startToLoad, endLoading] = useBoolState();

	const cadDynamic: DynamicParams[] | null = useMemo(() => {
		if (!cadData || !partNumber || !userCode) {
			return null;
		}

		return cadData.dynamic3DCadList.map(item => {
			return createParam({
				parameterMap: item.parameterMap,
				partNumber,
				userCode,
				moldExpressType,
				brandCode,
				brandName,
				seriesCode,
				seriesName,
				seriesImage,
			});
		});
	}, [
		brandCode,
		brandName,
		cadData,
		moldExpressType,
		partNumber,
		seriesImage,
		seriesCode,
		seriesName,
		userCode,
	]);

	const getCadDownloadData = async () => {
		try {
			startToLoad();
			const response = await downloadCad({
				seriesCode,
				partNumber,
				cadId,
			});
			setCadData(response);
		} catch (error) {
			// noop
		} finally {
			endLoading();
		}
	};

	useOnMounted(getCadDownloadData);

	return { cadData, cadDynamic, loading };
};
