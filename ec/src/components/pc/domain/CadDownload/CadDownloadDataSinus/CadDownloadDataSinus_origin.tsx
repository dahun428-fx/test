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

type Props = {
	cadData: DownloadCadResponse;
	completeFlag?: Flag;
	cadDynamic: DynamicParams[] | null;
	brandCode: string;
	seriesCode: string;
};

/** CAD Download Data Sinus */
export const CadDownloadDataSinus: FC<Props> = ({
	cadData,
	completeFlag,
	cadDynamic,
	brandCode,
	seriesCode,
}) => {
	const [t] = useTranslation();

	const {
		groups,
		cadOptions,
		hasCadDownloadPermission,
		isDisableGenerate,
		selected,
		errors,
		onSelectOption,
		generateCadItem,
	} = useCadDownloadDataSinus(cadData, brandCode, seriesCode);

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
			<h3 className={styles.title}>
				{t('components.domain.cadDownload.cadDownloadDataSinus.title')}
			</h3>
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
				<div className={styles.table}>
					<div className={styles.tableRow}>
						<div className={classNames([styles.tableCell, styles.label])}>
							{t(
								'components.domain.cadDownload.cadDownloadDataSinus.fileFormat'
							)}
						</div>
						<div
							className={classNames([styles.tableCell, styles.selectWrapper])}
						>
							<Select
								onChange={onSelectOption}
								groupOrder={groups}
								items={cadOptions}
								value={selected.format}
								className={styles.select}
							/>
						</div>
						<div className={styles.buttonWrapper}>
							<Button
								disabled={isDisableGenerate}
								theme="strong"
								onClick={() =>
									generateCadItem({
										parameterMap,
										dynamicCadModified: cadDynamic,
									})
								}
							>
								{t(
									'components.domain.cadDownload.cadDownloadDataSinus.generateData'
								)}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
CadDownloadDataSinus.displayName = 'CadDownloadDataSinus';
