import { VFC, useEffect } from 'react';
import styles from './CadenasFormatSelect.module.scss';
import { DownloadCadResponse } from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedOption } from '@/models/domain/cad';
import { Select } from '@/components/pc/ui/controls/select';
import { useCadenasFormatSelect } from './CadenasFormatSelect.hooks';
import { CadDownloadProgressArea } from '../CadDownloadProgressArea';
import { useTranslation } from 'react-i18next';

type Props = {
	cadData: DownloadCadResponse;
	onChange: (selectedOption: SelectedOption, isFixed: boolean) => void;
};

export const CadenasFormatSelect: VFC<Props> = ({ cadData, onChange }) => {
	const {
		cadOption,
		groups,
		otherGroups,
		selectedCadOption,
		selectedOtherCadOption,
		selectedVersionOption,
		otherCadOptions,
		versionOption,
		isFixedCadOption,
		handleSelectCadOption,
		handleSelectOtherCadOption,
		handleSelectVersionOption,
	} = useCadenasFormatSelect(cadData);

	const [t] = useTranslation();

	useEffect(() => {
		if (!selectedCadOption) {
			return;
		}
		onChange(
			{
				format: selectedCadOption,
				otherFormat: selectedOtherCadOption,
				version: selectedVersionOption,
			},
			isFixedCadOption()
		);
	}, [
		onChange,
		selectedCadOption,
		selectedOtherCadOption,
		selectedVersionOption,
	]);

	return (
		<>
			<div className={styles.cadLine}></div>

			<table className={styles.selectFileType}>
				<tbody>
					<tr>
						<th>
							{t(
								'components.domain.cadDownload.cadDownloadFormatSelect.fileType'
							)}
						</th>
						<td>
							<Select
								needChoiceBlank={true}
								value={selectedCadOption?.value}
								groupOrder={groups}
								onChange={handleSelectCadOption}
								items={cadOption}
							/>
						</td>
					</tr>
					{selectedCadOption?.value === 'others' && otherCadOptions.length > 0 && (
						<tr>
							<th>
								{t(
									'components.domain.cadDownload.cadDownloadFormatSelect.otherType'
								)}
							</th>

							<td>
								<Select
									needChoiceBlank={true}
									value={selectedOtherCadOption?.value}
									groupOrder={otherGroups}
									items={otherCadOptions}
									onChange={handleSelectOtherCadOption}
								/>
							</td>
						</tr>
					)}
					{versionOption && versionOption.length > 0 && (
						<tr>
							<th>
								{t(
									'components.domain.cadDownload.cadDownloadFormatSelect.version'
								)}
							</th>
							<td>
								<Select
									needChoiceBlank={true}
									value={selectedVersionOption?.value}
									items={versionOption}
									onChange={handleSelectVersionOption}
								/>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	);
};
