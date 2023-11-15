import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

/** ログ保存APIレスポンス */
export interface GetCategoryBrandRankingResponse extends CameleerApiResponse {
	/**
	 * cameleerId (ApiId)
	 */
	cameleerId: string;
	/**
	 * レコメンドタイトル
	 */
	title: string;
	/**
	 * cookieId
	 * - maxLength: 128
	 */
	cookieId: string;
	/**
	 * user code
	 * - maxLength: 8
	 */
	userCd: string;
	/**
	 * ページID
	 * - maxLength: 16
	 */
	dispPage: string;
	/**
	 * 表示パターンキー
	 * - maxLength: 16
	 */
	dispPattern?: string;
	/**
	 * リコメンドアイテムリスト
	 */
	recommendItems: RecommendItems[];
}

/** リコメンドアイテム */
export interface RecommendItems {
	/**
	 * アイテムコード
	 * - maxLength: 16
	 */
	itemCd?: string;
	/**
	 * アイテム名
	 */
	name?: string;
	/**
	 * リンクURL
	 * - maxLength: 150
	 */
	linkUrl?: string;
	/**
	 * イメージURL
	 * - maxLength: 150
	 */
	imgUrl?: string;
	/**
	 * 説明
	 */
	description?: string;
	/**
	 * カテゴリコードレベル2
	 * - maxLength: 16
	 */
	categoryCdLv2?: string;
	/**
	 * カテゴリコードレベル3
	 * - maxLength: 16
	 */
	categoryCdLv3?: string;
	/**
	 * カテゴリコードレベル4
	 * - maxLength: 16
	 */
	categoryCdLv4?: string;
	/**
	 * カテゴリコードレベル5
	 * - maxLength: 16
	 */
	categoryCdLv5?: string;
	/**
	 * カテゴリコードレベル6
	 * - maxLength: 16
	 */
	categoryCdLv6?: string;
	/**
	 * カテゴリコードレベル7
	 * - maxLength: 16
	 */
	categoryCdLv7?: string;
	/**
	 * インナーアイテムリスト
	 */
	innerItems: InnerItems[];
	/**
	 * isActive
	 * - sample : '1'
	 * FIXME: IF定義上は integer だが文字列で返されているので一旦 string で受けておく
	 * */
	isActive?: string;
	/**
	 * ttl
	 * - maxLength: 4
	 */
	ttl?: number;
	/**
	 * 位置
	 * - maxLength: 4
	 */
	position?: number;
}

/** インナーアイテム */
export interface InnerItems {
	/**
	 * アイテムコード
	 * - maxLength: 16
	 */
	itemCd?: string;
	/**
	 * アイテム名
	 */
	name?: string;
	/**
	 * リンクURL
	 */
	linkUrl?: string;
	/**
	 * isActive
	 * - sample : '1'
	 * FIXME: IF定義上は integer だが文字列で返されているので一旦 string で受けておく
	 * */
	isActive?: string;
	/**
	 * ttl
	 * - maxLength: 4
	 */
	ttl?: number;
	/**
	 * 位置
	 * - maxLength: 4
	 */
	position?: number;
}
