import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** この商品を見た人はこんな商品もみています取得APIリクエスト */
export interface SearchInterestRecommendRequest extends MsmApiRequest {
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
	 * - default: 12
	 * - example: 10
	 */
	count?: number;
}
