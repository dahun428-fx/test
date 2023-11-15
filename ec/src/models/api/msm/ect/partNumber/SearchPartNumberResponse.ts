import { Flag } from '@/models/api/Flag';
import SimilarSearchType from '@/models/api/constants/SimilarSearchType';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 型番検索APIレスポンス */
export interface SearchPartNumberResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索にヒットした総件数
	 * - example: 1022
	 * - field groups: @search
	 */
	totalCount: number;
	/**
	 * 型番確定フラグ
	 * - 型番が確定したかを表すフラグ
	 *   0:未確定
	 *   1:確定
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	completeFlag: Flag;
	/**
	 * ユニット品存在確定フラグ
	 * - ユニット品が存在し、一意に確定したかを表すフラグ
	 *   0:未確定
	 *   1:存在し、確定(検索結果の型番すべてが同一のユニット品)
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	unitProductFlag: Flag;
	/**
	 * スペック項目リスト
	 * - 型番リスト、指定中の仕様・寸法情報、類似品検索で使用するスペック項目のリスト
	 * - field groups: @search, @detail
	 */
	specList?: Spec[];
	/**
	 * 規制項目リスト
	 * - 貿易コンプラから連携された商品の規制情報
	 * - field groups: @search, @detail
	 * - NOTE: シリーズ内で使用されている項目のみ返却
	 */
	regulationList?: Regulation[];
	/**
	 * 型番リスト
	 * - field groups: @default, @search, @detail
	 */
	partNumberList: PartNumber[];
	/**
	 * CAD IDリスト
	 * - 絞りこまれた型番に紐づくCAD情報のIDのリスト。
	 *   CADデータ取得時、プレビュー時に指定する。
	 * - example: [10000000449,10000000459]
	 * - field groups: @search
	 */
	cadIdList?: string[];
	/**
	 * 単純品スペック項目コードリスト
	 * - 単純品テンプレート時に使用するスペック項目を指定するためのリスト。
	 *   見出しは「型番絞り込み候補情報.仕様・寸法リスト」の該当するコードのスペック名およびスペック値(ブルダウン内)を使用し、各型番のスペック値は「型番情報.型番リスト.スペック値リスト」の該当するコードの値を使用する
	 * - example: [C001,C003,D001,C004]
	 * - field groups: @search, @detail
	 */
	simpleProductSpecCodeList?: string[];
	/**
	 * 進捗ガイド数
	 * - 矢羽根の母数
	 * - example: 10
	 * - field groups: @search
	 */
	maxGuideCount: number;
	/**
	 * 進捗状況数
	 * - 絞込み状況を表す矢羽根数
	 * - example: 5
	 * - field groups: @search
	 */
	guideCount: number;
	/**
	 * ユニットコードリスト
	 * - コンベヤの部材品を特定するためのユニットコード
	 * - example: 018256445568
	 * - field groups: @default, @search, @detail
	 */
	unitCodeList?: string[];
	/**
	 * 在庫品情報
	 * - 在庫品情報
	 * - field groups: @search
	 * - NOTE: 別紙３参照
	 */
	stockItem: StockItem;
	/**
	 * 仕様・寸法リスト
	 * - 選択項目の一覧を表示
	 * - field groups: @search
	 */
	partNumberSpecList: PartNumberSpec[];
	/**
	 * グループ項目リスト
	 * - 並列で表示するスペック項目のリスト
	 * - field groups: @search
	 */
	groupSpecList: GroupSpec[];
	/**
	 * 追加工注意喚起文
	 * - 追加工領域の上部に表示される注意喚起文
	 * - field groups: @search
	 */
	alterationNoticeText?: string;
	/**
	 * 追加工スペックリスト
	 * - 追加工が存在する場合に一覧を表示
	 * - field groups: @search
	 */
	alterationSpecList: AlterationSpec[];
	/**
	 * CADタイプリスト
	 * - CADの選択状態
	 * - example: 1,2
	 * - field groups: @search
	 */
	cadTypeList: CadType[];
	/**
	 * 出荷日数リスト
	 * - 出荷日の選択状態
	 * - field groups: @search
	 */
	daysToShipList: DaysToShip[];
	/**
	 * ドリルダウンスペックリスト
	 * - ドリルダウンで表示するスペックのリスト
	 * - field groups: @search
	 */
	drillDownSpecList?: DrillDownSpec[];
	/**
	 * スペックグループリスト
	 * - スペックグループのリスト
	 * - field groups: @search
	 */
	partNumberSpecGroupList?: PartNumberSpecGroup[];
	/**
	 * 追加工スペックグループリスト
	 * - 追加工スペックグループのリスト
	 * - field groups: @search
	 */
	alterationSpecGroupList?: AlterationSpecGroup[];
	/**
	 * 通貨コード
	 * - 通貨コード
	 *   JPY: 日本円
	 *   RMB: 人民元
	 * - example: JPY
	 * - field groups: @search, @detail
	 */
	currencyCode?: string;
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
	 * - 表示用のスペック項目コード
	 * - example: C3
	 * - field groups: @search, @detail
	 * - NOTE: 旧ECマネージャで登録していた項目連番
	 */
	specCodeDisp?: string;
	/**
	 * CAD用スペック項目コード
	 * - CAD用のスペック項目コード
	 * - example: material
	 * - field groups: @search, @detail
	 * - NOTE: SINUSでのCADデータ生成時に使用
	 */
	cadSpecCode?: string;
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
	 *   4: E999項目
	 * - example: 1
	 * - field groups: @search, @detail
	 */
	specType: string;
	/**
	 * 基本情報フラグ
	 * - 基本情報のスペック項目かどうか
	 *   0: 基本情報でない(型番リストに表示する)
	 *   1: 基本情報(型番リストに表示しない)
	 * - example: 1
	 * - field groups: @search, @detail
	 */
	standardSpecFlag: Flag;
	/**
	 * 類似品検索タイプ
	 * - 類似品検索で使用するスペック項目かどうか
	 *   1: 使用する(デフォルトチェックあり)
	 *   2: 使用する(デフォルトチェックなし)
	 *   3: 使用しない
	 * - example: 1
	 * - field groups: @search, @detail
	 */
	similarSearchType: SimilarSearchType;
}

