import React, { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadDownloadDataCadenas } from './CadDownloadDataCadenas.hooks';
import styles from './CadDownloadDataCadenas.module.scss';
import { CadDownloadError } from '@/components/pc/domain/CadDownload/CadDownloadError';
import { CadenasFormatSelect } from '@/components/pc/domain/CadDownload/CadenasFormatSelect';
import { Button } from '@/components/pc/ui/buttons';
import { NagiLink } from '@/components/pc/ui/links';
import { BlockLoader } from '@/components/pc/ui/loaders';
import { Flag } from '@/models/api/Flag';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { DynamicParams } from '@/models/domain/cad';
import { getIEVersion } from '@/utils/device';
import { url } from '@/utils/url';

type Props = {
	cadData: DownloadCadResponse;
	dynamicCadParams: DynamicParams[] | null;
	partNumber: string;
	completeFlag?: Flag;
	brandCode: string;
	seriesCode: string;
	onResolving: (value: boolean) => void;
};

/** Cad Download Data Cadenas */
export const CadDownloadDataCadenas: VFC<Props> = ({
	cadData,
	partNumber,
	dynamicCadParams,
	completeFlag,
	brandCode,
	seriesCode,
	onResolving,
}) => {
	const [t] = useTranslation();
	const {
		hasCADPermission,
		errorState,
		isDisableGenerate,
		loadingResolve,
		generateRef,
		resolveRef,
		resolveIFrameName,
		generateIFrameName,
		handleChangeFormat,
		handleGenerateData,
		handleLoadGenerate,
		handleLoadResolve,
	} = useCadDownloadDataCadenas({
		cadData,
		brandCode,
		seriesCode,
		partNumber,
		dynamicCadParams,
		completeFlag,
		onResolving,
	});

	const getContent = () => {
		if (Number(getIEVersion()) < 11 && dynamicCadParams?.[0]) {
			return <CadDownloadError errorType="no-support-browser-error" />;
		}

		if (Flag.isFalse(completeFlag)) {
			return <CadDownloadError errorType="part-number-incomplete-error" />;
		}

		return (
			<>
				{!dynamicCadParams?.length ||
				errorState === 'unavailable-part-number-error' ? (
					<p className={styles.alertStrong}>
						{t(
							'components.domain.cadDownload.cadDownloadError.notAvailable.message'
						)}
					</p>
				) : (
					<CadenasFormatSelect
						cadData={cadData}
						onChange={handleChangeFormat}
						action={
							<div className={styles.buttonWrapper}>
								<Button
									theme="strong"
									onClick={handleGenerateData}
									disabled={isDisableGenerate}
								>
									{t(
										'components.domain.cadDownload.cadDownloadDataCadenas.generateData'
									)}
								</Button>
							</div>
						}
					/>
				)}
			</>
		);
	};

	if (Number(getIEVersion()) < 11 && !dynamicCadParams?.[0]) {
		return (
			<>
				<h3 className={styles.title}>
					{t(
						'components.domain.cadDownload.cadDownloadDataCadenas.downloadCad'
					)}
				</h3>
				<ul className={styles.alert}>
					<li>
						{t(
							'components.domain.cadDownload.cadDownloadDataCadenas.noCadData'
						)}
					</li>
				</ul>
			</>
		);
	}

	if (!hasCADPermission) {
		return (
			<p className={styles.alert}>
				{t('components.domain.cadDownload.cadDataIsNotAvailable')}
			</p>
		);
	}

	return (
		<>
			{loadingResolve ? (
				<div className={styles.loader}>
					<BlockLoader />
				</div>
			) : (
				<div>
					<h3 className={styles.title}>
						{t('components.domain.cadDownload.cadDownloadDataCadenas.title')}
						<NagiLink
							className={styles.buttonHelpIcon}
							href={url.cadGuide}
							target="_blank"
						>
							<span className={styles.helpIcon} />
						</NagiLink>
					</h3>
					{getContent()}
				</div>
			)}
			<iframe
				ref={generateRef}
				name={generateIFrameName}
				className={styles.resolve}
				onLoad={handleLoadGenerate}
				allowFullScreen
			/>
			<iframe
				ref={resolveRef}
				name={resolveIFrameName}
				className={styles.resolve}
				onLoad={handleLoadResolve}
				allowFullScreen
			/>
		</>
	);
};
CadDownloadDataCadenas.displayName = 'CadDownloadDataCadenas';
