import { assertNotNull } from './assertions';
import { pick } from './object';
import { normalizeUrl } from './url';
import { Option } from '@/components/pc/ui/controls/select/Select';
import { config } from '@/config';
import { CadType, CadTypeParam } from '@/models/api/constants/CadType';
import {
	ParameterMap,
	DownloadCadResponse,
	Format,
	Version,
	FileType,
} from '@/models/api/msm/ect/cad/DownloadCadResponse';
import { CadDownloadButtonType } from '@/models/api/msm/ect/series/SearchSeriesResponse';
import {
	DynamicCadModifiedCommon,
	DynamicParams,
	SelectedOption,
} from '@/models/domain/cad';
import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack_origin';
import { find, keyBy } from '@/utils/collection';
import { date } from '@/utils/date';
import { notNull } from '@/utils/predicate';
import { resolve } from 'path';
import { useCallback } from 'react';
import { uuidv4 } from './uuid';

/**
 * Make anchor and append to body for downloading
 * @param url
 * @returns {void}
 */
export const downloadCadLink = (url: string) => {
	// NOTE: Confusing between a tag and iframe ( using in EC V5 )
	//       a tag is working well on IE11 and other browsers.
	const anchor = document.createElement('a');
	anchor.href = url;
	document.body.appendChild(anchor);
	anchor.click();
	setTimeout(() => {
		document.body.removeChild(anchor);
	}, 4000);
};

export const downloadCadIframe = (url: string) => {
	const iframe = document.createElement('iframe');
	const id = uuidv4();
	iframe.id = id;
	iframe.src = url;
	iframe.width = '0';
	iframe.height = '0';
	document.body.appendChild(iframe);
	setTimeout(() => {
		const targetElement = document.getElementById(id);
		targetElement && document.body.removeChild(targetElement);
	}, 5000);
};

/** Configure download URL */
export function getDownloadFileName(url: string, fileName: string | undefined) {
	assertNotNull(fileName);
	return `/vcommon/detail/php/cad_download_name.php?url=${encodeURIComponent(
		url
	)}&name=${encodeURIComponent(fileName)}`;
}

export function isCadDownloadButtonType(
	type: string
): type is CadDownloadButtonType {
	if (type !== '1' && type !== '2' && type !== '3') {
		return false;
	}
	return true;
}

/** Get CAD label */
export function getLabel(option: SelectedCadDataFormat): string {
	return [option.formatText, option.formatOthersText, option.versionText]
		.filter(item => item !== 'others')
		.filter(notNull)
		.join(' ');
}

/** Get CAD file name */
export function getFileName(
	partNumber: string,
	option: SelectedCadDataFormat
): string {
	const payload = [
		partNumber,
		option.formatText,
		option.formatOthersText,
		option.versionText,
		date(new Date().toISOString(), 'YYYYMMDD'),
	];

	return payload
		.filter(item => item !== 'others')
		.filter(notNull)
		.map(
			item =>
				item
					.replace(' ', '_') // replace space
					.replace(/[^0-9a-zA-Z\-_,\.\+\(\)=]/g, '') // only alphanumeric
		)
		.join('_');
}

/**
 * Lower case URI
 */
