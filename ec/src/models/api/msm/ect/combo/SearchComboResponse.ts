import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** COMBO検索APIレスポンス */
export interface SearchComboResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索結果の型番の総件数
	 * - example: 5
	 */
	totalCount: number;
	/**
	 * シリーズ情報リスト
	 * - 検索結果のシリーズ一覧
	 */
	seriesList: Series[];
}

/** シリーズ情報 */
export interface Series {
	/**
	 * シリーズコード
	 * - シリーズコード
	 * - example: 110300004660
	 */
	seriesCode: string;
	/**
	 * シリーズ名
	 * - シリーズの名称
	 * - example: シャフト　全長表面処理
	 */
	seriesName: string;
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: MSM1
	 */
	brandCode: string;
	/**
	 * ブランド名
	 * - ブランド名
	 * - example: ミスミ
	 */
	brandName: string;
	/**
	 * 商品画像リスト
	 * - シリーズの画像一覧
	 */
	productImageList: ProductImage[];
	/**
	 * 型番リスト
	 * - 候補となる型番のリスト
	 *   COMBOから返却された型番のうち、Eカタ未掲載のものは返却しない
	 */
	partNumberList: PartNumber[];
}

/** 商品画像 */
export interface ProductImage {
	/**
	 * タイプ
	 * - 画像のタイプ
	 *   1: 通常画像
	 *   2: 拡大表示対応画像
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
	comment: string;
}

/** 型番 */
export interface PartNumber {
	/**
	 * 型番
	 * - 候補となる型番
	 */
	partNumber: string;
	/**
	 * 一致率
	 * - 型番の一致率
	 * - example: 84.3155999999999
	 */
	matchRate: number;
	/**
	 * 確定タイプ
	 * - 確定タイプ
	 *   3: インナーまで確定済み
	 *   4: フル型番確定済み
	 * - example: 2
	 * - NOTE: 確定タイプのコード値はシリーズ検索APIのコード値に統一。
	 *         COMBO検索APIでは、「1:シリーズまで確定済み」「2: タイプまで確定済み」は返却しません。
	 */
	completeType: string;
}
