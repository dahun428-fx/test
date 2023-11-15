import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

export interface GetMyPartsListAddModalRecommendRequest
	extends CameleerApiRequest {
	/** Cookie ID (VONA_COMMON_LOG_KEY) */
	x: string;
	/** シリーズコード */
	x2: string;
}