/** 規制項目 */
export interface Regulation {
	/**
	 * 規制コード
	 * - 規制情報のコード値
	 * - field groups: @search, @detail
	 */
	regulationCode: string;
	/**
	 * 規制名
	 * - 規制情報の項目名
	 * - field groups: @search, @detail
	 */
	regulationName: string;
}

/** 型番 */
export interface PartNumber {
	/**
	 * インナーコード
	 * - MDMの統合インナーコード
	 * - maxLength: 14
	 * - example: MDM00004097801
	 * - field groups: @default, @search, @detail
	 */
	innerCode?: string;
	/**
	 * インナー名
	 * - インナー名称
	 * - example: SFJタイプ軸径3
	 * - field groups: @default, @search, @detail
	 */
	innerName?: string;
	/**
	 * 基幹インナーコード
	 * - 基幹(ZETTA)のインナーコード
	 * - maxLength: 11
	 * - example: 30007000101
	 * - field groups: @default, @search, @detail
	 */
	zinnerCode?: string;
	/**
	 * 型番
	 * - 型番
	 * - example: SFJ3-[10-400/1]
	 * - field groups: @default, @search, @detail
	 */
	partNumber?: string;
	/**
	 * UFフラグ
	 * - field groups: ?
	 * - WARN: 外部設計書に掲載されていない項目です。
	 */
	unfitFlag?: Flag;
	/**
	 * 型番確定タイプ
	 * - 型番確定タイプ
	 *   2: タイプまで確定済み
	 *   3: インナーまで確定済み (未確定スペックあり)
	 *   4: フル型番確定済み
	 *   5: フル型番未確定かつ追加工を指定
	 *   6: フル型番確定済みかつ追加工を指定
	 * - field groups: ?
	 * - WARN: 外部設計書に掲載されていない項目です。型番サジェストAPIの確定タイプ completeType とは異なります。取り得る値は正確には不明です。
	 */
	fixedType?: string;
	/**
	 * 確定情報
	 * - field groups: @default, @search, @detail
	 */
	fixedInfo?: string;
	/**
	 * 内部型番
	 * - ACEチェック用型番
	 * - field groups: @default, @search, @detail
	 */
	internalPartNumber: string;
	/**
	 * 商品コード
	 * - 商品コード
	 * - field groups: @default, @search, @detail
	 */
	productCode: string;
	/**
	 * タイプコード
	 * - タイプコード
	 * - field groups: @default, @search, @detail
	 */
	typeCode?: string;
	/**
	 * 単純品フラグ
	 * - このインナーが単純品かどうか
	 *   0: 単純品でない(複雑品)
	 *   1: 単純品
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	simpleFlag: Flag;
	/**
	 * インナー画像
	 * - インナー別の画像(設定されている時のみ返却)
	 * - field groups: @default, @search, @detail
	 */
	innerImage?: InnerImage;
	/**
	 * 通常価格
	 * - 通常価格
	 * - example: 150
	 * - field groups: @default, @search, @detail
	 */
	standardUnitPrice?: number;
	/**
	 * キャンペーン単価
	 * - キャンペーン値引きが設定されている場合、その価格を返却
	 * - example: 100
	 * - field groups: @default, @search, @detail
	 */
	campaignUnitPrice?: number;
	/**
	 * キャンペーン終了日
	 * - キャンペーン値引きの日付が設定されている場合、その日付を返却
	 * - example: yyyy/mm/dd
	 * - field groups: @default, @search, @detail
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
	 * - field groups: @default, @search, @detail
	 */
	volumeDiscountFlag: Flag;
	/**
	 * 最小通常出荷日
	 * - 通常出荷日数の最小値
	 * - example: 5
	 * - field groups: @default, @search, @detail
	 */
	minStandardDaysToShip?: number;
	/**
	 * 最大通常出荷日
	 * - 通常出荷日数の最大値
	 * - example: 5
	 * - field groups: @default, @search, @detail
	 */
	maxStandardDaysToShip?: number;
	/**
	 * 最小最短出荷日数
	 * - ストーク適用時の出荷日数の最小値
	 * - example: 3
	 * - field groups: @default, @search, @detail
	 */
	minShortestDaysToShip?: number;
	/**
	 * 最大最短出荷日数
	 * - ストーク適用時の出荷日数の最大値
	 * - example: 3
	 * - field groups: @default, @search, @detail
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
	 * - field groups: @default, @search, @detail
	 */
	rohsFlag: Flag;
	/**
	 * 在庫品フラグ
	 * -   0: 在庫品でない
	 *   1: 在庫品である
	 * - maxLength: 1
	 * - example: 1
	 * - field groups: @search, @detail
	 */
	stockItemFlag: Flag;
	/**
	 * パック品入数
	 * - パック品入数
	 * - example: 10
	 * - field groups: @default, @search, @detail
	 */
	piecesPerPackage?: number;
	/**
	 * 内容量
	 * - 商品の内容量(E999の値)
	 * - example: 1ケース（840ml×30本）
	 * - field groups: @default, @search, @detail
	 */
	content?: string;
	/**
	 * 最低発注数量
	 * - 注文を受け付ける最低数量
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	minQuantity?: number;
	/**
	 * 発注単位数量
	 * - 注文を受け付ける単位数量
	 * - example: 3000
	 * - field groups: @default, @search, @detail
	 */
	orderUnit?: number;
	/**
	 * 規格廃止品フラグ
	 * - 規格廃止品フラグ
	 *   0: 規格廃止品でない
	 *   1: 規格廃止品
	 * - example: 0
	 * - field groups: @default, @search, @detail
	 */
	discontinuedProductFlag?: Flag;
	/**
	 * 規格廃止日
	 * - 規格廃止日
	 * - example: yyyy/mm/dd
	 * - field groups: @default, @search, @detail
	 */
	discontinuedDate?: string;
	/**
	 * 代替品メッセージ
	 * - field groups: @default, @search, @detail
	 */
	alternativeMessage?: string;
	/**
	 * 型番生成警告リスト
	 * - 型番生成時に表示される警告文のリスト
	 * - field groups: @default, @search, @detail
	 * - NOTE: 基本的に、このリストがある場合はcompleteFlagが立たない
	 */
	partNumberCautionList: PartNumberCaution[];
	/**
	 * 型番注意文リスト
	 * - 型番確定時に表示される注意文のリスト
	 * - field groups: @default, @search, @detail
	 * - NOTE: completeFlagに関わらず、ユーザに注意を換気する。
	 *         チ方法C、および、注文補足の文言がセットされる
	 */
	partNumberNoticeList: PartNumberNotice[];
	/**
	 * 関連情報リスト
	 * - field groups: @default, @search, @detail
	 */
	relatedLinkList: RelatedLink[];
	/**
	 * 関連商品リスト
	 * - field groups: @default, @search, @detail
	 */
	relatedProductList?: RelatedProduct;
	/**
	 * アイコンタイプリスト
	 * - アイコンタイプリスト
	 * - field groups: @default, @search, @detail
	 */
	iconTypeList: IconType[];
	/**
	 * CADタイプリスト
	 * - CADの種別
	 * - field groups: @default, @search, @detail
	 */
	cadTypeList: PartNumberCadType[];
	/**
	 * スペック値リスト
	 * - 型番ごとのスペック値のリスト
	 *   要素の並び順はスペック項目リストと同一
	 * - field groups: @default, @search, @detail
	 * - NOTE: 値が無い場合は返却しない
	 */
	specValueList: PartNumberSpecValue[];
	/**
	 * ユニットコード(仮)
	 * - コンベヤの部材品を特定するためのユニットコード。
	 *   統合インナーコードを利用。
	 * - maxLength: 14
	 * - example: MDM00001066213
	 * - field groups: @default, @search, @detail
	 */
	unitCode?: string;
	/**
	 * 即納配送可フラグ
	 * - 即納対応可能かどうか(中国のみ)
	 *   0: 非対応
	 *   1: 対応
	 * - example: 1
	 * - field groups: @search, @detail
	 */
	promptDeliveryFlag?: Flag;
	/**
	 * 規制値リスト
	 * - 各インナーの規制情報
	 * - field groups: @search, @detail
	 */
	regulationValueList?: RegulationValue[];
	/**
	 * 特別配送料有フラグ
	 * - 特別配送料の対象商品かどうか
	 *   0：特別配送料対象外
	 *   1：特別配送料対象
	 * - example: １
	 * - field groups: @default, @search, @detail
	 */
	specialShipmentFlag?: Flag;
}

