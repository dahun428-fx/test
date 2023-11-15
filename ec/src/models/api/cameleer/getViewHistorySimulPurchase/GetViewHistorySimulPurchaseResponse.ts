import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

/**
 * 閲覧商品同時購入 取得レスポンス
 */
export interface GetViewHistorySimulPurchaseResponse
	extends CameleerApiResponse {
	viewHistoryItem: ViewHistoryItem;
	recommendItems: RecommendItem[];
}

export interface ViewHistoryItem {
	/**
	 * 商品シリーズコード
	 * - example: 110100099750
	 */
	itemCd: string;
	/**
	 * 商品シリーズ名
	 * - example: Punch Blanks
	 */
	name?: string;
	/**
	 * 商品ページURL
	 * - example: //th.misumi-ec.com/en/vona2/detail/110100099750/?rid=c10_ctop_0_110100099750
	 */
	linkUrl?: string;
	/**
	 * 商品画像URL
	 * - example: https://assets.misumi-ec.com/is/image/misumiPrd/110100099750_001?$log_reco$
	 */
	imgUrl?: string;
	/**
	 * 商品説明
	 */
	description?: string;
	/**
	 * メーカー名
	 */
	maker?: string;
	/**
	 * 最高価格
	 */
	priceFrom?: string;
	/**
	 * 通常価格
	 */
	priceTo?: string;
	/**
	 * メーカー名
	 */
	deliveryFrom?: string;
	/**
	 * メーカー名
	 */
	deliveryTo?: string;
	/**
	 * カテゴリーコード
	 * - example: T0201000000
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
	 * メーカー名
	 */
	maker?: string;
	/**
	 * 最高価格
	 */
	priceFrom?: string;
	/**
	 * 通常価格
	 */
	priceTo?: string;
	/**
	 * メーカー名
	 */
	deliveryFrom?: string;
	/**
	 * メーカー名
	 */
	deliveryTo?: string;
	/**
	 * カテゴリーコード
	 * - example: T0201000000
	 */
	categoryCd?: string;
	/**
	 * isActive
	 * - sample : '1'
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
