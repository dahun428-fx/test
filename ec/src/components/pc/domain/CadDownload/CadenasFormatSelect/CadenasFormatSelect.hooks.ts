import { Option } from '@/components/pc/ui/controls/select';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	DownloadCadResponse,
	Format,
} from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
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
import { selected } from '@/utils/domain/spec';
import { useCallback, useMemo, useState } from 'react';

export const useCadenasFormatSelect = (
	cadData: DownloadCadResponse,
	isDetailsDownload?: boolean
) => {
	const [selectedCadOption, setSelectedCadOption] = useState<Option>();
	const [selectedOtherCadOption, setSelectedOtherCadOption] =
		useState<Option | null>(null);
	const [selectedVersionOption, setSelectedVersionOption] =
		useState<Option | null>(null);

	const cadOption = useMemo(() => {
		const data: Option[] = getFormatOptionsFromFileTypes(cadData.fileTypeList);
		if (cadData.otherFileTypeList.length > 0) {
			return data.concat({
				label: '기타',
				value: 'others',
				group: '기타',
			});
		}
		return data;
	}, [cadData.fileTypeList]);

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
		if (cadData.otherFileTypeList.length > 0) {
			return [...cadData.fileTypeList.map(list => list.type), '기타'];
		}
		return cadData.fileTypeList.map(list => list.type);
	}, [cadData.fileTypeList]);

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
			setSelectedOtherCadOption(null);
			setSelectedVersionOption(null);
		},
		[setSelectedCadOption]
	);

	const handleSelectOtherCadOption = useCallback(
		(option: Option) => {
			setSelectedOtherCadOption(option);
			setSelectedVersionOption(null);
		},
		[setSelectedOtherCadOption]
	);

	const handleSelectVersionOption = useCallback(
		(option: Option) => {
			setSelectedVersionOption(option);
		},
		[setSelectedVersionOption]
	);

	const isFixedCadOption = () => {
		if (!selectedCadOption || !selectedCadOption.value) {
			return false;
		}

		if (selectedCadOption.value === 'others') {
			if (selectedOtherCadOption && selectedOtherCadOption.value) {
				if (versionOption && versionOption.length > 0) {
					if (selectedVersionOption && selectedVersionOption.value) {
						return true;
					}
				}
				if (versionOption && versionOption.length < 1) {
					return true;
				}
			}
		} else {
			if (versionOption && versionOption.length > 0) {
				if (selectedVersionOption && selectedVersionOption.value) {
					return true;
				}
			}
			if (versionOption && versionOption.length < 1) {
				return true;
			}
		}

		return false;
	};

	////details download function
	const handleSelectCadOptionForDetailsDownload = useCallback(
		(option: Option) => {
			setSelectedCadOption(option);
			if (option.value !== 'others') {
				setSelectedOtherCadOption(null);

				const currentSelectedVersionFormat =
					formatListByValueOrFormat[option.value]?.versionList?.[0];

				if (
					!currentSelectedVersionFormat ||
					!currentSelectedVersionFormat.format ||
					!currentSelectedVersionFormat.label
				) {
					setSelectedVersionOption(null);
					return;
				}

				setSelectedVersionOption({
					label: currentSelectedVersionFormat.label,
					value: currentSelectedVersionFormat.format,
				});
				return;
			}

			if (!otherCadOptions[0]) {
				setSelectedOtherCadOption(null);
				setSelectedVersionOption(null);
				return;
			}

			setSelectedOtherCadOption(otherCadOptions[0]);

			const currentSelectedVersionFormat =
				formatListByValueOrFormatOther[otherCadOptions[0].value]
					?.versionList?.[0];

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
			formatListByValueOrFormat,
			formatListByValueOrFormatOther,
			otherCadOptions,
			setSelectedCadOption,
			setSelectedOtherCadOption,
			setSelectedVersionOption,
		]
	);

	const handleSelectOtherCadOptionForDetailsDownload = useCallback(
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

	useOnMounted(() => {
		if (isDetailsDownload) {
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
		}
	});

	return {
		cadOption,
		groups,
		otherGroups,
		selectedCadOption,
		selectedOtherCadOption,
		selectedVersionOption,
		otherCadOptions,
		versionOption,
		isFixedCadOption,
		handleSelectCadOption: isDetailsDownload
			? handleSelectCadOptionForDetailsDownload
			: handleSelectCadOption,
		handleSelectOtherCadOption: isDetailsDownload
			? handleSelectOtherCadOptionForDetailsDownload
			: handleSelectOtherCadOption,
		handleSelectVersionOption,
	};
};
