import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

/** カートインモーダルレコメンド 取得レスポンス */
export interface GetCartInModalRecommendResponse extends CameleerApiResponse {
	/**
	 * リコメンドアイテムリスト
	 */
	recommendItems: RecommendItem[];
}

/** リコメンドアイテム */
export interface RecommendItem {
	/**
	 * アイテムコード
	 * - maxLength: 16
	 */
	itemCd: string;
	/**
	 * アイテム名
	 */
	name?: string;
	/**
	 * リンクURL
	 */
	linkUrl?: string;
	/**
	 * イメージURL
	 * - maxLength: 150
	 */
	imgUrl?: string;
	/**
	 * メーカー
	 * - example: NIC AUTOTEC
	 */
	maker?: string;
	/**
	 * 価格 (from)
	 * - example: 2.04
	 */
	priceFrom?: string;
	/**
	 * 価格 (to)
	 * - example: 3.67
	 */
	priceTo?: string;
	/**
	 * 納期 (from)
	 * - example: -1
	 */
	deliveryFrom?: string;
	/**
	 * 納期 (to)
	 * - example: -1
	 */
	deliveryTo?: string;
	/**
	 * カテゴリコード
	 * - example: M1501000000
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
	 */
	ttl: number;
	/**
	 * 位置
	 */
	position: number;
}
