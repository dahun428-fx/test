import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	DownloadCadResponse,
	Format,
} from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack_origin';
import {
	getDefaultFormat,
	getDefaultOtherFormat,
	getDefaultVersion,
	getFormatListByValueOrFormat,
	getFormatOptionsFromFileTypes,
	getVersionOptions,
} from '@/utils/cad';
import { keyBy } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';

/** Cadenas format select hook */
export const useCadenasFormatSelect = (cadData: DownloadCadResponse) => {
	const [t] = useTranslation();
	const [selectedCadOption, setSelectedCadOption] = useState<Option>();
	const [selectedOtherCadOption, setSelectedOtherCadOption] =
		useState<Option | null>(null);
	const [selectedVersionOption, setSelectedVersionOption] =
		useState<Option | null>(null);

	const cadOptions = useMemo(() => {
		const data: Option[] = getFormatOptionsFromFileTypes(cadData.fileTypeList);
		return data.concat({
			label: t('components.domain.cadDownload.cadenasFormatSelect.other'),
			value: 'others',
			group: t('components.domain.cadDownload.cadenasFormatSelect.other'),
		});
	}, [cadData.fileTypeList, t]);

	const otherCadOptions = useMemo(() => {
		return getFormatOptionsFromFileTypes(cadData.otherFileTypeList);
	}, [cadData.otherFileTypeList]);

	const formatListByValueOrFormat = getFormatListByValueOrFormat(
		cadData.fileTypeList
	);

	const formatListByValueOrFormatOther = useMemo(() => {
		const formatList: Format[] = [];

		cadData.otherFileTypeList.forEach(item => {
			item.formatList.forEach(format => {
				formatList.push(format);
			});
		});

		return keyBy(formatList, format => format.format ?? format.label);
	}, [cadData]);

	const groups = useMemo(() => {
		return [
			...cadData.fileTypeList.map(list => list.type),
			t('components.domain.cadDownload.cadenasFormatSelect.other'),
		];
	}, [cadData.fileTypeList, t]);

	const otherGroups = useMemo(() => {
		return cadData.otherFileTypeList.map(list => list.type);
	}, [cadData.otherFileTypeList]);

	const versionOptions = getVersionOptions(
		selectedCadOption,
		formatListByValueOrFormat
	);

	const versionOptionsOther = useMemo(() => {
		if (
			!selectedOtherCadOption ||
			!formatListByValueOrFormatOther[selectedOtherCadOption.value]
		) {
			return null;
		}

		return (
			formatListByValueOrFormatOther[
				selectedOtherCadOption.value
			]?.versionList?.map(version => ({
				label: version.label,
				value: version.format ?? version.label,
			})) ?? null
		);
	}, [formatListByValueOrFormatOther, selectedOtherCadOption]);

	const versionOption = useMemo(() => {
		if (selectedCadOption?.value === 'others') {
			return versionOptionsOther;
		}

		return versionOptions;
	}, [selectedCadOption, versionOptions, versionOptionsOther]);

	const handleSelectCadOption = useCallback(
		(option: Option) => {
			setSelectedCadOption(option);
		},
		[setSelectedCadOption]
	);

	const handleSelectOtherCadOption = useCallback(
		(option: Option) => {
			setSelectedOtherCadOption(option);

			const currentSelectedVersionFormat =
				formatListByValueOrFormatOther[option.value]?.versionList?.[0];

			if (
				!currentSelectedVersionFormat ||
				!currentSelectedVersionFormat.label ||
				!currentSelectedVersionFormat.format
			) {
				setSelectedVersionOption(null);
				return;
			}

			setSelectedVersionOption({
				label: currentSelectedVersionFormat.label,
				value: currentSelectedVersionFormat.format,
			});
		},
		[
			formatListByValueOrFormatOther,
			setSelectedOtherCadOption,
			setSelectedVersionOption,
		]
	);

	const handleSelectVersionOption = useCallback(
		(option: Option) => {
			setSelectedVersionOption(option);
		},
		[setSelectedVersionOption]
	);

	useOnMounted(() => {
		const cadDataFormatCookie = getCookie(Cookie.CAD_DATA_FORMAT);
		let cadDataFormat: SelectedCadDataFormat | undefined;
		if (cadDataFormatCookie) {
			try {
				cadDataFormat = JSON.parse(decodeURIComponent(cadDataFormatCookie));
			} catch (error) {}
		}

		const format = getDefaultFormat(cadData, cadDataFormat);
		const otherFormat = getDefaultOtherFormat(cadData, cadDataFormat);
		const version = getDefaultVersion(cadData, cadDataFormat);

		setSelectedCadOption(format);
		setSelectedOtherCadOption(otherFormat);
		setSelectedVersionOption(version);
	});

	return {
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
	};
};
