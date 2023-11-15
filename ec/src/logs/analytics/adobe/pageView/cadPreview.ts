import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

type Payload = {
	seriesCode?: string;
	brandCode?: string;
};

/** cad preview page tracking */
export async function trackCadPreview({ seriesCode, brandCode }: Payload) {
	setVariables({ seriesCode, brandCode });
	await trackPageView();
}

/** set global variables */
function setVariables(payload: Payload) {
	clearVariables();
	window.sc_class_cd = ClassCode.DETAIL;
	window.sc_class_name = 'Product Detail 3DPages';
	window.sc_brand_cd = payload.brandCode;
	window.sc_products_cd = payload.seriesCode;
}
