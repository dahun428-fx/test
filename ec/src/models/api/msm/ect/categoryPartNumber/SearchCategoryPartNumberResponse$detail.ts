import { MsmApiResponse, Flag } from '@misumi-org/msm-api-client-sdk';

/** カテゴリ型番検索APIレスポンス */
export interface SearchCategoryPartNumberResponse$detail
	extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索にヒットした総件数
	 * - example: 1022
	 * - field groups: @default, @search, @detail
	 */
	totalCount: number;
	/**
	 * ソート順指定フラグ
	 * - ソート順のプルダウンを指定するかどうか
	 *   0: 表示しない
	 *   1: 表示する
	 * - example: 1
	 * - field groups: @detail
	 */
	specSortFlag?: Flag;
	/**
	 * ソート順リスト
	 * - ソート順のプルダウンに表示する項目のリスト
	 *   2: 価格の安い順
	 *   5: 出荷日の早い順
	 * - example: ["2","5"]
	 * - field groups: @detail
	 */
	sortList: string[];
	/**
	 * 型番リスト
	 * - field groups: @detail
	 */
	partNumberList: PartNumber[];
	/**
	 * 在庫品情報
	 * - 在庫品情報
	 * - field groups: @default, @search, @detail
	 */
	stockItem: StockItem;
	/**
	 * 仕様・寸法リスト
	 * - 選択項目の一覧を表示
	 * - field groups: @default, @search, @detail
	 */
	partNumberSpecList: PartNumberSpec[];
	/**
	 * ステップリスト
	 * - field groups: @default, @search, @detail
	 */
	stepAreaList?: StepArea[];
	/**
	 * グループ項目リスト
	 * - field groups: @default, @search, @detail
	 */
	specGroupList?: SpecGroup[];
	/**
	 * ブランドリスト
	 * - メーカー絞り込みのスペック
	 * - field groups: @default, @search, @detail
	 * - NOTE: シリーズ件数が多い順で返却
	 */
	brandList: Brand[];
	/**
	 * C-Value情報
	 * - C-Value情報
	 * - field groups: @default, @search, @detail
	 */
	cValue?: CValue;
	/**
	 * 出荷日数リスト
	 * - 出荷日の選択状態
	 * - field groups: @default, @search, @detail
	 */
	daysToShipList: DaysToShip[];
	/**
	 * 通貨コード
	 * - 通貨コード
	 *   JPY: 日本円
	 *   RMB: 人民元
	 * - example: JPY
	 * - field groups: @default, @search, @detail
	 */
	currencyCode?: string;
}

