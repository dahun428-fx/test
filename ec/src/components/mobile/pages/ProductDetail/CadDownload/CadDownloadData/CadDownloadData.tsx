import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownloadData } from './CadDownloadData.hooks';
import styles from './CadDownloadData.module.scss';
import { CadDownloadDataCadenas } from '@/components/mobile/pages/ProductDetail/CadDownload/CadDownloadDataCadenas';
import { CadDownloadDataSinus } from '@/components/mobile/pages/ProductDetail/CadDownload/CadDownloadDataSinus';
import { CadDownloadDataWeb2Cad } from '@/components/mobile/pages/ProductDetail/CadDownload/CadDownloadDataWeb2Cad';
import { CadDownloadFixed } from '@/components/mobile/pages/ProductDetail/CadDownload/CadDownloadFixed/CadDownloadFixed';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { Flag } from '@/models/api/Flag';
import { CadSiteType } from '@/models/domain/cad';
import { getIEVersion } from '@/utils/device';

type Props = {
	seriesCode: string;
	completeFlag?: Flag;
	partNumber: string;
	cadId?: string;
	moldExpressType?: string;
	brandCode: string;
	brandName: string;
	seriesName: string;
	seriesImage?: string;
};

/** Cad download data */
export const CadDownloadData: FC<Props> = ({
	seriesCode,
	partNumber,
	cadId,
	completeFlag,
	moldExpressType,
	brandCode,
	brandName,
	seriesName,
	seriesImage,
}) => {
	const [t] = useTranslation();
	const { cadData, cadDynamic, loading } = useCadDownloadData({
		seriesCode,
		moldExpressType,
		partNumber,
		cadId,
		brandCode,
		brandName,
		seriesName,
		seriesImage,
	});
	const [resolving, setResolving] = useState(false);

	useEffect(() => {
		// NOTE: set resolving to true before CadDownloadDataCadenas is mounted
		// to avoid flickering (CadDownloadFixed shows up for a short time and disappears)
		if (cadData?.cadSiteType === CadSiteType.CADENAS) {
			setResolving(true);
		}
	}, [cadData]);

	if (loading) {
		return (
			<div className={styles.loader}>
				<BlockLoader />
			</div>
		);
	}

	const isDynamicCadNotAvailable =
		!cadData ||
		((!cadData.cadSiteType ||
			cadData.cadSiteType === CadSiteType.NONE ||
			cadData.cadSiteType === CadSiteType.MEX) &&
			!cadData.fixed2DCadList.length &&
			!cadData.fixed3DCadList.length);

	const ieVersion = getIEVersion();
	const showsFixedCadData =
		!cadData?.cadSiteType ||
		((cadData.cadSiteType === CadSiteType.CADENAS ||
			cadData.cadSiteType === CadSiteType.WEB2CAD) &&
			(!ieVersion || ieVersion >= 11));

	return (
		<div>
			{isDynamicCadNotAvailable ? (
				<div className={styles.alert}>
					{t('components.domain.cadDownload.cadDataIsNotAvailable')}
				</div>
			) : (
				<>
					{cadData.cadSiteType === CadSiteType.CADENAS && (
						<CadDownloadDataCadenas
							partNumber={partNumber}
							cadData={cadData}
							dynamicCadParams={cadDynamic}
							completeFlag={completeFlag}
							brandCode={brandCode}
							seriesCode={seriesCode}
							onResolving={setResolving}
						/>
					)}
					{cadData.cadSiteType === CadSiteType.WEB2CAD && (
						<CadDownloadDataWeb2Cad
							partNumber={partNumber}
							completeFlag={completeFlag}
							cadDynamic={cadDynamic}
						/>
					)}
					{cadData.cadSiteType === CadSiteType.SINUS && (
						<CadDownloadDataSinus />
					)}
				</>
			)}

			{showsFixedCadData && cadData && !resolving && (
				<CadDownloadFixed
					cadData={cadData}
					cadDynamic={cadDynamic}
					brandCode={brandCode}
					partNumber={partNumber}
				/>
			)}
		</div>
	);
};
CadDownloadData.displayName = 'CadDownloadData';
