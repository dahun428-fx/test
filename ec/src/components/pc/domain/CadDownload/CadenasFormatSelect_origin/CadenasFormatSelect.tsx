import classNames from 'classnames';
import React, { useEffect, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadenasFormatSelect } from './CadenasFormatSelect.hooks';
import styles from './CadenasFormatSelect.module.scss';
import { Select } from '@/components/pc/ui/controls/select/Select';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedOption } from '@/models/domain/cad';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';

type Props = {
	cadData: DownloadCadResponse;
	onChange: (selectedOption: SelectedOption) => void;
};

/** Cadenas format select component */
export const CadenasFormatSelect: VFC<Props> = ({ cadData, onChange }) => {
	const [t] = useTranslation();

	const {
		selectedCadOption,
		selectedOtherCadOption,
		selectedVersionOption,
		groups,
		otherGroups,
		cadOptions,
		otherCadOptions,
		versionOption,
		handleSelectCadOption,
		handleSelectOtherCadOption,
		handleSelectVersionOption,
	} = useCadenasFormatSelect(cadData);

	const handleOpenWindow = (event: React.MouseEvent) => {
		event.preventDefault();
		openSubWindow(url.cadFormatGuide, '_blank', { width: 990, height: 800 });
	};

	useEffect(() => {
		if (!selectedCadOption) {
			return;
		}

		onChange({
			format: selectedCadOption,
			otherFormat: selectedOtherCadOption,
			version: selectedVersionOption,
		});
	}, [
		onChange,
		selectedCadOption,
		selectedOtherCadOption,
		selectedVersionOption,
	]);

	return (
		<>
			<div className={styles.table}>
				<div className={styles.tableRow}>
					<div className={classNames([styles.tableCell, styles.label])}>
						{/* {t('components.domain.cadDownload.cadenasFormatSelect.fileFormat')} */}
						파일형식
					</div>
					<div className={classNames([styles.tableCell, styles.selectWrapper])}>
						<Select
							value={selectedCadOption?.value}
							onChange={handleSelectCadOption}
							groupOrder={groups}
							items={cadOptions}
							className={styles.select}
						/>
					</div>
				</div>
				{selectedCadOption?.value === 'others' && otherCadOptions.length > 0 && (
					<div className={styles.tableRow}>
						<div className={classNames([styles.tableCell, styles.label])}>
							{t(
								'components.domain.cadDownload.cadenasFormatSelect.otherFormat'
							)}
						</div>
						<div
							className={classNames([styles.tableCell, styles.selectWrapper])}
						>
							<Select
								value={selectedOtherCadOption?.value}
								onChange={handleSelectOtherCadOption}
								groupOrder={otherGroups}
								items={otherCadOptions}
								className={styles.select}
							/>
						</div>
					</div>
				)}
				{versionOption && versionOption.length > 0 && (
					<div className={styles.tableRow}>
						<div className={classNames([styles.tableCell, styles.label])}>
							{/* {t('components.domain.cadDownload.cadenasFormatSelect.version')} */}
							버전
						</div>
						<div
							className={classNames([styles.tableCell, styles.selectWrapper])}
						>
							<Select
								value={selectedVersionOption?.value}
								items={versionOption}
								onChange={handleSelectVersionOption}
								className={styles.select}
							/>
						</div>
					</div>
				)}
			</div>
			<div className={styles.linkWrapper}>
				<a className={styles.seeAllLink} onClick={handleOpenWindow}>
					{t('components.domain.cadDownload.cadenasFormatSelect.seeAllFormat')}
				</a>
			</div>
		</>
	);
};
CadenasFormatSelect.displayName = 'CadenasFormatSelect';