/** 型番 */
export interface PartNumber {
	/**
	 * 型番確定フラグ
	 * - 型番が確定したかを表すフラグ
	 *   0:未確定
	 *   1:確定
	 * - example: 0
	 * - field groups: @detail
	 */
	completeFlag: Flag;
	/**
	 * シリーズコード
	 * - field groups: @detail
	 */
	seriesCode?: string;
	/**
	 * シリーズ名
	 * - field groups: @detail
	 */
	seriesName?: string;
	/**
	 * ブランドコード
	 * - field groups: @detail
	 */
	brandCode?: string;
	/**
	 * ブランド名
	 * - field groups: @detail
	 */
	brandName?: string;
	/**
	 * インナーコード
	 * - MDMの統合インナーコード
	 * - maxLength: 14
	 * - example: MDM00004097801
	 * - field groups: @detail
	 */
	innerCode?: string;
	/**
	 * インナー名
	 * - インナー名称
	 * - example: SFJタイプ軸径3
	 * - field groups: @detail
	 */
	innerName?: string;
	/**
	 * 基幹インナーコード
	 * - 基幹(ZETTA)のインナーコード
	 * - maxLength: 11
	 * - example: 30007000101
	 * - field groups: @detail
	 */
	zinnerCode?: string;
	/**
	 * 型番
	 * - 型番
	 * - example: SFJ3-[10-400/1]
	 * - field groups: @detail
	 */
	partNumber?: string;
	/**
	 * 内部型番
	 * - ACEチェック用型番
	 * - field groups: @detail
	 */
	internalPartNumber: string;
	/**
	 * 単純品フラグ
	 * - このインナーが単純品かどうか
	 *   0: 単純品でない(複雑品)
	 *   1: 単純品
	 * - example: 0
	 * - field groups: @detail
	 */
	simpleFlag: Flag;
	/**
	 * シリーズ画像
	 * - シリーズの画像一覧
	 * - field groups: @detail
	 */
	productImageList: ProductImage[];
	/**
	 * インナー画像
	 * - インナー別の画像(設定されている時のみ返却)
	 * - field groups: @detail
	 */
	innerImage?: InnerImage;
	/**
	 * 通常価格
	 * - 通常価格
	 * - example: 150
	 * - field groups: @detail
	 */
	standardUnitPrice?: number;
	/**
	 * キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その価格を返却
	 * - example: 100
	 * - field groups: @detail
	 */
	campaignUnitPrice?: number;
	/**
	 * キャンペーン終了日
	 * - キャンペーン値引きの日付が設定されている場合、その日付を返却
	 * - example: yyyy/mm/dd
	 * - field groups: @detail
	 */
	campaignEndDate?: string;
	/**
	 * スライド割引フラグ
	 * - スライド値引ありフラグ
	 *   0: スライド割引なし
	 *   1: スライド割引あり
	 *   数量スライド割引※詳細は別紙１を参照
	 * - maxLength: 1
	 * - example: 0
	 * - field groups: @detail
	 */
	volumeDiscountFlag: Flag;
	/**
	 * 最小通常出荷日
	 * - 通常出荷日数の最小値
	 * - example: 5
	 * - field groups: @detail
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日
	 * - 通常出荷日数の最大値
	 * - example: 5
	 * - field groups: @detail
	 */
	maxStandardDaysToShip?: number;
	/**
	 * 最小最短出荷日数
	 * - ストーク適用時の出荷日数の最小値
	 * - example: 3
	 * - field groups: @detail
	 */
	minShortestDaysToShip?: number;
	/**
	 * 最大最短出荷日数
	 * - ストーク適用時の出荷日数の最大値
	 * - example: 3
	 * - field groups: @detail
	 */
	maxShortestDaysToShip?: number;
	/**
	 * RoHSフラグ
	 * - RoHS対応かどうか
	 *   0: 未調査
	 *   1: RoHS6対応
	 *   2: RoHS10対応
	 *   9: 非対応
	 * - maxLength: 1
	 * - example: 0
	 * - field groups: @detail
	 */
	rohsFlag: Flag;
	/**
	 * 在庫品フラグ
	 * -   0: 在庫品でない
	 *   1: 在庫品である
	 * - maxLength: 1
	 * - example: 1
	 * - field groups: @detail
	 */
	stockItemFlag: Flag;
	/**
	 * パック品入数
	 * - パック品入数
	 * - example: 10
	 * - field groups: @detail
	 */
	piecesPerPackage?: number;
	/**
	 * 内容量
	 * - 商品の内容量(E999の値)
	 * - example: 1ケース（840ml×30本）
	 * - field groups: @detail
	 */
	content?: string;
	/**
	 * 最低発注数量
	 * - 注文を受け付ける最低数量
	 * - example: 1
	 * - field groups: @detail
	 */
	minQuantity?: number;
	/**
	 * 発注単位数量
	 * - 注文を受け付ける単位数量
	 * - example: 3000
	 * - field groups: @detail
	 */
	orderUnit?: number;
	/**
	 * 型番生成警告リスト
	 * - 型番生成時に表示される警告文のリスト
	 * - field groups: @detail
	 */
	partNumberCautionList: PartNumberCaution[];
	/**
	 * 型番注意文リスト
	 * - 型番確定時に表示される注意文のリスト
	 * - field groups: @detail
	 */
	partNumberNoticeList: PartNumberNotice[];
	/**
	 * 関連情報リスト
	 * - field groups: @detail
	 */
	relatedLinkList: RelatedLink[];
	/**
	 * 関連商品リスト
	 * - field groups: @detail
	 */
	relatedProductList?: RelatedProduct;
	/**
	 * デジタルブックPDFURL
	 * - PDFリンク表示のためのURL
	 * - example: //ドメイン名/book/THK1_04/digitalcatalog.html?page_num=A1-178
	 * - field groups: @detail
	 */
	digitalBookPdfUrl?: string;
	/**
	 * デジタルブックリスト
	 * - field groups: @detail
	 */
	digitalBookList?: DigitalBook[];
	/**
	 * アイコンタイプリスト
	 * - アイコンタイプリスト
	 * - field groups: @detail
	 */
	iconTypeList: IconType[];
	/**
	 * スペック値リスト
	 * - 型番ごとのスペック値のリスト
	 *   要素の並び順はスペック項目リストと同一
	 * - field groups: @detail
	 * - NOTE: 追加工項目で値が一意に定まっていないものかつユーザによって複数選択がされていないものを除外して返却する
	 */
	specValueList: PartNumberSpecValue[];
	/**
	 * 特別配送料有フラグ
	 * - 特別配送料の対象商品かどうか
	 *   0：特別配送料対象外
	 *   1：特別配送料対象
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	specialShipmentFlag?: Flag;
	cadTypeList: CadType[];
}

export interface CadType {
	cadType: string;
	cadTypeDisp: string;
}

export interface RelatedLink {
	/**
	 * 関連情報
	 * 関連情報が存在する場合に、以下のいずれかがセットされる
	 *　1: SDS(MSDS)
	 *　2: データシート
	 *　3: ミスミ定期便申し込み
	 *　4: サンプル品提供申し込み
	 * - example: 2
	 */
	relatedLinkType?: string;
	/**
	 * 関連情報表示文言
	 * - example: データシート
	 */
	relatedLinkTypeDisp?: string;
	/**
	 * 関連情報URL
	 * - example: http://www.nxp.com/documents/data_sheet/PCF8579.pdf
	 */
	relatedInfoUrl?: string;
}

