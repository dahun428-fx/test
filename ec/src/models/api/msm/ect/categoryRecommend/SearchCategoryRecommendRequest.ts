import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** このカテゴリにはこんな商品もあります取得APIリクエスト */
export interface SearchCategoryRecommendRequest extends MsmApiRequest {
	/**
	 * カテゴリコード
	 * - 取得対象のカテゴリコード
	 * - NOTE: シリーズとカテゴリの対応関係が1対多ではなく多対多になる可能性があるため、カテゴリコードを明示的に指定する
	 */
	categoryCode: string;
	/**
	 * シリーズコード
	 * - 表示中のシリーズコード
	 *   (除外するシリーズコード)
	 * - minLength: 12
	 * - maxLength: 12
	 * - example: 110400390650
	 */
	seriesCode: string;
	/**
	 * 取得件数
	 * - 取得件数
	 * - minLength: 1
	 * - default: 8
	 * - example: 8
	 */
	count?: number;
}
