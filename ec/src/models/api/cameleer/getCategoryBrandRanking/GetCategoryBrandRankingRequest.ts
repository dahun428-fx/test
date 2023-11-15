import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

/** ログ保存APIリクエスト */
export interface GetCategoryBrandRankingRequest extends CameleerApiRequest {
	/** Cookie ID (VONA_COMMON_LOG_KEY) */
	x: string;
}