/** インナー画像 */
export interface InnerImage {
	/**
	 * タイプ
	 * - 画像のタイプ
	 *   1: 通常画像
	 *   2: 拡大表示対応画像
	 * - example: 1
	 * - field groups: @detail
	 */
	type: string;
	/**
	 * URL
	 * - 画像のURL
	 * - example: http://ドメイン名/pic/pic0001.jpg
	 * - field groups: @detail
	 */
	url: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - field groups: @detail
	 */
	comment?: string;
}

/** 型番生成警告 */
export interface PartNumberCaution {
	/**
	 * 警告タイプ
	 * - 警告文のタイプ
	 *   1:型番生成不能
	 *   2:規格条件エラー
	 * - example: 1
	 * - field groups: @detail
	 */
	partNumberCautionType?: string;
	/**
	 * 警告文
	 * - 警告文の本文
	 * - example: 追加工(NA1・WA1)・(NC1・WC1)指定の時は、必ずPN寸を指定して下さい。
	 * - field groups: @detail
	 */
	partNumberCautionText?: string;
}

/** 型番注意文 */
export interface PartNumberNotice {
	/**
	 * 警告タイプ
	 * - 注意文のタイプ
	 *   1:チ方法CやL
	 *   2:規格式関連
	 *   3:型番未確定
	 * - example: 1
	 * - field groups: @detail
	 */
	partNumberNoticeType?: string;
	/**
	 * 警告文
	 * - 注意文の本文
	 * - example: 「*」の部分は、WOSご発注時に指定文字を入力し直して下さい。
	 * - field groups: @detail
	 */
	partNumberNoticeText?: string;
}

/** 関連商品 */
export interface RelatedProduct {
	/**
	 * シリーズコード
	 * - 関連商品のシリーズコード
	 * - example: 223005169941
	 * - field groups: @detail
	 */
	seriesCode?: string;
	/**
	 * シリーズ名
	 * - 関連商品のシリーズ名
	 * - example: 防塵マスク用 交換アルファリングフィルタRD-5型
	 * - field groups: @detail
	 */
	seriesName?: string;
	/**
	 * ブランドコード
	 * - 関連商品のブランドコード
	 * - example: KKN1
	 * - field groups: @detail
	 */
	brandCode?: string;
	/**
	 * ブランド名
	 * - 関連商品のブランド名
	 * - example: 興研
	 * - field groups: @detail
	 */
	brandName?: string;
	/**
	 * インナーコード
	 * - 関連商品のインナーコード
	 * - example: K9004980052
	 * - field groups: @detail
	 */
	innerCode?: string;
	/**
	 * 型番
	 * - 関連商品の型番
	 * - example: RD-5
	 * - field groups: @detail
	 */
	partNumber?: string;
	/**
	 * 商品画像リスト
	 * - 関連商品のインナー、シリーズ画像のリスト
	 *   インナー画像が定義されている場合はインナー画像をリストの先頭にセットする
	 * - field groups: @detail
	 */
	productImageList?: ProductImage[];
}

