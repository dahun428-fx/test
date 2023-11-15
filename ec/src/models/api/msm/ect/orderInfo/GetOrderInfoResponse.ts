import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 注文情報取得APIレスポンス */
export interface GetOrderInfoResponse extends MsmApiResponse {
	/**
	 * ユーザ情報
	 * - ユーザ単位の情報
	 * - field groups: @default, @user
	 */
	user?: User;
	/**
	 * 得意先情報
	 * - 得意先単位の情報
	 * - field groups: @default, @customer
	 */
	customer?: Customer;
	/**
	 * 税込みフラグ
	 * - 税込みかどうか
	 *   0: 税込みでない
	 *   1: 税込み
	 * - field groups: @default, @user, @customer
	 */
	includeTaxFlag?: Flag;
	/**
	 * 承認機能利用フラグ
	 * - 承認機能利用フラグ
	 *   0: 承認不要
	 *   1: 承認必要
	 * - field groups: @default, @user, @customer
	 */
	requireApprovalFlag?: Flag;
	/**
	 * 直近1ヶ月の使用ありフラグ
	 * - 直近1ヶ月の使用があるかどうか
	 *   0: 使用なし
	 *   1: 使用あり
	 * - field groups: @default, @user, @customer
	 */
	recentUseFlag?: Flag;
	/**
	 * 代理ログインフラグ
	 * - 代理ログインかどうか
	 *   0: 通常ログイン
	 *   1: 代理ログイン
	 * - field groups: @default, @user, @customer
	 */
	proxyLoginFlag?: Flag;
	/**
	 * 請求書PDF新着ありフラグ
	 * - 請求書PDFの新着があるかどうか
	 *   0: 新着なし
	 *   1: 新着あり
	 * - field groups: @default, @user, @customer
	 */
	newBillFlag?: Flag;
	/**
	 * 請求書タイプ
	 * - 請求書のタイプ
	 *   1: 標準
	 *   2: 都度(スタンダード)
	 *   3: 都度(カスタム)
	 * - field groups: @default, @user, @customer
	 */
	billType?: string;
	/**
	 * 権限リスト
	 * - 権限のリスト。このAPIで返却できる権限は以下の通り
	 *   9: 子ユーザ管理
	 *   10: 請求書PDF参照
	 *   11: 単価表参照
	 *   12: 請求書PDF(案内)参照
	 *   13: 取引明細参照
	 *   14: 直送先管理
	 *   15: 担当者管理
	 *   16: 見積・注文データ連携(設定)
	 *   17: 見積・注文データ連携(項目定義)
	 *   18: 見積・注文データ一覧
	 * - field groups: @default, @user, @customer
	 */
	permissionList?: string[];
	/**
	 * キャッシュ更新日時
	 * - キャッシュの内容を更新した日時(yyyy/MM/dd HH:mm:ss)
	 *   ※DBのレコードの更新日時ではない
	 * - field groups: @default, @user, @customer
	 */
	updateDateTime?: string;
	/**
	 * 通貨コード
	 * - API仕様書には記載ないけれど、返却されているため
	 */
	currencyCode?: string;
}

/** ユーザ情報 */
export interface User {
	/**
	 * アンフィット件数
	 * - アンフィットになっている見積・注文の件数
	 * - field groups: @default, @user
	 */
	unfitCount?: UnfitCount;
	/**
	 * 承認件数
	 * - 承認が必要な見積・注文の件数
	 * - field groups: @default, @user
	 */
	approvalCount?: ApprovalCount;
	/**
	 * 配送件数
	 * - 配送件数
	 * - field groups: @default, @user
	 */
	deliveryCount?: DeliveryCount;
	/**
	 * 一時保存件数
	 * - 一時保存した見積・注文の件数
	 * - field groups: @default, @user
	 */
	saveCount?: SaveCount;
	/**
	 * 見積履歴リスト
	 * - 見積履歴のリスト
	 * - field groups: @default, @user
	 */
	quotationHistoryList?: QuotationHistory[];
}

/** アンフィット件数 */
export interface UnfitCount {
	/**
	 * 見積
	 * - アンフィットになっている見積の件数
	 * - field groups: @default, @user
	 */
	quotation?: number;
	/**
	 * 注文
	 * - アンフィットになっている注文の件数
	 * - field groups: @default, @user
	 */
	order?: number;
}

/** 承認件数 */
export interface ApprovalCount {
	/**
	 * 依頼
	 * - 承認依頼した件数
	 * - field groups: @default, @user
	 */
	request?: number;
	/**
	 * 差し戻し
	 * - 承認依頼が差し戻しされた件数
	 * - field groups: @default, @user
	 */
	remand?: number;
	/**
	 * 否認
	 * - 承認依頼が否認された件数
	 * - field groups: @default, @user
	 */
	reject?: number;
}

/** 配送件数 */
export interface DeliveryCount {
	/**
	 * 翌日
	 * - 翌日に配送する件数
	 * - field groups: @default, @user
	 */
	nextDay?: number;
	/**
	 * 当日
	 * - 当日に配送する件数
	 * - field groups: @default, @user
	 */
	currentDay?: number;
	/**
	 * 前日
	 * - 前日に配送した件数
	 * - field groups: @default, @user
	 */
	previousDay?: number;
}

