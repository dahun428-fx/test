import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** CADダウンロードログ追保存APIリクエスト */
export interface AddCadLogRequest extends MsmApiRequest {
	/**
	 * 商品名称
	 * - 商品名称
	 * - example: SFJ3-1000
	 */
	productName?: string;
	/**
	 * 商品ID
	 * - 商品ID
	 */
	productId?: string;
	/**
	 * 商品ページURL
	 * - 商品ページURL
	 */
	productPageUrl?: string;
	/**
	 * 商品画像URL
	 * - 商品画像URL
	 */
	productImgUrl?: string;
	/**
	 * 型番
	 * - 型番
	 */
	partNumber?: string;
	/**
	 * インナーコード
	 * - インナーコード
	 */
	innerCd?: string;
	/**
	 * メーカーコード
	 * - メーカーコード
	 */
	makerCd?: string;
	/**
	 * メーカー名
	 * - メーカー名
	 */
	makerName?: string;
	/**
	 * 数量
	 * - 数量
	 */
	amount?: number;
	/**
	 * 価格
	 * - 価格
	 */
	unitPrice?: number;
	/**
	 * カタログ価格
	 * - カタログ価格
	 */
	catalogPrice?: number;
	/**
	 * 税込小計
	 * - 税込小計
	 */
	totalPriceWithTaxes?: number;
	/**
	 * 出荷日
	 * - 出荷日
	 */
	days?: string;
	/**
	 * ストーク
	 * - ストーク
	 */
	stoke?: string;
	/**
	 * パック品文字列
	 * - パック品文字列
	 */
	pack?: string;
	/**
	 * 商品タイプ
	 * - 商品タイプ
	 */
	productType?: string;
	/**
	 * フロムサイトタイプ
	 * - フロムサイトタイプ
	 */
	siteId?: string;
	/**
	 * PrjPath
	 * - PrjPath
	 */
	prjPath?: string;
	/**
	 * CADファイル名
	 * - CADファイル名
	 */
	cadFilename?: string;
	/**
	 * CADファイル種類
	 * - CADファイル種類
	 *   2D: 2D-CAD
	 *   3D: 3D-CAD
	 */
	cadType?: string;
	/**
	 * コンフィグレータCADのファイル形式
	 * - コンフィグレータCADのファイル形式
	 */
	cadFormat?: string;
	/**
	 * CADファイル識別
	 * - CADファイル識別
	 *   FIXCAD: 固定寸CAD
	 *   PT: コンフィグレータCAD
	 *   WEB2CAD: WEB2CAD
	 *   MCAD: メーカーCAD
	 *   PCAD: 金型CAD
	 */
	cadSection?: string;
	/**
	 * キャンペーン終了日
	 * - キャンペーン終了日
	 * - NOTE: YYYY/MM/DD形式
	 */
	campaignEndDate?: string;
	/**
	 * 通貨コード
	 * - 通貨コード
	 */
	currencyCode?: string;
}