/** 商品画像 */
export interface ProductImage {
	/**
	 * タイプ
	 * - 画像のタイプ
	 *   1: 通常画像
	 *   2: 拡大表示対応画像
	 * - field groups: @detail
	 */
	type?: string;
	/**
	 * URL
	 * - 画像のURL
	 * - field groups: @detail
	 */
	url?: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - field groups: @detail
	 */
	comment?: string;
}

/** デジタルブック */
export interface DigitalBook {
	/**
	 * デジタルブック名
	 * - デジタルブックの名前
	 * - example: 商品TOP
	 * - field groups: @detail
	 */
	digitalBookName?: string;
	/**
	 * デジタルブックコード
	 * - デジタルブックのコード
	 * - example: MSM1_09
	 * - field groups: @detail
	 */
	digitalBookCode?: string;
	/**
	 * デジタルブックページ情報
	 * - デジタルブックのページ情報
	 * - example: 1-175
	 * - field groups: @detail
	 * - NOTE: 「-」がセットされている場合は、当該デジタルブックは空とする
	 */
	digitalBookPage?: string;
}

/** アイコンタイプ */
export interface IconType {
	/**
	 * アイコンタイプ
	 * - 型番のアイコン情報
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
	 *   1004: 関連商品あり
	 * - example: 4
	 * - field groups: @detail
	 */
	iconType?: string;
	/**
	 * アイコンタイプ表示文言
	 * - アイコンタイプ表示文言
	 * - field groups: @detail
	 */
	iconTypeDisp?: string;
}

/** スペック値 */
export interface PartNumberSpecValue {
	specName: string;
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - field groups: @detail
	 */
	specCode?: string;
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値。複数の場合はカンマで区切って指定)
	 * - example: D1020.12345!a
	 * - field groups: @detail
	 */
	specValue?: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言。スペック情報タイプが 1 のときにセットされる。
	 * - example: [鉄] SUJ2相当
	 * - field groups: @detail
	 */
	specValueDisp?: string;
	/**
	 * 元スペック値
	 * - 置換前のスペック値
	 * - example: p
	 * - field groups: @detail
	 */
	originalSpecValue?: string;
	/**
	 * 元スペック値表示文言
	 * - 置換前のスペック値の表示文言
	 * - example: 鉄
	 * - field groups: @detail
	 */
	originalSpecValueDisp?: string;
	/**
	 * データ取得元タイプ
	 * - スペック値のデータ取得元(データ基盤の定義元)を表す文字列
	 *   1: データシート
	 *   2: キーリスト
	 *   3: チェックマスタ
	 * - example: 1
	 * - field groups: @detail
	 */
	sourceType?: string;
	/**
	 * データ取得元タイプ表示文言
	 * - データ取得元タイプの表示文言
	 *   1: dataSheet
	 *   2: keylist
	 *   3: check
	 * - example: dataSheet
	 * - field groups: @detail
	 */
	sourceTypeDisp?: string;
}

