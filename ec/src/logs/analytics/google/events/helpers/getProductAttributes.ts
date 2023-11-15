import { ApplicationError } from '@/errors/ApplicationError';
import { Logger } from '@/logs/datadog/Logger';
import { store } from '@/store';
import { selectCompletedPartNumber } from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';

type Attributes = {
	misumiOrVona?: typeof window.ga_MorV;
	departmentCode?: typeof window.ga_newcategoryID;
	seriesCode?: typeof window.ga_products_cd;
	brandCode?: typeof window.ga_brand_cd;
	partNumber?: string;
	innerCode?: string;
};

export function getProductAttributes() {
	const attributes: Attributes = {};
	try {
		assertNotNull(window.ga_products_cd, 'Needs sent "Product detail" PV.');
		assertNotNull(window.ga_newcategoryID, 'Needs sent "Product detail" PV.');

		attributes.misumiOrVona = window.ga_MorV;
		attributes.departmentCode = window.ga_newcategoryID;
		attributes.seriesCode = window.ga_products_cd;
		attributes.brandCode = window.ga_brand_cd;
	} catch (e) {
		// 分析でエラーになってもエラー画面をお客さんに表示するべきではないため、何もしない
		if (e instanceof ApplicationError) {
			Logger.error(e.message);
		}
	} finally {
		// partNumber は取得できないと業務障害が出る可能性があるので、エラーを出す処理が必要
		const partNumber = selectCompletedPartNumber(store.getState());
		attributes.partNumber = partNumber?.partNumber;
		attributes.innerCode = partNumber?.innerCode;

		return attributes;
	}
}
