import { clearVariables } from './clearVariables';
import { trackPageView } from './trackPageView';
import { ClassCode } from '@/logs/constants';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

/** Top page tracking */
export async function trackTopView() {
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
	window.ga_class_cd = ClassCode.TOP;
	window.ga_class_name = 'TOP';
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
}
