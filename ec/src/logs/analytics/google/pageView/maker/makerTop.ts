import { getDivision, getMisumiOrVona } from '@/logs/analytics/google/helpers';
import { clearVariables } from '@/logs/analytics/google/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/google/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';
import { Flag } from '@/models/api/Flag';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

type Payload = {
	brandCode: string;
	brandName: string;
	misumiFlag: Flag;
	departmentCode: string;
};

export async function trackMakerTopView(payload: Payload) {
	await setVariables(payload);
	trackPageView();
}

/** set global variables */
async function setVariables(payload: Payload) {
	const { brandCode, brandName, misumiFlag, departmentCode } = payload;
	const storeState = store.getState();

	if (!selectAuthIsReady(storeState)) {
		await sleep(300);
		await setVariables(payload);
		return;
	}
	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	clearVariables();
	window.ga_class_cd = ClassCode.MAKER_TOP;
	window.ga_division_cd = getDivision({ misumiFlag, departmentCode });
	window.ga_class_name = 'Brand Top';
	window.ga_MorV = getMisumiOrVona(misumiFlag);
	window.ga_brand_cd = brandCode;
	window.ga_brand_name = brandName;
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
	window.ga_newcategoryID = 'all';
}
