import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** よく一緒に購入されている商品取得APIリクエスト */
export interface SearchPurchaseRecommendRequest extends MsmApiRequest {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - minLength: 12
	 * - maxLength: 12
	 * - example: 110400390650
	 */
	seriesCode: string;
	/**
	 * 取得件数
	 * - 取得件数
	 * - default: 5
	 * - NOTE: LIMIT
	 */
	count?: number;
}
