import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

export type Payload = {
	brandCode?: string;
	categoryCodeList: string[];
};

export async function trackLowerCategoryView(payload: Payload) {
	setVariables(payload);
	await trackPageView();
}

/** set global variables */
function setVariables(payload: Payload) {
	const { brandCode, categoryCodeList } = payload;
	clearVariables();
	window.sc_class_cd = ClassCode.CATEGORY;
	window.sc_class_name = 'Categories List Pages';
	window.sc_brand_cd = brandCode;
	window.sc_category0_cd = categoryCodeList[0];
	window.sc_category1_cd = categoryCodeList[1];
	window.sc_category2_cd = categoryCodeList[2];
	window.sc_category3_cd = categoryCodeList[3];
	window.sc_category4_cd = categoryCodeList[4];
	window.sc_category5_cd = categoryCodeList[5];
	window.sc_display_lang = 'en';
	window.sc_proevents = 'event11';
}