/** 在庫品情報 */
export interface StockItem {
	/**
	 * 在庫品フラグ
	 * - 在庫品対象の指定
	 *   0: 指定しない
	 *   1: 指定する
	 * - field groups: @default, @search, @detail
	 */
	stockItemFlag: Flag;
	/**
	 * 非表示フラグ
	 * - field groups: @default, @search, @detail
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	selectedFlag: Flag;
}

/** 仕様・寸法 */
export interface PartNumberSpec {
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - example: E01
	 * - field groups: @default, @search, @detail
	 */
	specCode: string;
	/**
	 * 追加工フラグ
	 * - C項目追加工の場合に設定
	 *   0: C項目追加工以外のスペック
	 *   1: C項目追加工
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	alterationFlag?: Flag;
	/**
	 * スペック項目名
	 * - スペック項目名
	 * - example: 長さ
	 * - field groups: @default, @search, @detail
	 */
	specName: string;
	/**
	 * スペック項目単位
	 * - スペック項目の単位
	 * - example: mm
	 * - field groups: @default, @search, @detail
	 */
	specUnit: string;
	/**
	 * スペック項目表示タイプ
	 * - スペックの表示種別
	 *   8:数値入力形式
	 *   9:リスト選択形式
	 *   11:数値集約形式
	 *   13.テキスト選択形式（3列）
	 *   14.テキスト選択形式（6列）
	 *   15.テキスト選択形式（9列）
	 *   16.イラスト選択形式（2列）
	 *   17.イラスト選択形式（4列）
	 *   18.イラスト選択形式（6列）
	 *   19:ツリー(入れ子)選択形式（3列）
	 *   20:ツリー(入れ子)選択形式（6列）
	 *   21:プルダウン選択形式
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	specViewType: string;
	/**
	 * 補足表示タイプ
	 * - スペックの補足表示種別
	 *   1: 通常
	 *   2: 外形図
	 *   3: 詳細
	 *   4: 拡大
	 *   5: イラスト
	 * - example: 2
	 * - field groups: @default, @search, @detail
	 * - NOTE: 4,5の場合はスペック値画像URLの画像を用いる
	 */
	supplementType: string;
	/**
	 * 外形図画像URL
	 * - 外形図ダイアログで表示する画像のURL
	 * - example: //xxx/illustration/press/P010105_C3_F.png
	 * - field groups: @default, @search, @detail
	 */
	specImageUrl?: string;
	/**
	 * スペック説明画像URL
	 * - スペックの説明画像のURL
	 * - field groups: @default, @search, @detail
	 */
	specDescriptionImageUrl?: string;
	/**
	 * スペック注意喚起文
	 * - 注意喚起文の本文
	 * - field groups: @default, @search, @detail
	 */
	specNoticeText: string;
	/**
	 * 数値入力項目
	 * - 数値入力項目
	 * - field groups: @default, @search, @detail
	 */
	numericSpec: NumericSpec;
	/**
	 * スペック値リスト
	 * - field groups: @default, @search, @detail
	 */
	specValueList: SpecValue[];
	/**
	 * 表示順
	 * - スペック項目の表示順
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	displayOrder: number;
}

/** 数値入力項目 */
export interface NumericSpec {
	/**
	 * 非表示フラグ
	 * - 数値入力項目を表示するかどうか
	 *   0: 表示する
	 *   1: 表示しない
	 * - field groups: @default, @search, @detail
	 */
	hiddenFlag: Flag;
	/**
	 * スペック値
	 * - 数値入力形式のテキストフィールドに表示する値(リクエスト値)
	 * - example: 100
	 * - field groups: @default, @search, @detail
	 */
	specValue?: string;
	/**
	 * 数値範囲リスト
	 * - 数値範囲の選択範囲
	 * - field groups: @default, @search, @detail
	 */
	specValueRangeList: SpecValueRange[];
}

/** 数値範囲 */
export interface SpecValueRange {
	/**
	 * 最小値
	 * - 指定可能な最小値
	 * - example: 1.0
	 * - field groups: @default, @search, @detail
	 */
	minValue?: number;
	/**
	 * 最大値
	 * - 指定可能な最大値
	 * - example: 9.5
	 * - field groups: @default, @search, @detail
	 */
	maxValue?: number;
	/**
	 * 刻み値
	 * - 値の刻み幅
	 * - example: 0.5
	 * - field groups: @default, @search, @detail
	 */
	stepValue?: number;
}

/** スペック値 */
export interface SpecValue {
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値)
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	specValue: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言
	 * - example: 鉄
	 * - field groups: @default, @search, @detail
	 */
	specValueDisp: string;
	/**
	 * スペック値画像URL
	 * - スペック値の画像URL
	 * - field groups: @default, @search, @detail
	 */
	specValueImageUrl: string;
	/**
	 * 非表示フラグ
	 * - field groups: @default, @search, @detail
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みのスペック値の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	selectedFlag: Flag;
	/**
	 * 子スペック値リスト
	 * - 2段表示のスペック値リスト
	 * - field groups: @default, @search, @detail
	 */
	childSpecValueList: ChildSpecValue[];
}

export interface ChildSpecValue {
	specValue: string;
	hiddenFlag: Flag;
	selectedFlag: Flag;
	specValueDisp: string;
}

/** ステップ */
export interface StepArea {
	/**
	 * ステップ項目名
	 * - field groups: @default, @search, @detail
	 */
	stepAreaName?: string;
	/**
	 * ステップ補足説明文
	 * - field groups: @default, @search, @detail
	 */
	stepAreaAdditionalExplanation?: string;
	/**
	 * ステップ補足リンク
	 * - field groups: @default, @search, @detail
	 */
	stepAreaAdditionalLink?: string;
	/**
	 * ステップ補足リンクテキスト
	 * - リンクのテキスト部分
	 * - field groups: @default, @search, @detail
	 */
	stepAreaAdditionalLinkDisp?: string;
	/**
	 * 開閉状態
	 * - 表示の開閉状態
	 *   1: 開く
	 *   2: 閉じる
	 *   3: 開閉ボタン非表示
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	openCloseType?: string;
	/**
	 * 必須フラグ
	 * - 選択が必須の場合に設定
	 *   0: オプション
	 *   1: 必須
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	requiredFlag?: Flag;
	/**
	 * グループ, スペック項目情報リスト
	 * - field groups: @default, @search, @detail
	 */
	itemList?: Item[];
}

/** グループ, スペック項目情報 */
export interface Item {
	/**
	 * 種別
	 * - 項目コードが何を表すのかを表現する
	 *   g:グループコード
	 *   s:スペックコード
	 * - field groups: @default, @search, @detail
	 */
	itemType?: string;
	/**
	 * 項目コード
	 * - 上記の種別によって変わる
	 * - example: E01
	 * - field groups: @default, @search, @detail
	 */
	itemCode?: string;
}

/** グループ項目 */
export interface SpecGroup {
	/**
	 * グループコード
	 */
	groupCode?: string;
	/**
	 * グループ項目名
	 * - field groups: @default, @search, @detail
	 */
	groupName?: string;
	/**
	 * グループ説明画像
	 * - field groups: @default, @search, @detail
	 */
	groupImageUrl?: string;
	/**
	 * グループ注意文
	 * - field groups: @default, @search, @detail
	 */
	groupAdditionalExplanation?: string;
	/**
	 * グループ項目リンク
	 * - field groups: @default, @search, @detail
	 */
	groupAdditionalLink?: string;
	/**
	 * グループ項目リンクテキスト
	 * - リンクのテキスト部分
	 * - field groups: @default, @search, @detail
	 */
	groupAdditionalLinkDisp?: string;
	/**
	 * スペックコード項目情報リスト
	 * - スペック項目のコードのリスト
	 * - example: E01
	 * - field groups: @default, @search, @detail
	 */
	// TODO: Confirm API docs
	// specCodeList?: SpecCode[];
	specCodeList?: string[];

