import { useTranslation } from 'react-i18next';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { DynamicParams } from '@/models/domain/cad';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { selectSeries } from '@/store/modules/pages/productDetail';
import { get } from '@/utils/get';

export const useCadDownloadDataWeb2Cad = () => {
	const { userCode } = useSelector(selectAuth);
	const { brandCode, seriesCode } = useSelector(selectSeries);
	const [t] = useTranslation();

	const handleDownloadCad = (
		cadDynamic: DynamicParams[] | null,
		partNumber: string,
		completeFlag?: Flag
	) => {
		if (!cadDynamic?.[0]) {
			return;
		}

		if (completeFlag == undefined) {
			completeFlag = Flag.FALSE;
		}

		get({
			url: cadDynamic[0]?.urlInfo.web2cadUrl,
			query: {
				vonaid: userCode ?? '',
				...cadDynamic[0]?.web2cadParam,
			},
			target: '_blank',
		});

		aa.events.sendDownloadWeb2Cad();
		ga.events.downloadCad.web2Cad();
		ectLogger.cad.generate({ tabName: '13', brandCode, seriesCode });
		ectLogger.cad.web2CadDownload(
			{
				dynamicCadModifiedCommon: cadDynamic[0].COMMON,
				cadFilename: '',
				cadType: '',
				cadFormat: '',
				cadSection: 'WEB2CAD',
				partNumber,
			},
			t,
			completeFlag
		);
	};

	return { onDownloadCad: handleDownloadCad };
};
