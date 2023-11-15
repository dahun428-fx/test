import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

/**
 * レーダーチャートレコメンド 取得レスポンス
 */
export interface GetRadarChartRecommendResponse extends CameleerApiResponse {
	recommendItems: RecommendItem[];
}

export interface RecommendItem {
	/**
	 * 商品カテゴリーコード
	 * - example: T0201000000
	 */
	itemCd: string;
	/**
	 * 商品カテゴリー名
	 * - example: Tooling
	 */
	name?: string;
	/**
	 * 商品ページURL
	 * - example: //th.misumi-ec.com/en/vona2/fs_processing/T0200000000/T0201000000/?rid=c2-A_top_1_T0201000000
	 */
	linkUrl?: string;
	/**
	 * 商品画像URL
	 * - example: https://th.misumi-ec.com/en/linked/material/fs/category/T0201000000.jpg
	 */
	imgUrl?: string;
	/**
	 * 商品説明
	 */
	description?: string;
	/**
	 * カテゴリーコード
	 * - 階層レベル
	 * - example: fs_processing
	 */
	categoryCdLv2?: string;
	/**
	 * カテゴリーコード
	 * - 階層レベル
	 * - example: T0200000000
	 */
	categoryCdLv3?: string;
	/**
	 * カテゴリーコード
	 * - 階層レベル
	 * - example: T0201000000
	 */
	categoryCdLv4?: string;
	/**
	 * カテゴリーコード
	 * - 階層レベル
	 */
	categoryCdLv5?: string;
	/**
	 * カテゴリーコード
	 * - 階層レベル
	 */
	categoryCdLv6?: string;
	/**
	 * カテゴリーコード
	 * - 階層レベル
	 */
	categoryCdLv7?: string;
	/**
	 * isActive
	 * - sample : '1'
	 * FIXME: IF定義上は integer だが文字列で返されているので一旦 string で受けておく
	 * */
	isActive: string;
	/**
	 * ttl
	 * - sample: 1617270384
	 */
	ttl: number;
	/**
	 * position
	 * - sample: 1
	 * */
	position: number;
}