	groupImageOpenCloseType: '1' | '2' | '3';
}

/** スペックコード項目情報 */
export interface SpecCode {}

/** ブランド */
export interface Brand {
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - example: THK1
	 * - field groups: @default, @search, @detail
	 */
	brandCode: string;
	/**
	 * ブランドURLコード
	 * - ブランドURLコード(登録されている場合のみ)
	 * - field groups: @default, @search, @detail
	 */
	brandUrlCode?: string;
	/**
	 * ブランド名
	 * - ブランド名
	 * - example: THK
	 * - field groups: @default, @search, @detail
	 */
	brandName: string;
	/**
	 * 非表示フラグ
	 * - field groups: @default, @search, @detail
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	selectedFlag: Flag;
}

/** C-Value情報 */
export interface CValue {
	/**
	 * C-Valueフラグ
	 * - C-Value対象の指定(ミスミ品の場合)
	 *   0: C-valueなし
	 *   1: C-valueあり
	 * - field groups: @default, @search, @detail
	 */
	cValueFlag?: Flag;
	/**
	 * 非表示フラグ
	 * - field groups: @default, @search, @detail
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	selectedFlag?: Flag;
}

/** 出荷日数 */
export interface DaysToShip {
	/**
	 * 出荷日数
	 * - 出荷までの実働日数
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 * - maxLength: 3
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	daysToShip: number;
	/**
	 * 非表示フラグ
	 * - field groups: @default, @search, @detail
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	selectedFlag: Flag;
}
