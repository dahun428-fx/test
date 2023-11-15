import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

/** Top page tracking */
export async function trackTopView() {
	setVariables();
	await trackPageView();
}

/** set global variables */
function setVariables() {
	clearVariables();
	window.sc_class_cd = ClassCode.TOP;
	window.sc_class_name = 'Vona Top';
	window.sc_display_lang = 'en';
}
