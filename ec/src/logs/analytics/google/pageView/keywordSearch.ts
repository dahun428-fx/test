import { clearVariables } from '@/logs/analytics/google/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/google/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

export async function trackKeywordSearchView() {
	await setVariables();

	trackPageView();
}

/** set global variables */
async function setVariables() {
	const storeState = store.getState();

	if (!selectAuthIsReady(storeState)) {
		await sleep(300);
		await setVariables();
		return;
	}
	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	clearVariables();
	window.ga_class_cd = ClassCode.KEYWORD_SEARCH;
	window.ga_class_name = 'Keyword Search Results';
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
	window.ga_sort_type = 'Series transitions';
}
