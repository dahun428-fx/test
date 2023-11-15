import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** セッションチェックAPIレスポンス */
export interface CheckSessionResponse extends MsmApiResponse {
	/**
	 * セッション状態
	 * - セッション状態
	 *   1: 未ログイン、もしくは、セッションが無効
	 *   2: 仮ログイン(ログイン後、30分以上経過)
	 *   3: 本ログイン(ログイン後、30分以内)
	 * - example: 3
	 */
	sessionStatus: string;
	/**
	 * 得意先コード
	 * - 指定したセッションIDの得意先コード
	 *   セッションが無効な場合はnull
	 * - example: 769956
	 */
	customerCode?: string;
	/**
	 * 担当者コード
	 * - 指定したセッションIDのユーザコード
	 *   セッションが無効な場合はnull
	 * - example: 21086252
	 */
	userCode?: string;
	/**
	 * 担当者名(現地語)
	 * - 指定したセッションIDのユーザの名前
	 *   セッションが無効な場合はnull
	 * - example: テストユーザ
	 */
	userName?: string;
	/**
	 * 担当部門(現地語)
	 * - 指定したセッションIDのユーザの部門名
	 *   セッションが無効な場合はnull
	 * - example: テスト部門
	 */
	userDepartmentName?: string;
	/**
	 * メールアドレス
	 * - 指定したセッションIDのユーザのメールアドレス
	 *   セッションが無効な場合はnull
	 */
	email?: string;
	/**
	 * 代理ログインフラグ
	 * - 代理ログインかどうか
	 *   0: 通常ログイン
	 *   1: 代理ログイン
	 */
	proxyLoginFlag?: Flag;
	/**
	 * 携帯番号認証済みフラグ
	 * - 携帯番号認証済みかどうか(中国のみ)
	 *   0: 未認証
	 *   1: 認証済み
	 */
	authPhoneCompleteFlag?: Flag;
	/**
	 * 得意先タイプ
	 * - 得意先のタイプ
	 *   1: EC会員
	 *   2: 仮WOS会員
	 *   3: WOS会員
	 * - NOTE: ユーザコードに"@"を含むWOS会員を「2: 仮WOS会員」としている
	 */
	customerType?: string;
	/**
	 * ユーザ権限リスト
	 * - 操作可能な機能のリスト
	 *   3: 見積
	 *   4: 注文
	 *   9: 子ユーザ管理
	 *   10: 請求書PDF参照
	 *   12: 請求書PDF(案内)参照
	 *   16: 見積・注文データ連携(設定)
	 *   17: 見積・注文データ連携(項目定義)
	 *   18: 見積・注文データ一覧
	 *   19: 承認機能利用
	 * - example: ["3", "4"]
	 * - NOTE: 権限のコード値は得意先情報取得APIの値に合わせている
	 *         セッションチェックAPIで返却可能な権限のみ返却している
	 */
	permissionList: string[];
}
