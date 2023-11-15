import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';

/** サイト改善コメント送信APIリクエスト */
export interface AddSiteFeedbackRequest extends MsmApiRequest {
	/**
	 * 名前
	 * - 名前
	 * - example: ミスミ太郎
	 */
	name?: string;
	/**
	 * メールアドレス
	 * - メールアドレス
	 * - example: example@misumi.co.jp
	 */
	email?: string;
	/**
	 * 電話番号
	 * - 電話番号
	 * - example: 090-0000-0000
	 */
	tel?: string;
	/**
	 * コメント
	 * - コメント
	 * - example: いつも便利に利用しています。
	 */
	comment?: string;
	/**
	 * URL
	 * - ページURL
	 * - REFERERヘッダの値
	 * - example: http://www.stg.misumi-ec.com/vona2/result/?Keyword=SFJ3-10
	 * - NOTE: デフォルトではAPIサーバ側でリクエストヘッダから取得するが、ブラウザ上ではなくフロントのサーバからAPI呼び出しする場合など、REFERERヘッダを自動的に送信できない場合はリクエスト項目として設定する
	 */
	url?: string;
	/**
	 * タイトル
	 * - ページタイトル
	 * - example: SFJ3-10の検索結果｜MISUMI-VONA【ミスミ】
	 */
	title: string;
}
