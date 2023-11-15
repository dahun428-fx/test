import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

/**
 * ViewHistory Response
 */
export interface GetViewHistoryResponse extends CameleerApiResponse {
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
	 * brand
	 * - example: MISUMI
	 */
	maker?: string;
	/**
	 * minStandardPrice
	 * - example: -99
	 */
	priceFrom?: string;
	/**
	 * maxStandardPrice
	 * - example: -99
	 */
	priceTo?: string;
	/**
	 * minDaysToShip
	 * - example: 2
	 */
	deliveryFrom?: string;
	/**
	 * maxDaysToShip
	 * - example: 2
	 */
	deliveryTo?: string;
	/**
	 * カテゴリーコード
	 * - example: P0101000000
	 */
	categoryCd?: string;
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
