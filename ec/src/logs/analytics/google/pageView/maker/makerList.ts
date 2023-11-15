import { clearVariables } from '@/logs/analytics/google/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/google/pageView/trackPageView';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

export async function trackMakerListView() {
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
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
}
