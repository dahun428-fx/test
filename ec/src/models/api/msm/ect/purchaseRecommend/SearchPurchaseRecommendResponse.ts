import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** よく一緒に購入されている商品取得APIレスポンス */
export interface SearchPurchaseRecommendResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - example: 3
	 * - NOTE: 検索条件にヒットした全件数取得
	 */
	totalCount: number;
	/**
	 * よく一緒に購入されている商品リスト
	 */
	purchaseRecommendList: PurchaseRecommend[];
	/**
	 * 通貨コード
	 * - 通貨コード
	 *   JPY: 日本円
	 *   RMB: 人民元
	 * - maxLength: 3
	 * - example: JPY
	 */
	currencyCode: string;
}

/** よく一緒に購入されている商品 */
export interface PurchaseRecommend {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - maxLength: 12
	 * - example: 110302634310
	 * - NOTE: シリーズ検索APIを呼出し。リクエストのシリーズコードには、シリーズレコメンド.おすすめ商品シリーズコードをカンマ区切りで指定。
	 */
	seriesCode: string;
	/**
	 * シリーズ名
	 * - シリーズの名称
	 * - example: シャフト　ストレートタイプ
	 */
	seriesName: string;
	/**
	 * ブランドコード
	 * - シリーズのブランドコード
	 * - maxLength: 4
	 * - example: MSM1
	 */
	brandCode: string;
	/**
	 * ブランド名
	 * - シリーズのブランド名称
	 * - example: ミスミ
	 */
	brandName: string;
	/**
	 * 商品画像リスト
	 * - シリーズの画像一覧。空のリストの場合もあり
	 */
	productImageList: ProductImage[];
	/**
	 * 最小通常単価
	 * - 通常単価の最小値
	 * - example: 100
	 */
	minStandardUnitPrice?: number;
	/**
	 * 最大通常単価
	 * - 通常単価の最大値
	 * - example: 1000
	 */
	maxStandardUnitPrice?: number;
	/**
	 * 最小通常出荷日数
	 * - 通常出荷日数の最小値を返却
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 *   99: 別途調整、都度見積り
	 * - example: 1
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日数
	 * - 通常出荷日数の最大値を返却
	 * - example: 5
	 */
	maxStandardDaysToShip?: number;
	/**
	 * 最小最短出荷日数
	 * - ストーク適用時の出荷日数の最小値を返却
	 */
	minShortestDaysToShip?: number;
	/**
	 * 最大最短出荷日数
	 * - ストーク適用時の出荷日数の最大値を返却
	 * - example: 3
	 */
	maxShortestDaysToShip?: number;
}

/** 商品画像 */
export interface ProductImage {
	/**
	 * タイプ
	 * - 画像のタイプ
	 *   1: 通常画像
	 *   2: 拡大表示対応画像
	 *   3: ...
	 * - example: 1
	 */
	type: string;
	/**
	 * URL
	 * - 画像のURL
	 * - example: //misumi.scene7.com/is/image/misumi/110300004660_20149999_m_01_99999_jp
	 */
	url: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - example: MEB2211
	 */
	comment?: string;
}
