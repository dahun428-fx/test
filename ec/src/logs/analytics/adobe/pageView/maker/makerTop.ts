import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

type Payload = {
	brandCode: string;
};

export async function trackMakerTopView(payload: Payload) {
	setVariables(payload);
	await trackPageView();
}

/** set global variables */
function setVariables(payload: Payload) {
	const { brandCode } = payload;
	clearVariables();
	window.sc_class_cd = ClassCode.MAKER;
	window.sc_class_name = 'Brand Top';
	window.sc_brand_cd = brandCode;
	window.sc_display_lang = 'en';
}
