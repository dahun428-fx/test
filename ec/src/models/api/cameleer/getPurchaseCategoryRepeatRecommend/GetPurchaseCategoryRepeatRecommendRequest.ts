import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

export interface GetPurchaseCategoryRepeatRecommendRequest
	extends CameleerApiRequest {
	/** Cookie ID (VONA_COMMON_LOG_KEY) */
	x: string;
	dispPattern?: string;
	dispPage: string;
}
