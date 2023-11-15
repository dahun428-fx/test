import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

/** カートインモーダルレコメンド 取得リクエスト */
export interface GetCartInModalRecommendRequest extends CameleerApiRequest {
	/** Cookie ID (VONA_COMMON_LOG_KEY) */
	x: string;
	/** シリーズコード */
	x2: string;
}