/** インナー画像 */
export interface InnerImage {
	/**
	 * タイプ
	 * - 画像のタイプ
	 *   1: 通常画像
	 *   2: 拡大表示対応画像
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	type: string;
	/**
	 * URL
	 * - 画像のURL
	 * - example: http://ドメイン名/pic/pic0001.jpg
	 * - field groups: @default, @search, @detail
	 */
	url: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - field groups: @default, @search, @detail
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
	 * - field groups: @default, @search, @detail
	 */
	partNumberCautionType?: string;
	/**
	 * 警告文
	 * - 警告文の本文
	 * - example: 追加工(NA1・WA1)・(NC1・WC1)指定の時は、必ずPN寸を指定して下さい。
	 * - field groups: @default, @search, @detail
	 */
	partNumberCautionText?: string;
}

/** 関連情報 */
export interface RelatedLink {
	/**
	 * 関連情報
	 * - 関連情報が存在する場合に、以下のいずれかがセットされる
	 *   1: SDS(MSDS)
	 *   2: データシート
	 *   3: ミスミ定期便申し込み
	 *   4: サンプル品提供申し込み
	 * - example: 2
	 * - field groups: @default, @search, @detail
	 */
	relatedLinkType?: string;
	/**
	 * 関連情報表示文言
	 * - 関連情報表示文言
	 * - example: データシート
	 * - field groups: @default, @search, @detail
	 */
	relatedLinkTypeDisp?: string;
	/**
	 * 関連情報URL
	 * - 関連情報のURL
	 * - example: http://www.nxp.com/documents/data_sheet/PCF8579.pdf
	 * - field groups: @default, @search, @detail
	 */
	relatedInfoUrl?: string;
}

