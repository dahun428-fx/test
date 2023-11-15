import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

export interface GetPurchaseCategoryRecommendRequest
	extends CameleerApiRequest {
	/** Cookie ID (VONA_COMMON_LOG_KEY) */
	x: string;
	/** 大カテゴリコード */
	x2: string | string[];
	/** 除外大カテゴリコード */
	x3?: string | string[];
}