/** 一時保存件数 */
export interface SaveCount {
	/**
	 * 見積
	 * - 一時保存した見積の件数
	 * - field groups: @default, @user
	 */
	quotation?: number;
	/**
	 * 注文
	 * - 一時保存した注文の件数
	 * - field groups: @default, @user
	 */
	order?: number;
}

/** 見積履歴 */
export interface QuotationHistory {
	/**
	 * 見積日
	 * - 見積日の文字列(現地表記文字列)
	 * - field groups: @default, @user
	 */
	quotationDate?: string;
	/**
	 * 見積伝票番号
	 * - 見積伝票番号
	 * - field groups: @default, @user
	 */
	quotationSlipNo?: string;
	/**
	 * 見積明細件数
	 * - 見積明細の件数
	 * - field groups: @default, @user
	 */
	quotationItemCount?: number;
	/**
	 * 合計金額
	 * - 合計金額
	 * - field groups: @default, @user
	 */
	totalPrice?: number;
	/**
	 * 処理ステータス
	 * - 処理ステータス
	 *   1: 通常
	 *   2: まもなく期限
	 * - field groups: @default, @user
	 */
	status?: string;
	/**
	 * 処理ステータスメッセージ
	 * - 処理ステータスのメッセージ
	 * - example: 期限まで残り2日
	 * - field groups: @default, @user
	 */
	statusMessage?: string;
}

/** 得意先情報 */
export interface Customer {
	/**
	 * アンフィット件数
	 * - アンフィットになっている見積・注文の件数
	 * - field groups: @default, @customer
	 */
	unfitCount?: UnfitCount;
	/**
	 * 承認件数
	 * - 承認が必要な見積・注文の件数
	 * - field groups: @default, @customer
	 */
	approvalCount?: ApprovalCount;
	/**
	 * 配送件数
	 * - 配送件数
	 * - field groups: @default, @customer
	 */
	deliveryCount?: DeliveryCount;
	/**
	 * 一時保存件数
	 * - 一時保存した見積・注文の件数
	 * - field groups: @default, @customer
	 */
	saveCount?: SaveCount;
	/**
	 * 見積履歴リスト
	 * - 見積履歴のリスト
	 * - field groups: @default, @customer
	 */
	quotationHistoryList?: QuotationHistory[];
}

/** アンフィット件数 */
export interface UnfitCount {
	/**
	 * 見積
	 * - アンフィットになっている見積の件数
	 * - field groups: @default, @customer
	 */
	quotation?: number;
	/**
	 * 注文
	 * - アンフィットになっている注文の件数
	 * - field groups: @default, @customer
	 */
	order?: number;
}

/** 承認件数 */
export interface ApprovalCount {
	/**
	 * 依頼
	 * - 承認依頼した件数
	 * - field groups: @default, @customer
	 */
	request?: number;
	/**
	 * 差し戻し
	 * - 承認依頼が差し戻しされた件数
	 * - field groups: @default, @customer
	 */
	remand?: number;
	/**
	 * 否認
	 * - 承認依頼が否認された件数
	 * - field groups: @default, @customer
	 */
	reject?: number;
}

/** 配送件数 */
export interface DeliveryCount {
	/**
	 * 翌日
	 * - 翌日に配送する件数
	 * - field groups: @default, @customer
	 */
	nextDay?: number;
	/**
	 * 当日
	 * - 当日に配送する件数
	 * - field groups: @default, @customer
	 */
	currentDay?: number;
	/**
	 * 前日
	 * - 前日に配送した件数
	 * - field groups: @default, @customer
	 */
	previousDay?: number;
}

/** 一時保存件数 */
export interface SaveCount {
	/**
	 * 見積
	 * - 一時保存した見積の件数
	 * - field groups: @default, @customer
	 */
	quotation?: number;
	/**
	 * 注文
	 * - 一時保存した注文の件数
	 * - field groups: @default, @customer
	 */
	order?: number;
}

/** 見積履歴 */
export interface QuotationHistory {
	/**
	 * 見積日
	 * - 見積日の文字列(現地表記文字列)
	 * - field groups: @default, @customer
	 */
	quotationDate?: string;
	/**
	 * 見積書番号
	 * - 見積伝票番号
	 * - field groups: @default, @customer
	 */
	quotationSlipNo?: string;
	/**
	 * 明細件数
	 * - 見積明細の件数
	 * - field groups: @default, @customer
	 */
	quotationItemCount?: number;
	/**
	 * 合計金額
	 * - 合計金額
	 * - field groups: @default, @customer
	 */
	totalPrice?: number;
	/**
	 * 処理ステータス
	 * - 処理ステータス
	 *   1: 通常
	 *   2: まもなく期限
	 * - field groups: @default, @customer
	 */
	status?: string;
	/**
	 * 処理ステータス表示文言
	 * - 処理ステータスのメッセージ
	 * - field groups: @default, @customer
	 */
	statusMessage?: string;
}