/** 型番注意文 */
export interface PartNumberNotice {
	/**
	 * 警告タイプ
	 * - 注意文のタイプ
	 *   1:チ方法CやL
	 *   2:規格式関連
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	partNumberNoticeType?: string;
	/**
	 * 警告文
	 * - 注意文の本文
	 * - example: 「*」の部分は、WOSご発注時に指定文字を入力し直して下さい。
	 * - field groups: @default, @search, @detail
	 */
	partNumberNoticeText?: string;
}

/** 関連商品 */
export interface RelatedProduct {
	/**
	 * シリーズコード
	 * - 関連商品のシリーズコード
	 * - example: 223005169941
	 * - field groups: @default, @search, @detail
	 */
	seriesCode?: string;
	/**
	 * シリーズ名
	 * - 関連商品のシリーズ名
	 * - example: 防塵マスク用 交換アルファリングフィルタRD-5型
	 * - field groups: @default, @search, @detail
	 */
	seriesName?: string;
	/**
	 * ブランドコード
	 * - 関連商品のブランドコード
	 * - example: KKN1
	 * - field groups: @default, @search, @detail
	 */
	brandCode?: string;
	/**
	 * ブランド名
	 * - 関連商品のブランド名
	 * - example: 興研
	 * - field groups: @default, @search, @detail
	 */
	brandName?: string;
	/**
	 * インナーコード
	 * - 関連商品のインナーコード
	 * - example: K9004980052
	 * - field groups: @default, @search, @detail
	 */
	innerCode?: string;
	/**
	 * 型番
	 * - 関連商品の型番
	 * - example: RD-5
	 * - field groups: @default, @search, @detail
	 */
	partNumber?: string;
	/**
	 * 商品画像リスト
	 * - 関連商品のインナー、シリーズ画像のリスト
	 *   インナー画像が定義されている場合はインナー画像をリストの先頭にセットする
	 * - field groups: @default, @search, @detail
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
	 * - field groups: @default, @search, @detail
	 */
	type?: string;
	/**
	 * URL
	 * - 画像のURL
	 * - field groups: @default, @search, @detail
	 */
	url?: string;
	/**
	 * 説明文
	 * - 画像の説明文
	 * - field groups: @default, @search, @detail
	 */
	comment?: string;
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
	 * - field groups: @default, @search, @detail
	 * - NOTE: 定期便対象、サンプル品対象については、型番別PDF表示マスタ(displayLinkByInner.tsv)で、link_title の値が「ミスミ定期便申込み」、「サンプル提供申込み」がある場合に表示する
	 */
	iconType?: string;
	/**
	 * アイコンタイプ表示文言
	 * - アイコンタイプ表示文言
	 * - field groups: @default, @search, @detail
	 */
	iconTypeDisp?: string;
}

/**
 * CADタイプ
 *
 * NOTE: 型番リスト内で使用されるCADタイプ
 */
