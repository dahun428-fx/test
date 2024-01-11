import { Option } from '@/components/pc/ui/controls/select';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	DownloadCadResponse,
	Format,
} from '@/models/api/msm/ect/cad/DownloadCadResponse';
import {
	getFormatListByValueOrFormat,
	getFormatOptionsFromFileTypes,
	getVersionOptions,
} from '@/utils/cad';
import { keyBy } from '@/utils/collection';
import { selected } from '@/utils/domain/spec';
import { useCallback, useMemo, useState } from 'react';

export const useCadenasFormatSelect = (cadData: DownloadCadResponse) => {
	const [selectedCadOption, setSelectedOption] = useState<Option>();
	const [selectedOtherCadOption, setSelectedOtherCadOption] =
		useState<Option | null>(null);
	const [selectedVersionOption, setSelectedVersionOption] =
		useState<Option | null>(null);

	const cadOption = useMemo(() => {
		const data: Option[] = getFormatOptionsFromFileTypes(cadData.fileTypeList);
		return data.concat({
			label: '기타',
			value: 'others',
			group: '기타',
		});
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
		return [...cadData.fileTypeList.map(list => list.type), '기타'];
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
			setSelectedOption(option);
			setSelectedOtherCadOption(null);
			setSelectedVersionOption(null);
		},
		[setSelectedOption]
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
		handleSelectCadOption,
		handleSelectOtherCadOption,
		handleSelectVersionOption,
	};
};
