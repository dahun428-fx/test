import { getDivision, getMisumiOrVona } from '@/logs/analytics/google/helpers';
import {
	getCategoryClassCode,
	getCategoryClassName,
	getDisplayLayout,
} from '@/logs/analytics/google/helpers/getCategoryInfo';
import { clearVariables } from '@/logs/analytics/google/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/google/pageView/trackPageView';
import { Flag } from '@/models/api/Flag';
import { store } from '@/store';
import {
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import { sleep } from '@/utils/timer';

type Category = {
	categoryCode: string;
	categoryName: string;
};

export type Payload = {
	categoryList: Category[];
	brandCode?: string;
	brandName?: string;
	misumiFlag?: Flag;
	departmentCode: string;
	categoryCode?: string;
	layout?: string;
	pageSize?: number;
	productClass?: 'Product';
};

export async function trackLowerCategoryView(payload: Payload) {
	await setVariables(payload);
	trackPageView();
}

/** set global variables */
async function setVariables(payload: Payload) {
	const {
		brandCode,
		brandName,
		misumiFlag,
		departmentCode,
		categoryList,
		categoryCode,
		layout,
		pageSize,
		productClass,
	} = payload;
	const storeState = store.getState();

	if (!selectAuthIsReady(storeState)) {
		await sleep(300);
		await setVariables(payload);
		return;
	}
	const isPurchaseLinkUser = selectIsPurchaseLinkUser(storeState);

	clearVariables();
	window.ga_brand_cd = brandCode;
	window.ga_brand_name = brandName;
	window.ga_category1_cd = categoryList[0]?.categoryCode;
	window.ga_category1_name = categoryList[0]?.categoryName;
	window.ga_category2_cd = categoryList[1]?.categoryCode;
	window.ga_category2_name = categoryList[1]?.categoryName;
	window.ga_category3_cd = categoryList[2]?.categoryCode;
	window.ga_category3_name = categoryList[2]?.categoryName;
	window.ga_category4_cd = categoryList[3]?.categoryCode;
	window.ga_category4_name = categoryList[3]?.categoryName;
	window.ga_category5_cd = categoryList[4]?.categoryCode;
	window.ga_category5_name = categoryList[4]?.categoryName;
	window.ga_class_cd = getCategoryClassCode(categoryList.length);
	window.ga_class_name = getCategoryClassName(categoryList.length);
	window.ga_division_cd = getDivision({ misumiFlag, departmentCode });
	window.ga_MorV =
		misumiFlag === undefined ? undefined : getMisumiOrVona(misumiFlag);
	window.ga_newcategoryID = categoryCode ?? '';
	window.ga_user_type = isPurchaseLinkUser ? 'procurement' : '';
	// Spec search
	window.ga_layout = getDisplayLayout(layout);
	window.ga_number = pageSize ? `${pageSize}items` : undefined;
	window.ga_products_class = productClass;
}