export interface PartNumberCadType {
	/**
	 * CADタイプ
	 * - CADの種別
	 *   1: 2D
	 *   2: 3D
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 */
	cadType?: string;
	/**
	 * CADタイプ表示文言
	 * - CAD種別の表示文言
	 * - example: 2D
	 * - field groups: @default, @search, @detail
	 */
	cadTypeDisp?: string;
}

/**
 * スペック値
 *
 * NOTE: 型番リスト内で使用するスペック値
 */
export interface PartNumberSpecValue {
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - field groups: @default, @search, @detail
	 */
	specCode?: string;
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値。複数の場合はカンマで区切って指定)
	 * - example: D1020.12345!a
	 * - field groups: @default, @search, @detail
	 */
	specValue?: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言。スペック情報タイプが 1 のときにセットされる。
	 * - example: [鉄] SUJ2相当
	 * - field groups: @default, @search, @detail
	 */
	specValueDisp?: string;
	/**
	 * 元スペック値
	 * - 置換前のスペック値
	 * - example: p
	 * - field groups: @default, @search, @detail
	 */
	originalSpecValue?: string;
	/**
	 * 元スペック値表示文言
	 * - 置換前のスペック値の表示文言
	 * - example: 鉄
	 * - field groups: @default, @search, @detail
	 */
	originalSpecValueDisp?: string;
	/**
	 * CAD用スペック値
	 * - CAD用のスペック値
	 * - example: SKD11eqv
	 * - field groups: @default, @search, @detail
	 * - NOTE: SINUSでのCADデータ生成時に使用
	 */
	cadSpecValue?: string;
	/**
	 * データ取得元タイプ
	 * - スペック値のデータ取得元(データ基盤の定義元)を表す文字列
	 *   1: データシート
	 *   2: キーリスト
	 *   3: チェックマスタ
	 * - example: 1
	 * - field groups: @default, @search, @detail
	 * - NOTE: デバッグモードのみ返却
	 */
	sourceType?: string;
	/**
	 * データ取得元タイプ表示文言
	 * - データ取得元タイプの表示文言
	 *   1: dataSheet
	 *   2: keylist
	 *   3: check
	 * - example: dataSheet
	 * - field groups: @default, @search, @detail
	 * - NOTE: デバッグモードのみ返却
	 */
	sourceTypeDisp?: string;
}

/** 規制値 */
export interface RegulationValue {
	/**
	 * 規制コード
	 * - 規制情報のコード値
	 * - field groups: @search, @detail
	 */
	regulationCode?: string;
	/**
	 * 規制値
	 * - この商品に設定されている規制情報の値
	 * - field groups: @search, @detail
	 */
	regulationValue?: string;
}

/** 在庫品情報 */
export interface StockItem {
	/**
	 * 在庫品フラグ
	 * - 在庫品対象の指定
	 *   0: 指定しない
	 *   1: 指定する
	 * - field groups: @search
	 * - NOTE: 現在の条件に該当する在庫品が１件でもあれば"1"、無ければ"0"
	 */
	stockItemFlag: Flag;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 * - NOTE: 現在の条件に該当する在庫品が１件でもあれば"0"、無ければ"1"
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 * - NOTE: リクエストの内容に応じて返却
	 */
	selectedFlag: Flag;
}

