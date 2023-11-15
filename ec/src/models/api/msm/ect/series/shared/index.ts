import { IconType as IconTypeEnum } from '@/models/api/constants/IconType';

/** 問い合わせ先情報 */
export interface Contact {
	/**
	 * 問い合わせ先名
	 * - 問い合わせ先名称
	 * - example: FAメカニカル事業部
	 * - field groups: @detail, @unit, @box
	 */
	contactName?: string;
	/**
	 * TEL
	 * - 問い合わせ先TEL番号
	 * - example: 03-5805-7290/7291
	 * - field groups: @detail, @unit, @box
	 */
	tel?: string;
	/**
	 * FAX
	 * - 問い合わせ先FAX番号
	 * - example: 03-5805-7292
	 * - field groups: @detail, @unit, @box
	 */
	fax?: string;
	/**
	 * 受付時間
	 * - 問い合わせ先受付時間
	 * - example: 9:00～12:00、13:00～18:00　（日曜日・年末年始は除く）
	 * - field groups: @detail, @unit, @box
	 */
	receptionTime?: string;
}
/** デジタルブック */
export interface DigitalBook {
	/**
	 * デジタルブック名
	 * - デジタルブックの名前
	 * - example: 商品TOP
	 * - field groups: @detail, @unit, @box
	 */
	digitalBookName?: string;
	/**
	 * デジタルブックコード
	 * - デジタルブックのコード
	 * - example: MSM1_09
	 * - field groups: @detail, @unit, @box
	 * - NOTE: 外部設計書上、optional だが API 実装を見ると required
	 * https://repo.tools.misumi.jp/projects/EC/repos/ect-api/browse/src/main/java/com/misumi_ec/ect_api/utils/SeriesUtil.java?until=df7b8ae00bf89379da2bbbe40eacb11ee911b65a&untilPath=src%2Fmain%2Fjava%2Fcom%2Fmisumi_ec%2Fect_api%2Futils%2FSeriesUtil.java#1194
	 */
	digitalBookCode: string;
	/**
	 * デジタルブックページ情報
	 * - デジタルブックのページ情報
	 * - example: 1-175
	 * - field groups: @detail, @unit, @box
	 * - NOTE: 「-」がセットされている場合は、当該デジタルブックは空とする（「-」のデジタルブックはAPI側で対象外としているため返却されない）
	 * - NOTE: 外部設計書上、optional だが API 実装を見ると required
	 * https://repo.tools.misumi.jp/projects/EC/repos/ect-api/browse/src/main/java/com/misumi_ec/ect_api/utils/SeriesUtil.java?until=df7b8ae00bf89379da2bbbe40eacb11ee911b65a&untilPath=src%2Fmain%2Fjava%2Fcom%2Fmisumi_ec%2Fect_api%2Futils%2FSeriesUtil.java#1194
	 */
	digitalBookPage: string;
}
/** アイコンタイプ */
export interface IconType {
	/**
	 * アイコンタイプ
	 * - シリーズのアイコン情報
	 *   1: 新商品
	 *   2: 脱脂洗浄
	 *   3: 規格拡大
	 *   4: 規格変更
	 *   5: 価格改定
	 *   6: 値下げ
	 *   7: 納期短縮
	 *   8: 規格拡張対象
	 *   1000: 数量スライド割引
	 *   1001: 定期便対象
	 *   1002: サンプル品対象
	 *   1003: SDS(MSDS)
	 * - example: 4
	 * - field groups: @search, @detail, @unit, @box
	 * - NOTE: 定期便対象、サンプル品対象については、型番別PDF表示マスタ(displayLinkByInner.tsv)で、link_title の値が「ミスミ定期便申込み」、「サンプル提供申込み」がある場合に表示する
	 */
	iconType?: IconTypeEnum;
	/**
	 * アイコンタイプ表示文言
	 * - シリーズのアイコン情報の表示文言
	 * - example: 4
	 * - field groups: @search, @detail, @unit, @box
	 * - NOTE: 定期便対象、サンプル品対象については、型番別PDF表示マスタ(displayLinkByInner.tsv)で、link_title の値が「ミスミ定期便申込み」、「サンプル提供申込み」がある場合に表示する
	 */
	iconTypeDisp?: string;
}
/** MSDS */
export interface Msds {
	/**
	 * 商品コード
	 * - 商品コード
	 * - example: SFJ3
	 * - field groups: @detail, @unit, @box
	 */
	productCode?: string;
	/**
	 * URL
	 * - MSDSのURL
	 * - example: //jp.misumi-ec.com/pdf/sds/japan/MSM1_SFJ3.pdf
	 * - field groups: @detail, @unit, @box
	 */
	url?: string;
}
/** ピクト */
export interface Pict {
	/**
	 * ピクト
	 * - ピクトの文言
	 * - example: 大口分納
	 * - field groups: @search, @detail, @unit, @box
	 */
	pict?: string;
	/**
	 * ピクトコメント
	 * - ピクトのコメント
	 * - example: 大口数量を“お得な価格”で分納にてお届け致します。
	 * - field groups: @search, @detail, @unit, @box
	 */
	pictComment?: string;
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
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	type: string;
	/**
	 * URL
	 * - 画像のURL
	 * - example: //misumi.scene7.com/is/image/misumi/110300004660_20149999_m_01_99999_jp
	 * - field groups: @default, @search, @detail, @unit, @box
	 */
	url: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - example: MEB2211
	 * - field groups: @default, @search, @detail, @unit, @box
	 * - NOTE: 画像ごとの説明文が存在しない場合は、シリーズ名称を設定する
	 */
	comment?: string;
}
/** CADタイプ */
export interface SeriesCadType {
	/**
	 * CADタイプ
	 * - CADの種別
	 *   1: 2D
	 *   2: 3D
	 * - example: 1
	 * - field groups: @search, @detail, @unit, @box
	 */
	cadType?: string;
	/**
	 * CADタイプ表示文言
	 * - CAD種別の表示文言
	 * - example: 2D
	 * - field groups: @search, @detail, @unit, @box
	 */
	cadTypeDisp?: string;
}
/** スペック項目 */
export interface Spec {
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - example: E01
	 * - field groups: @search, @detail
	 */
	specCode: string;
	/**
	 * 表示用スペックコード
	 * - 表示用のスペックコード
	 * - example: C3
	 * - field groups: @search, @detail
	 */
	specCodeDisp?: string;
	/**
	 * スペック項目名
	 * - スペック項目の名称
	 * - example: 材質
	 * - field groups: @search, @detail
	 * - NOTE: チェックマスタに存在するが新管理で登録されていない場合など、スペック名が取得できない場合は「その他選択」という名称を返却する
	 */
	specName: string;
	/**
	 * スペック項目単位
	 * - 数値の単位
	 * - example: mm
	 * - field groups: @search, @detail
	 */
	specUnit?: string;
	/**
	 * スペック項目タイプ
	 * - スペック項目のタイプ
	 *   1: C項目
	 *   2: D項目
	 *   3: E項目
	 * - field groups: @search, @detail
	 */
	specType: string;
}
/** 基本情報スペック値 */
export interface StandardSpecValue {
	/**
	 * スペック項目コード
	 * - 基本情報のスペック項目コード
	 * - field groups: @detail, @unit
	 */
	specCode?: string;
	/**
	 * スペック値
	 * - 基本情報のスペック値(コード or 値)
	 * - field groups: @detail, @unit
	 */
	specValue?: string;
	/**
	 * スペック値表示文言
	 * - 基本情報のスペック値の表示文言
	 * - example: ストレート
	 * - field groups: @detail, @unit
	 */
	specValueDisp?: string;
}

/** Tab type */
export const TabType = {
	MECH_A: '1',
	MECH_B: '2',
	ELE_A: '3',
	ELE_B: '4',
	PRESS_MOLD_A: '5',
	PRESS_MOLD_B: '6',
	TOOL_FS_A: '7',
	TOOL_FS_B: '8',
	VONA: '9',
} as const;
export type TabType = typeof TabType[keyof typeof TabType];
