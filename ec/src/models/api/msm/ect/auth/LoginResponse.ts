import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** ログインAPIレスポンス */
export interface LoginResponse extends MsmApiResponse {
	/**
	 * セッションID
	 * - 新認証基盤から発行されたアクセストークン代理キー
	 *   ユーザ情報を利用するAPIを呼び出す際にこの値を指定する必要がある。ただし、1時間で有効期限が切れるため、新認証基盤のリフレッシュトークンAPIにリフレッシュトークンハッシュ値を渡して再発行する必要あり
	 */
	sessionId: string;
	/**
	 * リフレッシュトークンハッシュ値
	 * - アクセストークン代理キーを再発行するための値
	 */
	refreshTokenHash: string;
	/**
	 * 得意先コード
	 * - ログインしたユーザの得意先コード
	 * - maxLength: 6
	 * - NOTE: ec会員の場合はnull
	 */
	customerCode?: string;
	/**
	 * 担当者コード
	 * - ログインしたユーザの担当者コード
	 * - maxLength: 8
	 */
	userCode: string;
	/**
	 * 権限リスト
	 * - 操作可能な機能のリスト
	 *   3: 見積
	 *   4: 注文
	 * - maxLength: 1
	 * - example: ["3", "4"]
	 * - NOTE: 権限のコード値は得意先情報取得APIの値に合わせている
	 *         ログインAPIで返却可能なのは、見積/注文権限のみ
	 */
	permissionList: string[];
	/**
	 * クッキー発行URLリスト
	 * - 統一認証のセッションクッキーを発行するCGIのURLのリスト。
	 *   ログイン成功後にこのリストのURLへリクエストを行い、各ドメインのクッキーを発行する必要がある。
	 * - example: ["http://ztest.misumi.jp/cgi-bin/wos/misumijpimg-gstd.cgi?GSESSION=71fe424d-8527-4f19-acf0-f964b53e4708&amp;GCOMPERM=0901%2C0902%2C1101%2C1201&amp;GADMINSESSION=&amp;GADMINCOMPERM=&amp;RM=0","https://www.misumi-ec.com/cgi-bin/wos/misumi-ecimg-gstd.cgi?GSESSION=71fe424d-8527-4f19-acf0-f964b53e4708&amp;GCOMPERM=0901%2C0902%2C1101%2C1201&amp;GADMINSESSION=&amp;GADMINCOMPERM=&amp;RM=0"]
	 * - NOTE: NEWTON対応現法では、空リストを返却する
	 */
	createCookieUrlList: string[];
}
