import { clearVariables } from '@/logs/analytics/google/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/google/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

type Payload = {
	brandCode?: string;
	brandName?: string;
	seriesCode?: string;
	seriesName?: string;
	partNumber?: string;
};

/** CAD preview page tracking */
export async function trackCadPreview(payload: Payload) {
	await setVariables(payload);

	trackPageView();
}

/** set global variables */
async function setVariables(payload: Payload) {
	const storeState = store.getState();

	if (!selectAuthIsReady(storeState)) {
		await sleep(300);
		await setVariables(payload);
		return;
	}
	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	clearVariables();
	window.ga_brand_cd = payload.brandCode;
	window.ga_brand_name = payload.brandName;
	window.ga_class_cd = ClassCode.CAD_PREVIEW;
	window.ga_class_name = '3D Preview Pages';
	window.ga_products_cd = payload.seriesCode;
	window.ga_products_name = payload.seriesName;
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
}
