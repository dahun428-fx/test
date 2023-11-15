import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** ログアウトAPIレスポンス */
export interface LogoutResponse extends MsmApiResponse {
	/**
	 * クッキー削除URLリスト
	 * - 統一認証のセッションクッキーを削除するCGIのURLのリスト。
	 *   ログアウト成功後にこのリストのURLへリクエストを行い、各ドメインのクッキーを削除する必要がある。
	 * - example: [,         "https://ec.misumi.jp/cgi-bin/wos/misumijpimg-gstd.cgi?GSESSION=&GCOMPERM=&GADMINSESSION=&GADMINCOMPERM=&RM=0",,         "https://www.misumi-ec.com/cgi-bin/wos/misumi-ecimg-gstd.cgi?GSESSION=&GCOMPERM=&GADMINSESSION=&GADMINCOMPERM=&RM=0",,         "https://sso.ecagent.com/cgi-bin/wos/ecagentimg-gstd.cgi?GSESSION=&GCOMPERM=&GADMINSESSION=&GADMINCOMPERM=&RM=0",     ]
	 * - NOTE: 実際には削除ではなく無効な値のクッキーが発行されている模様
	 */
	deleteCookieUrlList: string[];
}
