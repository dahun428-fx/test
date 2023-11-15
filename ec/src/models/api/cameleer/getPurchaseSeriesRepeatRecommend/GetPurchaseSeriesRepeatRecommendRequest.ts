import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

/**
 * 購入シリーズリピートレコメンド 取得リクエスト
 */
export interface GetPurchaseSeriesRepeatRecommendRequest
	extends CameleerApiRequest {
	/** クッキーID */
	x: string;
}