/** 仕様・寸法 */
export interface PartNumberSpec {
	/**
	 * スペック項目コード
	 * - スペック項目のコード
	 * - example: E01
	 * - field groups: @search
	 */
	specCode: string;
	/**
	 * スペック項目名
	 * - スペック項目名
	 * - example: 長さ
	 * - field groups: @search
	 */
	specName: string;
	/**
	 * スペック項目単位
	 * - スペック項目の単位
	 * - example: mm
	 * - field groups: @search
	 */
	specUnit: string;
	/**
	 * スペック項目表示タイプ
	 * - スペックの表示種別
	 *   1: テキストボタン形式
	 *   2: テキスト選択形式（1列）
	 *   3: テキスト選択形式（2列）
	 *   4: テキスト選択形式（3列）
	 *   5: 画像ボタン形式（1列）
	 *   6: 画像ボタン形式（2列）
	 *   7: 画像ボタン形式（3列）
	 *   8: 数値入力形式
	 *   9: リスト選択形式
	 *   10: ツリー(入れ子)選択形式
	 * - example: 1
	 * - field groups: @search
	 * - NOTE: 型番検索APIの仕様・寸法リストでは
	 *          11: 数値集約形式
	 *          12: 中央表示
	 *         は返却しない
	 *         型番検索APIの仕様・寸法リストでは
	 *         13～21の表示タイプは返却しない、該当するタイプは通常テンプレート向けに読み替える。（詳しい内容は別紙４参照）
	 */
	specViewType: string;
	/**
	 * 開閉タイプ
	 * - スペック表示の開閉状態
	 *   1: 開
	 *   2: 閉
	 *   3: 開閉ボタン非表示
	 * - example: 1
	 * - field groups: @search
	 */
	openCloseType: string;
	/**
	 * 補足表示タイプ
	 * - スペックの補足表示種別
	 *   1: 通常
	 *   2: 外形図
	 *   3: 詳細
	 *   4: 拡大
	 *   5: イラスト
	 * - example: 2
	 * - field groups: @search
	 * - NOTE: 4,5の場合はスペック値画像URLの画像を用いる
	 */
	supplementType: string;
	/**
	 * 外形図画像URL
	 * - 外形図ダイアログで表示する画像のURL
	 * - example: //xxx/illustration/press/P010105_C3_F.png
	 * - field groups: @search
	 */
	specImageUrl?: string;
	/**
	 * 詳細HTML
	 * - 詳細ダイアログで表示するHTML
	 * - field groups: @search
	 */
	detailHtml?: string;
	/**
	 * スペック説明画像URL
	 * - スペックの説明画像のURL
	 * - field groups: @search
	 */
	specDescriptionImageUrl?: string;
	/**
	 * スペック注意喚起文
	 * - 注意喚起文の本文
	 * - field groups: @search
	 */
	specNoticeText: string;
	/**
	 * 数値入力項目
	 * - 数値入力項目
	 * - field groups: @search
	 */
	numericSpec: NumericSpec;
	/**
	 * スペック値リスト
	 * - field groups: @search
	 * - NOTE: リスト内のすべてのスペック値が非表示の場合は、リスト(ボタン)を非表示
	 */
	specValueList: SpecValue[];
	/**
	 * 表示順
	 * - スペック項目の表示順
	 * - example: 1
	 * - field groups: @search
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
	 * - field groups: @search
	 * - NOTE: そもそも数値入力欄が存在しない場合は、「数値入力項目」自体を返却しない
	 *         (空の値"{}"を返却)
	 */
	hiddenFlag: Flag;
	/**
	 * スペック値
	 * - 数値入力形式のテキストフィールドに表示する値(リクエスト値)
	 * - example: 100
	 * - field groups: @search
	 */
	specValue?: string;
	/**
	 * 数値範囲リスト
	 * - 数値範囲の選択範囲
	 * - field groups: @search
	 */
	specValueRangeList: SpecValueRange[];
}

/** 数値範囲 */
export interface SpecValueRange {
	/**
	 * 最小値
	 * - 指定可能な最小値
	 * - example: 1.0
	 * - field groups: @search
	 */
	minValue?: number;
	/**
	 * 最大値
	 * - 指定可能な最大値
	 * - example: 9.5
	 * - field groups: @search
	 */
	maxValue?: number;
	/**
	 * 刻み値
	 * - 値の刻み幅
	 * - example: 0.5
	 * - field groups: @search
	 */
	stepValue?: number;
}

/** スペック値 */
export interface SpecValue {
	/**
	 * スペック値
	 * - スペック値(コードもしくは数値)
	 * - example: 1
	 * - field groups: @search
	 */
	specValue: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言
	 * - example: 鉄
	 * - field groups: @search
	 */
	specValueDisp: string;
	/**
	 * スペック値画像URL
	 * - スペック値の画像URL
	 * - field groups: @search
	 */
	specValueImageUrl: string;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みのスペック値の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
	/**
	 * 子スペック値リスト
	 * - 2段表示のスペック値リスト
	 * - field groups: @search
	 */
	childSpecValueList: string;
	/**
	 * スペック値属性リスト
	 * - スペック値の属性情報
	 *   PU向けのスペック表示(表形式)に対応している場合に設定
	 * - field groups: @search
	 */
	specValueAttributeList?: SpecValueAttribute[];
}

/** スペック値属性 */
export interface SpecValueAttribute {
	/**
	 * 属性リスト
	 * - 属性のリスト
	 * - field groups: @search
	 */
	attributeList?: Attribute[];
}

/** 属性 */
export interface Attribute {
	/**
	 * 属性名
	 * - 属性名
	 * - example: メーカ名
	 * - field groups: @search
	 */
	attributeName?: string;
	/**
	 * 属性値
	 * - 属性値
	 * - example: オリエンタルモーター
	 * - field groups: @search
	 */
	attributeValue?: string;
}

/** グループ項目 */
export interface GroupSpec {
	/**
	 * グループ項目名
	 * - 項目名
	 * - field groups: @search
	 */
	groupSpecName?: string;
	/**
	 * グループ注意喚起文
	 * - 注意喚起文
	 * - field groups: @search
	 */
	groupSpecNoticeText?: string;
	/**
	 * 左側スペック項目コード
	 * - 左側に表示するスペック項目のコード
	 * - field groups: @search
	 */
	leftSpecCode?: string;
	/**
	 * 右側スペック項目コード
	 * - 右側に表示するスペック項目のコード
	 * - field groups: @search
	 */
	rightSpecCode?: string;
}

