import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

export interface GetMyPartsListAddModalRecommendResponse
	extends CameleerApiResponse {
	recommendItems: RecommendItem[];
}

export interface RecommendItem {
	/**
	 * シリーズコード
	 * - example: 110100152250
	 */
	itemCd: string;
	/**
	 * シリーズ名
	 * - example: Tooling
	 */
	name?: string;
	/**
	 * 商品ページURL
	 * - example: //my.misumi-ec.com/vona2/detail/110100152250/?rid=c9_mypage_1_110100152250
	 */
	linkUrl?: string;
	/**
	 * 商品画像URL
	 * - example: https://content.misumi-ec.com/image/upload/t_log_reco/v1/p/jp/product/series/110100152250/110100152250_001.jpg
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
	 * - example: P0201000000
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
