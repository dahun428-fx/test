import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

export interface GetPurchaseCategoryRecommendResponse
	extends CameleerApiResponse {
	recommendItems: RecommendItem[];
}

interface RecommendItem {
	/** category code */
	itemCd: string;
	/** category name */
	name: string;
	linkUrl: string;
	imgUrl: string;
	categoryCdLv2: string;
	categoryCdLv3: string;
	categoryCdLv4: string;
	categoryCdLv5: string;
	categoryCdLv6: string;
	categoryCdLv7: string;
	/**
	 * isActive
	 * - sample : '1'
	 * FIXME: IF定義上は integer だが文字列で返されているので一旦 string で受けておく
	 * */
	isActive: string;
	ttl: number;
	position: number;
}
