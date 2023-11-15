import { clearVariables } from './clearVariables';
import { trackPageView } from './trackPageView';
import { ClassCode } from '@/logs/constants';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

/** Not found page tracking */
export async function trackNotFound() {
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

	clearVariables();

	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
	window.ga_class_cd = ClassCode.NOT_FOUND;
	window.ga_class_name = '404_NotFound';
	window.ga_pageType = ClassCode.NOT_FOUND;
}
