import {
	sendCadGenerateLog,
	sendCadErrorLog,
	sendCadOpenLog,
	sendCadLogs,
	sendWeb2CadLogs,
} from './downloadCad';
import {
	completePartNumber,
	changeSpec as changePartNumberSpec,
} from './partNumber';
import {
	sendKeywordSuggestLog,
	sendPartNumberSuggestLog,
	sendSuggestionLinkClickLog,
} from './search';
import {
	sendClickComboLinkLog,
	sendClickFullTextSearchLog,
	sendClickInCadLinkAllLog,
	sendClickInCadLinkLog,
	sendClickPartNumberTypeLog,
	sendClickSeriesLinkLog,
	sendFilterSpecLog,
	sendClickAlternativeLinkLog,
	sendShowResultLog,
	sendClickBrandLinkLog,
	sendClickSeriesBreadcrumbLog,
	sendClickTechnicalInformationLog,
	sendClickShowAllTechnicalInformationLog,
} from './searchResult';
import { changeSpec as changeSeriesSpec } from './series';
import { changeTab, preview3D } from './tab';
import { sendVisitLog } from './visit';

export const ectLogger = {
	visit: sendVisitLog,
	search: {
		keywordSuggest: sendKeywordSuggestLog,
		partNumberSuggest: sendPartNumberSuggestLog,
		clickSuggest: sendSuggestionLinkClickLog,
	},
	searchResult: {
		clickComboLink: sendClickComboLinkLog,
		clickInCadLink: sendClickInCadLinkLog,
		clickInCadLinkAll: sendClickInCadLinkAllLog,
		filterSpec: sendFilterSpecLog,
		clickPartNumberType: sendClickPartNumberTypeLog,
		clickSeriesLink: sendClickSeriesLinkLog,
		clickFullTextSearchLink: sendClickFullTextSearchLog,
		clickAlternativeLink: sendClickAlternativeLinkLog,
		visit: sendShowResultLog,
		clickBrandLink: sendClickBrandLinkLog,
		clickSeriesBreadcrumb: sendClickSeriesBreadcrumbLog,
		clickTechnicalInformation: sendClickTechnicalInformationLog,
		clickShowAllTechnicalInformation: sendClickShowAllTechnicalInformationLog,
	},
	cad: {
		generate: sendCadGenerateLog,
		error: sendCadErrorLog,
		open: sendCadOpenLog,
		download: sendCadLogs,
		web2CadDownload: sendWeb2CadLogs,
	},
	tab: {
		change: changeTab,
		preview3D, // タブではないが…
	},
	partNumber: {
		complete: completePartNumber,
		changeSpec: changePartNumberSpec,
	},
	series: {
		changeSpec: changeSeriesSpec,
	},
} as const;
