import { addLog } from '@/api/services/addLog';
import { Flag } from '@/models/api/Flag';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { SearchType } from '@/models/api/msm/ect/log/message/SearchLogMessage';

type SearchResultType =
	| 'LinkCombo'
	| 'LinkModu'
	| 'LinkModuMore'
	| 'LinkRfnShip'
	| 'LinkRfnMaker'
	| 'LinkRfnCad'
	| 'LinkRfnCtg'
	| 'LinkInner'
	| 'Link'
	| 'LinkEndSub'
	| 'LinkGSA'
	| 'LinkMaker'
	| 'LinkCtgPath'
	| 'LinkKoza'
	| 'LinkKozaMore';

export type ShowResultLogPayload = {
	keyword: string;
	searchResultType: string;
	isReSearch?: string;
	responseTime: number;
	selectedKeywordDispNo: string;
	resultCount: number;
	brandCount: number;
	categoryCount: number;
	seriesCount: number;
	inCadLibraryCount: number;
	fullTextSearchCount: number;
	technicalInfoCount: number;
	comboCount: number;
	discontinuedCount: number;
	brandMode?: '0' | '1' | '2';
	innerMatchingCount: number;
	cNaviCount: number;
};

type ClickLinkLogPayload = {
	isReSearch?: string;
	keyword: string;
	seriesCode?: string;
	brandCode?: string;
	forwardPageUrl?: string;
	forwardPageUrlDispNo?: string;
};

export type FilterSpecLogPayload = {
	isReSearch?: string;
	keyword: string;
	searchResultType: SearchResultType;
	selectedKeyword?: string;
};

type SearchResultLogPayload = ClickLinkLogPayload & FilterSpecLogPayload;

function sendSearchResultLog(payload: SearchResultLogPayload) {
	const { keyword, isReSearch, ...rest } = payload;
	addLog(LogType.SEARCH, {
		reSearchFlag:
			isReSearch && Flag.isFlag(isReSearch) ? isReSearch : Flag.FALSE,
		userInput: keyword,
		keyword,
		searchType: SearchType.KEYWORD_SEARCH,
		url: window.location.href,
		suggestion: '',
		...rest,
	});
}

export function sendClickComboLinkLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({ ...payload, searchResultType: 'LinkCombo' });
}

export function sendClickInCadLinkLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({ ...payload, searchResultType: 'LinkModu' });
}

export function sendClickInCadLinkAllLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({ ...payload, searchResultType: 'LinkModuMore' });
}

export function sendFilterSpecLog(payload: FilterSpecLogPayload) {
	sendSearchResultLog(payload);
}

export function sendClickPartNumberTypeLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkInner',
	});
}

export function sendClickSeriesLinkLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'Link',
	});
}

export function sendClickFullTextSearchLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkGSA',
	});
}

export function sendClickAlternativeLinkLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkEndSub',
	});
}

export function sendShowResultLog(payload: ShowResultLogPayload) {
	const {
		keyword,
		isReSearch,
		responseTime,
		resultCount,
		brandCount,
		categoryCount,
		seriesCount,
		inCadLibraryCount,
		comboCount,
		fullTextSearchCount,
		technicalInfoCount,
		innerMatchingCount,
		discontinuedCount,
		cNaviCount,
		...rest
	} = payload;
	addLog(LogType.SEARCH, {
		reSearchFlag:
			isReSearch && Flag.isFlag(isReSearch) ? isReSearch : Flag.FALSE,
		keyword: keyword,
		responseTime: String(responseTime ?? 0),
		resultCount: String(resultCount ?? 0),
		brandCount: String(brandCount ?? 0),
		categoryCount: String(categoryCount ?? 0),
		seriesCount: String(seriesCount ?? 0),
		inCadLibraryCount: String(inCadLibraryCount ?? 0),
		comboCount: String(comboCount ?? 0),
		fullTextSearchCount: String(fullTextSearchCount ?? 0),
		technicalInfoCount: String(technicalInfoCount ?? 0),
		innerMatchingCount: String(innerMatchingCount ?? 0),
		cNaviCount: String(cNaviCount ?? 0),
		discontinuedCount: String(discontinuedCount ?? 0),
		userInput: keyword,
		searchType: '1',
		url: window.location.href,
		suggestion: '',
		...rest,
	});
}

export function sendClickBrandLinkLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkMaker',
	});
}

export function sendClickSeriesBreadcrumbLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkCtgPath',
	});
}

export function sendClickTechnicalInformationLog(payload: ClickLinkLogPayload) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkKoza',
	});
}

export function sendClickShowAllTechnicalInformationLog(
	payload: ClickLinkLogPayload
) {
	sendSearchResultLog({
		...payload,
		searchResultType: 'LinkKozaMore',
	});
}
