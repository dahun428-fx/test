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
	categoryCode: string;
	departmentCode: string;
};

export async function trackCategoryTopView(payload: Payload) {
	await setVariables(payload);
	trackPageView();
}

/** set global variables */
async function setVariables(payload: Payload) {
	const { departmentCode, categoryCode } = payload;
	const storeState = store.getState();

	if (!selectAuthIsReady(storeState)) {
		await sleep(300);
		await setVariables(payload);
		return;
	}
	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	clearVariables();
	window.ga_class_cd = ClassCode.CATEGORY_TOP;
	window.ga_division_cd = departmentCode;
	window.ga_class_name = 'Top Categories';
	window.ga_newcategoryID = categoryCode;
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
}
