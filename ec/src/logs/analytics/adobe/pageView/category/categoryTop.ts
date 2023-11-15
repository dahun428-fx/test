import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

type Payload = {
	categoryCode: string;
};

export async function trackCategoryTopView(payload: Payload) {
	setVariables(payload);
	await trackPageView();
}

/** set global variables */
function setVariables(payload: Payload) {
	const { categoryCode } = payload;
	clearVariables();
	window.sc_class_cd = ClassCode.CATEGORY;
	window.sc_class_name = 'Top Categories';
	window.sc_category0_cd = categoryCode;
	window.sc_display_lang = 'en';
}
