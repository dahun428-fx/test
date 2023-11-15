import { clearVariables } from '@/logs/analytics/adobe/pageView/clearVariables';
import { trackPageView } from '@/logs/analytics/adobe/pageView/trackPageView';
import { ClassCode } from '@/logs/constants';

type Payload = {
	seriesCode: string;
	brandCode?: string;
	categoryCodeList: string[];
};

type SimplePagePayload = Payload & {
	partNumber?: string;
};

/** Product detail default tracking */
export async function trackProductView(payload: Payload) {
	setVariables(payload);
	await trackPageView();
}

/** Simple page tracking */
export async function trackSimpleProductView(payload: SimplePagePayload) {
	setVariables(payload);

	// 単純系の場合は常に以下をセット。 NEW_FE-3081
	window.sc_class_name_simple_product = 'Simple Product Page：PN detail';

	await trackPageView();
}

/** set global variables */
function setVariables(payload: Payload) {
	const { seriesCode, brandCode, categoryCodeList } = payload;
	clearVariables();
	window.sc_class_cd = ClassCode.DETAIL;
	window.sc_class_name = 'Product Detail Pages';
	window.sc_category0_cd = categoryCodeList[0];
	window.sc_category1_cd = categoryCodeList[1];
	window.sc_category2_cd = categoryCodeList[2];
	window.sc_category3_cd = categoryCodeList[3];
	window.sc_category4_cd = categoryCodeList[4];
	window.sc_category5_cd = categoryCodeList[5];
	window.sc_brand_cd = brandCode;
	window.sc_products_cd = seriesCode;
	// AA 実装指示書によると、event117 は韓国のみで、YouTube 動画が表示された時のみ
	// とのことなのでマレーシアでは付与しない
	window.sc_proevents = 'prodView,event15,event16';
}
