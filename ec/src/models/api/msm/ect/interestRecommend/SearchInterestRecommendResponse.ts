import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** この商品を見た人はこんな商品もみています取得APIレスポンス */
export interface SearchInterestRecommendResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - example: 3
	 */
	totalCount: number;
	/**
	 * この商品を見た人はこんな商品もみています情報リスト
	 * - NOTE: ヒットしなかった場合は0件のリストを返却
	 */
	interestRecommendList: InterestRecommend[];
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

/** この商品を見た人はこんな商品もみています情報 */
export interface InterestRecommend {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - maxLength: 12
	 * - example: 110302634310
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
	 */
	brandCode: string;
	/**
	 * ブランド名
	 * - シリーズのブランド名称
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
	 * - 通常出荷日数の最小値
	 * - example: 1
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日数
	 * - 通常出荷日数の最大値
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
	 * - NOTE: 画像ごとの説明文が存在しない場合は、シリーズ名称を設定する
	 */
	comment?: string;
}
