import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

/** Keyword Search page tracking */
export async function trackKeywordSearchView() {
	setVariables();
	await trackPageView();
}

/** set global variables */
function setVariables() {
	clearVariables();
	window.sc_class_cd = ClassCode.SEARCH;
	window.sc_class_name = 'General Search Results';
	window.sc_proevents = 'event13,event14';
	window.sc_display_lang = 'en';
}
