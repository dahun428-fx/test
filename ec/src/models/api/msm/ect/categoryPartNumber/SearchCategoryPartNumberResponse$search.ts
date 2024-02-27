import { MsmApiResponse, Flag } from '@misumi-org/msm-api-client-sdk';

/** カテゴリ型番検索APIレスポンス */
export interface SearchCategoryPartNumberResponse$search
	extends MsmApiResponse {
	/**
	 * 総件数
	 * - 検索にヒットした総件数
	 * - example: 1022
	 * - field groups: @default, @search, @detail
	 */
	totalCount: number;
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
	itemType?: unknown; // TODO: Confirm type of relatedLinkList
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