/** 追加工スペック */
export interface AlterationSpec {
	/**
	 * スペック項目コード
	 * - スペック項目コード
	 * - example: E01
	 * - field groups: @search
	 */
	specCode: string;
	/**
	 * CAD用スペック項目コード
	 * - CAD用のスペック項目コード
	 * - example: LKC
	 * - field groups: @search
	 * - NOTE: SINUSでのCADデータ生成時に使用
	 */
	cadSpecCode?: string;
	/**
	 * スペック項目名
	 * - スペック項目名
	 * - example: 材質
	 * - field groups: @search
	 */
	specName: string;
	/**
	 * スペック項目単位
	 * - スペック項目の単位
	 * - example: mm
	 * - field groups: @search
	 */
	specUnit?: string;
	/**
	 * スペック項目表示タイプ
	 * - スペックの表示種別
	 *   2: テキスト選択形式（1列）
	 *   3: テキスト選択形式（2列）
	 *   4: テキスト選択形式（3列）
	 *   8: 数値入力形式
	 *   9: リスト選択形式
	 * - example: 8
	 * - field groups: @search
	 * - NOTE: 型番検索APIの追加工スペックリストでは
	 *           1: テキストボタン形式
	 *           5: 画像ボタン形式（1列）
	 *           6: 画像ボタン形式（2列）
	 *           7: 画像ボタン形式（3列）
	 *          10: ツリー(入れ子)選択形式
	 *          11: 数値集約形式
	 *          12: 中央表示
	 *         は返却しない
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
	 * - field groups: @search
	 * - NOTE: 4,5の場合はスペック値画像URLの画像を用いる
	 */
	supplementType: string;
	/**
	 * 外形図画像URL
	 * - 外形図ダイアログで表示する画像のURL
	 * - example: //xxx/illustration/press/P010105_C3_F.png
	 * - field groups: @search
	 */
	specImageUrl?: string;
	/**
	 * 詳細HTML
	 * - 詳細ダイアログで表示するHTML
	 * - field groups: @search
	 */
	detailHtml?: string;
	/**
	 * スペック説明画像URL
	 * - スペックの説明画像のURL
	 * - field groups: @search
	 */
	specDescriptionImageUrl?: string;
	/**
	 * スペック注意喚起文
	 * - 注意喚起文の本文
	 * - field groups: @search
	 */
	specNoticeText?: string;
	/**
	 * 非表示フラグ
	 * - 規格式結果で隠すべきときで、ユーザに選択されていなければ隠す
	 *   0: 表示
	 *   1: 非表示
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 範囲値が埋まっていたり選択値がひとつでも選択されていた場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - field groups: @search
	 */
	selectedFlag: Flag;
	/**
	 * 数値入力項目
	 * - 数値入力項目
	 * - field groups: @search
	 */
	numericSpec: NumericSpec;
	/**
	 * スペック値リスト
	 * - field groups: @search
	 */
	specValueList: AlterationSpecValue[];
}

/** 数値入力項目 */
export interface NumericSpec {
	/**
	 * 非表示フラグ
	 * - 数値入力項目を表示するかどうか
	 *   0: 表示する
	 *   1: 表示しない
	 * - field groups: @search
	 * - NOTE: そもそも数値入力欄が存在しない場合は、「数値入力項目」自体を返却しない
	 *         (空の値"{}"を返却)
	 */
	hiddenFlag: Flag;
	/**
	 * スペック値
	 * - 数値入力形式のテキストフィールドに表示する値(リクエスト値)
	 * - example: 100
	 * - field groups: @search
	 */
	specValue?: string;
	/**
	 * 数値範囲リスト
	 * - 数値範囲の選択範囲
	 * - field groups: @search
	 */
	specValueRangeList: SpecValueRange[];
}

/** 数値範囲 */
export interface SpecValueRange {
	/**
	 * 最小値
	 * - 指定可能な最小値
	 * - example: 1.0
	 * - field groups: @search
	 */
	minValue?: number;
	/**
	 * 最大値
	 * - 指定可能な最大値
	 * - example: 9.5
	 * - field groups: @search
	 */
	maxValue?: number;
	/**
	 * 刻み値
	 * - 値の刻み幅
	 * - example: 0.5
	 * - field groups: @search
	 */
	stepValue?: number;
}

