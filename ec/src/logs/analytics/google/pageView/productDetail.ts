import { clearVariables } from './clearVariables';
import { trackPageView } from './trackPageView';
import { getDivision, getMisumiOrVona } from '@/logs/analytics/google/helpers';
import { ClassCode } from '@/logs/constants';
import { Flag } from '@/models/api/Flag';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

type Payload = {
	seriesCode: string;
	brandCode?: string;
	categoryList: { categoryCode: string; categoryName: string }[];
	innerCode?: string;
	brandName?: string;
	seriesName: string;
	partNumber?: string;
	misumiFlag: Flag;
	departmentCode: string;
};

/** Product detail default tracking */
export async function trackProductView(payload: Payload) {
	await setVariables(payload);
	trackPageView();
}

/** Simple page tracking */
export async function trackSimpleProductView(payload: Payload) {
	await setVariables(payload);

	// Simple page-specific variables
	if (payload.partNumber) {
		window.ga_class_name_simple_product = 'Simple Product Page：PN detail';
	} else {
		window.ga_class_name_simple_product = 'Simple Product Page：product list';
	}

	trackPageView();
}

/** set global variables */
async function setVariables(payload: Payload) {
	const {
		seriesCode,
		brandCode,
		categoryList,
		innerCode,
		brandName,
		seriesName,
		partNumber,
		misumiFlag,
		departmentCode,
	} = payload;

	const storeState = store.getState();

	if (!selectAuthIsReady(storeState)) {
		await sleep(300);
		await setVariables(payload);
		return;
	}
	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	clearVariables();
	window.ga_class_cd = ClassCode.DETAIL;
	window.ga_division_cd = getDivision({ misumiFlag, departmentCode });
	window.ga_class_name = 'Product Detail Pages';
	window.ga_MorV = getMisumiOrVona(misumiFlag);
	window.ga_products_cd = seriesCode;
	window.ga_products_name = seriesName;
	window.ga_brand_cd = brandCode;
	window.ga_brand_name = brandName;
	window.ga_category1_cd = categoryList[1]?.categoryCode;
	window.ga_category1_name = categoryList[1]?.categoryName;
	window.ga_category2_cd = categoryList[2]?.categoryCode;
	window.ga_category2_name = categoryList[2]?.categoryName;
	window.ga_category3_cd = categoryList[3]?.categoryCode;
	window.ga_category3_name = categoryList[3]?.categoryName;
	window.ga_category4_cd = categoryList[4]?.categoryCode;
	window.ga_category4_name = categoryList[4]?.categoryName;
	window.ga_category5_cd = categoryList[5]?.categoryCode;
	window.ga_category5_name = categoryList[5]?.categoryName;
	window.ga_proevents = 'detail';
	window.ga_newcategoryID = categoryList[0]?.categoryCode;
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
	window.ga_pn_cd = partNumber;
	window.ga_inner_cd = innerCode;
}
