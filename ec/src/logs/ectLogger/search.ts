import { formatWithValidation } from 'next/dist/shared/lib/router/utils/format-url';
import { UrlObject } from 'url';
import { addLog } from '@/api/services/addLog';
import { config } from '@/config';
import { Flag } from '@/models/api/Flag';
import { SuggestComboResponse } from '@/models/api/msm/ect/combo/SuggestComboResponse';
import { SuggestKeywordResponse } from '@/models/api/msm/ect/keyword/SuggestKeywordResponse';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { SearchType } from '@/models/api/msm/ect/log/message';
import {
	PartNumber,
	PartNumberType,
	SuggestPartNumberResponse,
} from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';
import { normalizeUrl } from '@/utils/url';

type SuggestLogPayload<R> = {
	keyword: string;
	response: R;
	duration: number;
	isCombo?: boolean;
};

/**
 * Send keyword suggest log.
 */
export function sendKeywordSuggestLog(
	payload: SuggestLogPayload<SuggestKeywordResponse>
) {
	const { keyword, response, duration } = payload;
	addLog(LogType.SEARCH, {
		keyword,
		userInput: keyword,
		searchType: SearchType.KEYWORD_SUGGEST,
		searchResultType: !!response.keywordList?.length ? 'Hit' : 'NotFound',
		suggestionsCount: response.keywordList?.length.toString(),
		responseTime: duration.toString(),
		url: normalizeUrl(location.href),
	});
	// NOTE: logType: 2 は必要か確認中 2022/3/11
}

/**
 * Send part number suggest log.
 */
export function sendPartNumberSuggestLog(
	payload: SuggestLogPayload<SuggestPartNumberResponse | SuggestComboResponse>
) {
	const {
		keyword,
		response: { partNumberList },
		duration,
		isCombo,
	} = payload;
	addLog(LogType.SEARCH, {
		keyword,
		userInput: keyword,
		searchType: isCombo
			? SearchType.COMBO_SUGGEST
			: SearchType.PART_NUMBER_SUGGEST,
		searchResultType: !!partNumberList.length ? 'Hit' : 'NotFound',
		suggestionsCount: partNumberList.length.toString(),
		unpublishedList: getUnpublishedList(partNumberList),
		responseTime: duration.toString(),
		url: normalizeUrl(location.href),
	});
	// NOTE: logType: 2 は必要か確認中 2022/3/11
}

type ClickLogPayload = {
	searchType: SearchType;
	keyword: string;
	href?: string | UrlObject;
	index: number;
	selectedKeyword?: string;
	suggestionsCount?: number;
	unpublishedList?: string;
	brandCode?: string;
	seriesCode?: string;
	searchResultType?: string;
	suggestion?: string;
	selectedKeywordDispNo?: string;
	forwardPageUrl?: string;
	reSearchFlag?: Flag;
};

/**
 * Send suggestion link click log.
 */
export function sendSuggestionLinkClickLog(payload: ClickLogPayload) {
	const { href, keyword, index, suggestionsCount, ...rest } = payload;
	addLog(LogType.SEARCH, {
		keyword,
		userInput: keyword,
		forwardPageUrl: href && configureURL(href),
		forwardPageUrlDispNo: (index + 1).toString(),
		selectedKeywordDispNo: (index + 1).toString(),
		searchResultType: 'Link',
		suggestionsCount: suggestionsCount
			? suggestionsCount.toString()
			: undefined,
		url: location.href,
		...rest,
	});
}

/**
 * Get No-Listed Product's part number list
 * @param suggestions
 *
 * WARN: private にしたい function。あらたに外部で利用しないでください
 */
export function getUnpublishedList(
	suggestions: Pick<PartNumber, 'partNumber' | 'partNumberType'>[]
) {
	return (
		suggestions
			// NOTE: currently this function accepts partNumbers from part number suggest API and combo suggest API
			// the PartNumberType is defined separately in the 2 APIs. We assume that they have the same meaning.
			// In the below line, we use part number suggest API's PartNumberType values to compare.
			.filter(
				({ partNumberType }) => partNumberType === PartNumberType.NO_LISTED
			)
			.map(({ partNumber }) => partNumber)
			.join(',')
	);
}

/**
 * Stringify url and add site origin.
 * @param href
 */
function configureURL(href: string | UrlObject) {
	// origin が付与されていれば、そのまま返却する。
	// 商品詳細画面未実装のため、404ページに転送されるがその場合ログ送信がキャンセルされてしまう。
	if (
		typeof href === 'string' &&
		(href.startsWith('https:') || href.startsWith('http:'))
	) {
		return normalizeUrl(href);
	}
	const url = typeof href === 'string' ? href : formatWithValidation(href);
	return normalizeUrl(`${config.web.ec.origin}${url}`);
}
