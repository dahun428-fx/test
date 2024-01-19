import classNames from 'classnames';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownloadDataSinus } from './CadDownloadDataSinus.hooks';
import styles from './CadDownloadDataSinus.module.scss';
import { CadDownloadError } from '@/components/pc/domain/CadDownload/CadDownloadError';
import { Button } from '@/components/pc/ui/buttons';
import { Select } from '@/components/pc/ui/controls/select';
import { Flag } from '@/models/api/Flag';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DynamicParams } from '@/models/domain/cad';
import { isSinusBrowser } from '@/utils/domain/cad/sinus';
import { CadDownloadHead } from '../CadDownloadHead';
import { CadenasFormatSelect } from '../CadenasFormatSelect';
import { CadDownloadProgressArea } from '../CadDownloadProgressArea';

type Props = {
	cadData: DownloadCadResponse;
	completeFlag?: Flag;
	cadDynamic: DynamicParams[] | null;
	brandCode: string;
	seriesCode: string;
	partNumber: string;
	onClose: () => void;
};

/** CAD Download Data Sinus */
export const CadDownloadDataSinus: FC<Props> = ({
	cadData,
	completeFlag,
	cadDynamic,
	brandCode,
	seriesCode,
	partNumber,
	onClose,
}) => {
	const [t] = useTranslation();

	const {
		hasCadDownloadPermission,
		fixedCadOption,
		errors,
		onSelectOption,
		handleStackPutsthAdd,
		handleDirectDownload,
	} = useCadDownloadDataSinus(cadData, cadDynamic, brandCode, seriesCode);

	const parameterMap = cadData.dynamic3DCadList[0]?.parameterMap;

	if (!hasCadDownloadPermission || !cadDynamic?.length || !parameterMap) {
		return (
			<>
				<h3 className={styles.title}>
					{t('components.domain.cadDownload.cadDownloadDataSinus.title')}
				</h3>
				<p className={styles.errorMessage}>
					<strong>
						{t(
							'components.domain.cadDownload.cadDownloadError.notAvailable.message'
						)}
					</strong>
				</p>
				<ul className={styles.errorGuide}>
					<li>
						{t(
							'components.domain.cadDownload.cadDownloadError.notAvailable.guide'
						)}
					</li>
				</ul>
			</>
		);
	}

	return (
		<div>
			{errors ? (
				<CadDownloadError errorType="not-available-error" />
			) : Flag.isFalse(completeFlag) || !isSinusBrowser() ? (
				<CadDownloadError
					errorType={
						!isSinusBrowser()
							? 'no-support-browser-error'
							: 'part-number-incomplete-error'
					}
				/>
			) : (
				<div>
					<CadDownloadHead
						partNumber={partNumber}
						completeFlag={completeFlag}
					/>
					<div className={styles.cadLine}></div>
					<CadenasFormatSelect cadData={cadData} onChange={onSelectOption} />
					<div className={styles.cadLine}></div>
					<CadDownloadProgressArea
						selectedCad={fixedCadOption}
						onClickDirect={handleDirectDownload}
						onClickPutsth={handleStackPutsthAdd}
						onClose={onClose}
					/>
				</div>
			)}
		</div>
	);
};
CadDownloadDataSinus.displayName = 'CadDownloadDataSinus';