/** スペック値 */
export interface AlterationSpecValue {
	/**
	 * スペック値
	 * - スペック値
	 * - example: 1
	 * - field groups: @search
	 */
	specValue: string;
	/**
	 * スペック値表示文言
	 * - スペック値の表示文言
	 * - example: 鉄
	 * - field groups: @search
	 */
	specValueDisp: string;
	/**
	 * CAD用スペック値
	 * - CAD用のスペック値
	 * - example: checked
	 * - field groups: @search
	 * - NOTE: SINUSでのCADデータ生成時に使用
	 */
	cadSpecValue?: string;
	/**
	 * スペック値画像URL
	 * - スペック値の画像URL
	 * - field groups: @search
	 */
	specValueImageUrl?: string;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * デフォルトフラグ
	 * - 型番確定時にデフォルトで選択されている追加工かどうか
	 *   0: デフォルトで選択されていない
	 *   1: デフォルトで選択されている
	 * - field groups: @search
	 * - NOTE: 参考
	 *         http://jp.misumi-ec.com/vona2/detail/221000197114/?HissuCode=YMH1SS04-2-S-B-NA-NB-[50-400%2F50]-1L-SA-CC&CategorySpec=00000049567%3A%3A50&Keyword=SS04-2-S-B-N-N-50-1L-SCC
	 */
	defaultFlag: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
	/**
	 * スペック値属性リスト
	 * - スペック値の属性情報
	 *   PU向けのスペック表示(表形式)に対応している場合に設定
	 * - field groups: @search
	 */
	specValueAttributeList?: SpecValueAttribute[];
}

/** スペック値属性 */
export interface SpecValueAttribute {
	/**
	 * 属性リスト
	 * - 属性のリスト
	 * - field groups: @search
	 */
	attributeList?: Attribute[];
}

/** 属性 */
export interface Attribute {
	/**
	 * 属性名
	 * - 属性名
	 * - example: メーカ名
	 * - field groups: @search
	 */
	attributeName?: string;
	/**
	 * 属性値
	 * - 属性値
	 * - example: オリエンタルモーター
	 * - field groups: @search
	 */
	attributeValue?: string;
}

/** CADタイプ */
export interface CadType {
	/**
	 * CADタイプ
	 * - CADが存在する場合に表示
	 *   1: 2D
	 *   2: 3D
	 * - field groups: @search
	 */
	cadType: string;
	/**
	 * CADタイプ表示文言
	 * - CADタイプの表示文言
	 * - field groups: @search
	 */
	cadTypeDisp: string;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** 出荷日数 */
export interface DaysToShip {
	/**
	 * 出荷日数
	 * - 出荷までの実働日数
	 *   -1: 即納
	 *   0: 当日出荷
	 *   1～98: 出荷日数
	 * - maxLength: 3
	 * - example: 1
	 * - field groups: @search
	 */
	daysToShip: number;
	/**
	 * 非表示フラグ
	 * - field groups: @search
	 */
	hiddenFlag?: Flag;
	/**
	 * 選択済みフラグ
	 * - 選択済みの選択肢の場合に設定
	 *   0: 未選択
	 *   1: 選択済
	 * - example: 0
	 * - field groups: @search
	 */
	selectedFlag: Flag;
}

/** ドリルダウンスペック */
export interface DrillDownSpec {
	/**
	 * 親スペック項目コード
	 * - 親のスペック項目コード
	 * - example: 00000173502
	 * - field groups: @search
	 */
	parentSpecCode?: string;
	/**
	 * 親スペック値リスト
	 * - 親のスペック値のリスト
	 */
	parentSpecValueList?: ParentSpecValue[];
}

/** 親スペック値 */
export interface ParentSpecValue {
	/**
	 * 親スペック値
	 * - 親のスペック値
	 * - example: a
	 * - field groups: @search
	 */
	parentSpecValue?: string;
	/**
	 * 子スペック項目コードリスト
	 * - 子のスペック項目コードのリスト
	 * - example: ["00000459285","00000459283"]
	 * - field groups: @search
	 * - NOTE: 1つの子スペックが複数の親スペック値に紐付くこともありうる。
	 *         子スペックとして追加工のスペックが指定された場合、型番が1件に絞り込まれる前は、その追加工の情報を非表示フラグ=1で返却する
	 */
	childSpecCodeList?: string[];
}

/** スペックグループ */
export interface PartNumberSpecGroup {
	/**
	 * グループ名
	 * - グループ名
	 * - field groups: @search
	 */
	groupName?: string;
	/**
	 * グループ説明画像URL
	 * - グループの説明画像のURL
	 * - field groups: @search
	 */
	groupDescriptionImageUrl?: string;
	/**
	 * スペック項目コードリスト
	 * - スペックコードのリスト
	 * - field groups: @search
	 */
	specCodeList?: string[];
}

/** 追加工スペックグループ */
export interface AlterationSpecGroup {
	/**
	 * グループ名
	 * - グループ名
	 * - field groups: @search
	 */
	groupName?: string;
	/**
	 * グループ説明画像URL
	 * - グループの説明画像のURL
	 * - field groups: @search
	 */
	groupDescriptionImageUrl?: string;
	/**
	 * スペック項目コードリスト
	 * - スペックコードのリスト
	 * - field groups: @search
	 */
	specCodeList?: string[];
}
