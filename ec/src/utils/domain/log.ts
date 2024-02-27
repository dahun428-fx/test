/** todo : fix to kor version */
// import { SpecSearchDispType } from '@misumi-org/ect-api-client-sdk';
// import {
// 	ConvertPartNumberLogMessage,
// 	SearchType,
// } from '@misumi-org/ect-api-client-sdk/dist/models/log/message';
import { normalizeUrl } from '@/utils/url';
import { Flag } from '@/models/api/Flag';
import { SearchType } from '@/models/api/msm/ect/log/message';

export type MisumiOrVona = 'misumi' | 'vona';

export function getMisumiOrVona(misumiFlag: Flag): MisumiOrVona {
	return Flag.isTrue(misumiFlag) ? 'misumi' : 'vona';
}

export function getMisumiOrVonaByBrandCode(brandCode?: string): MisumiOrVona {
	return brandCode === 'MSM1' ? 'misumi' : 'vona';
}

export function getDivision(payload: {
	misumiFlag?: Flag;
	departmentCode: string;
}) {
	if (payload.misumiFlag === undefined) {
		return payload.departmentCode;
	}

	return `${Flag.isTrue(payload.misumiFlag) ? 'm' : 'v'}_${
		payload.departmentCode
	}`;
}

// export function getLayout(displayType?: string) {
// 	const message: Record<string, string> = {
// 		[SpecSearchDispType.LIST]: '一覧',
// 		[SpecSearchDispType.PHOTO]: '写真',
// 		[SpecSearchDispType.COMPARE]: '仕様比較',
// 		// @see src/utils/domain/spec.ts#toDisplayType
// 		'4': '写真', // TODO: 型および値の必要性整理（４,５にまで分ける必要があるのかどうか）
// 		'5': '仕様比較',
// 	};

// 	if (!displayType || !(displayType in message)) {
// 		return;
// 	}

// 	return message[displayType];
// }

// export type ConvertPartNumberPayload = {
// 	searchType: SearchType;
// 	searchResultType?: string;
// 	responseTime: number;
// 	input: string;
// 	url?: string;
// 	linkUrl?: string;
// 	seriesCode?: string;
// 	brandCode?: string;
// 	linkPosition?: string;
// 	selectedKeyword?: string;
// 	selectedKeywordPosition?: string;
// 	convert: {
// 		term?: string;
// 		displayFlag: Flag;
// 		flag: Flag;
// 	};
// };

// export function getPartNumberConvertParam(
// 	data: ConvertPartNumberPayload
// ): ConvertPartNumberLogMessage {
// 	const {
// 		convert,
// 		responseTime,
// 		input,
// 		linkUrl,
// 		linkPosition,
// 		selectedKeywordPosition,
// 		...rest
// 	} = data;

// 	return {
// 		userInput: input,
// 		keyword: convert.term,
// 		forwardPageUrl: linkUrl,
// 		forwardPageUrlDispNo: linkPosition,
// 		selectedKeywordDispNo: selectedKeywordPosition,
// 		responseTime: String(responseTime),
// 		daytonConvertFlag: convert.flag,
// 		publicizeFlag: convert.displayFlag,
// 		url: normalizeUrl(location.href),
// 		...rest,
// 	};
// }

// type GetAccordionStatusListPayload = {
// 	typeCount: number;
// 	prefixCount: number;
// 	categoryCount: number;
// 	seriesCount: number;
// 	sectionCollapsed: boolean;
// };
// export function getAccordionStatusList({
// 	typeCount,
// 	prefixCount,
// 	categoryCount,
// 	seriesCount,
// 	sectionCollapsed,
// }: GetAccordionStatusListPayload) {
// 	const accordionStatusList: string[] = [];

// 	const ableToExpandedPartNumberList = typeCount > 0 || prefixCount > 0;
// 	const ableToExpandedCategoryList = categoryCount > 0;
// 	const ableToExpandedSeriesList = !sectionCollapsed && seriesCount > 0;

// 	if (!sectionCollapsed) {
// 		return ['0'];
// 	}

// 	if (ableToExpandedPartNumberList) {
// 		accordionStatusList.push('1');
// 	}

// 	if (ableToExpandedCategoryList) {
// 		accordionStatusList.push('2');
// 	}

// 	if (ableToExpandedSeriesList) {
// 		accordionStatusList.push('3');
// 	}

// 	return accordionStatusList;
// }

// /** イベント発生源を表す、分析チーム指定の文字列 */
// export type EventOrigin =
// 	| 'Prodct detail'
// 	| 'SearchPrev'
// 	| 'NoneCatalog'
// 	| 'SearchResult'; // AAのみに利用（判定）
