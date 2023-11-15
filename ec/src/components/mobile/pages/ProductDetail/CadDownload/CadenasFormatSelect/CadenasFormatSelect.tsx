import React, { useEffect, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCadenasFormatSelect } from './CadenasFormatSelect.hooks';
import styles from './CadenasFormatSelect.module.scss';
import { Select } from '@/components/mobile/ui/controls/select/Select';
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
			<dl className={styles.list}>
				<dt className={styles.label}>
					{t(
						'mobile.pages.productDetail.cadDownload.cadenasFormatSelect.fileFormat'
					)}
				</dt>
				<dd>
					<Select
						value={selectedCadOption?.value}
						onChange={handleSelectCadOption}
						groupOrder={groups}
						items={cadOptions}
						className={styles.select}
					/>
				</dd>
				{selectedCadOption?.value === 'others' && otherCadOptions.length > 0 && (
					<>
						<dt className={styles.label}>
							{t(
								'mobile.pages.productDetail.cadDownload.cadenasFormatSelect.otherFormat'
							)}
						</dt>
						<dd>
							<Select
								value={selectedOtherCadOption?.value}
								onChange={handleSelectOtherCadOption}
								groupOrder={otherGroups}
								items={otherCadOptions}
								className={styles.select}
							/>
						</dd>
					</>
				)}
				{versionOption && versionOption.length > 0 && (
					<>
						<dt className={styles.label}>
							{t(
								'mobile.pages.productDetail.cadDownload.cadenasFormatSelect.version'
							)}
						</dt>
						<dd>
							<Select
								value={selectedVersionOption?.value}
								items={versionOption}
								onChange={handleSelectVersionOption}
								className={styles.select}
							/>
						</dd>
					</>
				)}
			</dl>
			<div className={styles.linkWrapper}>
				<a className={styles.seeAllLink} onClick={handleOpenWindow}>
					{t(
						'mobile.pages.productDetail.cadDownload.cadenasFormatSelect.seeAllFormat'
					)}
				</a>
			</div>
		</>
	);
};
CadenasFormatSelect.displayName = 'CadenasFormatSelect';
