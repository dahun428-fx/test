import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

export interface GetViewCategoryRecommendRequest extends CameleerApiRequest {
	/** Cookie ID (VONA_COMMON_LOG_KEY) */
	x: string;
	/** カテゴリコード */
	x2: string | string[];

	x3?: string | string[];
}