function lowercasedEncodeURIComponent(url: string) {
	return (url + '').match(/\/apps-static\//)
		? encodeURIComponent(url)
		: encodeURIComponent(url).replace(/(%[A-Z0-9]{2})/g, value =>
				value.toLowerCase()
		  );
}

/**
 * Get page URL
 */
function getPageUrl(
	partNumber: string,
	seriesCode: string,
	hasHissuCode?: boolean
) {
	const query = partNumber
		? 'ProductCode=' +
		  lowercasedEncodeURIComponent(partNumber) +
		  (hasHissuCode
				? '&HissuCode=' + lowercasedEncodeURIComponent(partNumber)
				: '')
		: '';

	return normalizeUrl(
		`${config.web.ec.origin}/vona2/detail/${seriesCode}/?${query}`
	);
}

/**
 * Get default param
 */
const getDefaultParam = ({
	partNumber,
	userCode,
	moldExpressType,
	brandCode,
	brandName,
	seriesCode,
	seriesName,
	seriesImage,
}: {
	partNumber: string;
	userCode: string;
	moldExpressType?: string;
	brandCode: string;
	brandName: string;
	seriesCode: string;
	seriesName: string;
	seriesImage?: string;
}): DynamicCadModifiedCommon => {
	const catalogServerURL = location.href.match(/^https?:\/\/[^\/]+/)?.[0] ?? '';

	return {
		pn: partNumber || '',
		ec_loc: '',
		gc_wos: '',
		ge_location: '',
		ge_sdm: '',
		language: '',
		location: '',
		prj: '',
		url: catalogServerURL + '/vcommon/detail/html/blank.html',
		loggedin: '',
		ms_list: '',
		alterations: '',
		test: '',
		vg: '',
		viewType: '',
		select: '',
		MAIN_PHOTO: seriesImage ?? '',
		DOMAIN: catalogServerURL,
		PAGE_PATH: getPageUrl(partNumber, seriesCode),
		BRD_CODE: brandCode,
		BRD_NAME: brandName,
		SERIES_CODE: seriesCode,
		SERIES_NAME: seriesName,
		customer_cd: userCode,
		userCode: userCode,
		PRODUCT_ID: '',
		EST_FLAG: '',
		PRODUCT_TYPE: moldExpressType ?? '',
		cgiaction: '',
		downloadflags: '',
		dxfsettings: '',
		format: '',
		part: '',
		firm: 'misumi',
		ok_url:
			catalogServerURL +
			'/vcommon/detail/html/blank.html?xmlfile=<%download_xml%>',
		Maker: '',
		From: '',
		LogID: '',
		info: '',
		vonaid: '',
		resolveUrl: '',
		assResolveURL: '',
		psConfVonaUrl: '',
		web2cadUrl: '',
		mexUrl: '',
		cgi2dviewUrl: '',
		cadName: '',
		cadGenerationTime: '',
		partcommunityUrl: '',
		partserverUrl: '',
		CombinationView: '',
		cadenasResolveUrl: '',
		cadenasPsConfVonaUrl: '',
		cadenasCgi2PviewUrl: '',
		cadenasAssistantResolveUrl: '',
		web2cadParam: {},
		viewerOptions: '',
	};
};

/**
 * Create config param
 */
function createConfigParam(urlData: string) {
	const url = new URL(urlData);
	return Object.fromEntries(url.searchParams.entries());
}

/**
 * Create param
 */
export const createParam = ({
	parameterMap,
	partNumber,
	userCode,
	moldExpressType,
	brandCode,
	brandName,
	seriesCode,
	seriesName,
	seriesImage,
}: {
	parameterMap: ParameterMap;
	partNumber: string;
	userCode: string;
	moldExpressType?: string;
	brandCode: string;
	brandName: string;
	seriesCode: string;
	seriesName: string;
	seriesImage?: string;
}): DynamicParams => {
	const params: DynamicCadModifiedCommon = {
		...getDefaultParam({
			partNumber,
			userCode,
			moldExpressType,
			brandCode,
			brandName,
			seriesCode,
			seriesName,
			seriesImage,
		}),
		...parameterMap,
		resolveUrl: parameterMap.cadenasResolveUrl,
		assResolveURL: parameterMap.cadenasAssistantResolveUrl,
		psConfVonaUrl: parameterMap.cadenasPsConfVonaUrl,
		web2cadUrl: (parameterMap.web2cadUrl || '').split('?')[0],
		cgi2dviewUrl: parameterMap.cadenasCgi2PviewUrl,
		ploggerUrl: parameterMap.cadenasPloggerUrl ?? '',
		web2cadParam: parameterMap.web2cadUrl
			? createConfigParam(parameterMap.web2cadUrl)
			: {},
		CombinationView: parameterMap.CombinationView
			? parameterMap.CombinationView
			: '',
	};

	if (params.MAIN_PHOTO) {
		params.MAIN_PHOTO = params.MAIN_PHOTO.replace(
			/(\?.*?)\$[^\$]+\$(&?)/,
			'$1'
		).replace(/[\?&]+$/, '');
	}

	return {
		resolveParam: pick(
			params,
			'ec_loc',
			'gc_wos',
			'ge_sdm',
			'language',
			'location',
			'ge_location',
			'pn',
			'prj',
			'url'
		),
		ploggerParam: pick(params, 'language', 'firm', 'part', 'viewerOptions'),
		psConfVonaParam: pick(
			params,
			'ec_loc',
			'gc_wos',
			'ge_sdm',
			'language',
			'location',
			'pn',
			'prj',
			'PRODUCT_ID',
			'loggedin',
			'ms_list',
			'alterations',
			'customer_cd',
			'test',
			'vg',
			'viewType',
			'select',
			'MAIN_PHOTO',
			'PAGE_PATH',
			'BRD_CODE',
			'BRD_NAME',
			'SERIES_CODE',
			'SERIES_NAME',
			'EST_FLAG'
		),
		cgi2dviewParam: {
			...pick(
				params,
				'cgiaction',
				'downloadflags',
				'firm',
				'language',
				'format',
				'part',
				'ok_url',
				'dxfsettings'
			),
			CombinationView: params.CombinationView,
		},
		web2cadParam: params.web2cadParam,
		mexParam: pick(
			{
				...params,
				PAGE_PATH: getPageUrl(partNumber, seriesCode, false),
			},
			'PRODUCT_ID',
			'customer_cd',
			'pn',
			'MAIN_PHOTO',
			'PAGE_PATH',
			'BRD_CODE',
			'BRD_NAME',
			'SERIES_CODE',
			'SERIES_NAME',
			'PRODUCT_TYPE',
			'DOMAIN',
			'userCode',
			'language'
		),
		urlInfo: pick(
			params,
			'ploggerUrl',
			'resolveUrl',
			'assResolveURL',
			'psConfVonaUrl',
			'web2cadUrl',
			'mexUrl',
			'cgi2dviewUrl'
		),
		otherInfo: pick(
			params,
			'cadName',
			'cadGenerationTime',
			'partcommunityUrl',
			'partserverUrl'
		),
		COMMON: params,
	};
};

/** Get default option for CAD download Format select */
export const getDefaultFormat = (
	cadData: DownloadCadResponse,
	lastSelected?: SelectedCadDataFormat
): Option => {
	if (lastSelected?.format === 'others' || !cadData.fileTypeList[0]) {
		return {
			label: 'Other',
			value: 'others',
		};
	}

	if (!lastSelected) {
		const group2D = cadData.fileTypeList.find(item => item.type === '2D');
		if (group2D) {
			// 修正前と同じ状態だが、assert して本当に大丈夫？まずは noUncheckedIndexedAccess 有効化を優先し深掘りしていないので注意。
			assertNotNull(group2D.formatList[0]);
			return getOption(group2D.formatList[0]);
		} else {
			// 修正前と同じ状態だが、assert して本当に大丈夫？まずは noUncheckedIndexedAccess 有効化を優先し深掘りしていないので注意。
			assertNotNull(cadData.fileTypeList[0].formatList[0]);
			return getOption(cadData.fileTypeList[0].formatList[0]);
		}
	}

	const fileTypeByGroup =
		cadData.fileTypeList.find(
			fileType => fileType.type === (lastSelected.grp ?? '2D')
		) ?? null;

	if (!fileTypeByGroup || !fileTypeByGroup.formatList[0]) {
		// 修正前と同じ状態だが、assert して本当に大丈夫？まずは noUncheckedIndexedAccess 有効化を優先し深掘りしていないので注意。
		assertNotNull(cadData.fileTypeList[0].formatList[0]);
		return getOption(cadData.fileTypeList[0].formatList[0]);
	}

	for (const format of fileTypeByGroup.formatList) {
		if (
			format.label === lastSelected.format ||
			format.format === lastSelected.format
		) {
			return getOption(format);
		}
	}

	return getOption(fileTypeByGroup.formatList[0]);
};

/** Get option from format */
const getOption = (format: Format): Option => {
	return {
		label: format.label,
		value: format.format ?? format.label,
	};
};

/** Get default option for CAD download Other Format select */
export const getDefaultOtherFormat = (
	cadData: DownloadCadResponse,
	lastSelected?: SelectedCadDataFormat
): Option | null => {
	if (!cadData.otherFileTypeList[0]) {
		return null;
	}

	const isFormatOtherNotSelected =
		!lastSelected || lastSelected.formatOthers === 'none';

	if (!cadData.fileTypeList.length && isFormatOtherNotSelected) {
		const firstFormat = cadData.otherFileTypeList[0].formatList[0];
		// 修正前と同じ状態だが、assert して本当に大丈夫？まずは noUncheckedIndexedAccess 有効化を優先し深掘りしていないので注意。
		assertNotNull(firstFormat);
		return getOption(firstFormat);
	}

	if (cadData.fileTypeList.length && isFormatOtherNotSelected) {
		return null;
	}

	if (!isFormatOtherNotSelected) {
		const group = find(
			cadData.otherFileTypeList,
			'type',
			lastSelected.grp ?? '2D'
		);
		const searchValue = lastSelected.formatOthers;
		const formatList = group?.formatList || [];
		const foundFormat =
			find(formatList, 'label', searchValue) ||
			find(formatList, 'format', searchValue);
		if (foundFormat) {
			return getOption(foundFormat);
		}

		if (formatList[0]) {
			return getOption(formatList[0]);
		}
	}

	return null;
};

/** Get default option for CAD download Version select */
export const getDefaultVersion = (
	cadData: DownloadCadResponse,
	lastSelected?: SelectedCadDataFormat
): Option | null => {
	const defaultFormat = getDefaultFormat(cadData, lastSelected);
	const defaultOtherFormat = getDefaultOtherFormat(cadData, lastSelected);
	let versionList: Version[] = [];

	if (defaultFormat && defaultFormat.value !== 'others') {
		const formatList = cadData.fileTypeList
			.map(group => group.formatList)
			.flat();
		versionList =
			formatList.find(
				format => defaultFormat.value === (format.label ?? format.format)
			)?.versionList ?? [];
	}

	if (defaultOtherFormat !== null) {
		const formatList = cadData.otherFileTypeList
			.map(group => group.formatList)
			.flat();
		versionList =
			formatList.find(
				format => defaultOtherFormat.value === format.label ?? format.format
			)?.versionList ?? [];
	}

	if (!versionList[0]) {
		return null;
	}

	if (!lastSelected || !lastSelected.version) {
		return getOption(versionList[0]);
	}

	const version = versionList.find(
		version => lastSelected.version === (version.format ?? version.label)
	);

	if (!version) {
		return getOption(versionList[0]);
	}

	return getOption(version);
};

/** Get selected CAD data format from Dropdown list */
export const getCadFormat = (selected: SelectedCadDataFormat): string => {
	return (
		(selected.version && selected.version != 'none'
			? selected.version
			: selected.format && selected.format !== 'others'
			? selected.format
			: selected.formatOthers) ?? ''
	);
};

/** Get format options from file type */
export const getFormatOptionsFromFileTypes = (fileTypes: FileType[]) => {
	const data: Option[] = [];

	fileTypes.forEach(item => {
		item.formatList.forEach(format => {
			data.push({
				label: format.label,
				group: item.type,
				value: format.format ?? format.label,
			});
		});
	});

	return data;
};

/** Get selected cad data format */
export const getSelectedCadDataFormat = (
	selectedCadOption: Option | null
): SelectedCadDataFormat => {
	if (!selectedCadOption) {
		return {};
	}

	return {
		grp: selectedCadOption.group,
		// NOTE: in PHP code, formatText can be `false`. To maintain type compatibility, decided to use undefined
		formatText: selectedCadOption.label,
		format: selectedCadOption.value,
	};
};

/** Get selected cad option */
export const getSelectedCadOption = (
	selectedOption: SelectedOption | undefined,
	versionOptions: Option[] | null
): SelectedCadDataFormat => {
	if (!selectedOption) {
		return {};
	}

	const isOthers = selectedOption.format.value === 'others';

	if (isOthers && !selectedOption.otherFormat) {
		return {};
	}

	return {
		grp: !isOthers
			? selectedOption.format.group
			: selectedOption.otherFormat?.group,
		// NOTE: in PHP code, formatText can be `false`. To maintain type compatibility, decided to use undefined
		formatText: !isOthers ? selectedOption.format.label : undefined,
		format: isOthers ? 'others' : selectedOption.format.value,
		// NOTE: in PHP code, formatOthersText can be `false`. To maintain type compatibility, decided to use undefined
		formatOthersText: isOthers ? selectedOption.otherFormat?.label : undefined,
		formatOthers: !isOthers ? 'none' : selectedOption.otherFormat?.value,
		version: selectedOption.version?.value ?? versionOptions?.[0]?.value,
		versionText: selectedOption.version?.label ?? versionOptions?.[0]?.label,
	};
};

/** Get format list by value or format */
export const getFormatListByValueOrFormat = (
	fileTypeList: FileType[]
): Record<string, Format> => {
	const formatList: Format[] = [];

	fileTypeList.forEach(item => {
		item.formatList.forEach(format => {
			formatList.push(format);
		});
	});
	return keyBy(formatList, format => format.format ?? format.label);
};

/** Get version options */
export const getVersionOptions = (
	selectedCadOption: Option | undefined,
	formatListByValueOrFormat: Record<string, Format>
): Option[] | null => {
	if (
		!selectedCadOption ||
		!formatListByValueOrFormat[selectedCadOption.value]
	) {
		return null;
	}

	return (
		formatListByValueOrFormat[selectedCadOption.value]?.versionList?.map(
			version => ({
				label: version.label,
				value: version.format ?? version.label,
			})
		) ?? null
	);
};

export function convertTypeToParam(cadType: CadType) {
	switch (cadType) {
		case CadType['2D']:
			return '10';
		case CadType['3D']:
			return '01';
	}
}

/** Get valid cad type */
export function getValidCadType(cadType?: string) {
	const validCadType =
		cadType &&
		[CadTypeParam['2D'], CadTypeParam['3D'], CadTypeParam['2D_3D']].includes(
			cadType
		);

	if (!cadType || !validCadType) {
		return;
	}

	return cadType;
}
