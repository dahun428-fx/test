import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** FAQ情報取得APIレスポンス */
export interface SearchFaqResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - FAQの総件数
	 * - example: 23
	 * - NOTE: 検索条件にヒットした全件数取得
	 */
	totalCount: number;
	/**
	 * FAQリスト
	 * - 新着順で返却
	 * - NOTE: FAQ.表示順の昇順でソート
	 */
	faqList: Faq[];
}

/** FAQ */
export interface Faq {
	/**
	 * 質問
	 * - 質問 (HTML)
	 * - maxLength: ?
	 * - example: "ボールキャッチ：BCAS32、BCASS32 を装置に採用していますが、<br>約25,000回程度開閉したところ金具が削れてロックが緩くなってきています。<br><br>使用条件により異なると思いますが、推定寿命の規定はないでしょうか。<br>定期交換の目安にしたいと考えています。"
	 */
	question: string;
	/**
	 * 回答
	 * - 回答 (HTML)
	 * - maxLength: ?
	 * - example: "AC電源自動復旧機能を設定することで可能です。設定方法については、マニュアルをダウンロードの上、ご確認ください。<br /><a target="_blank" href=http://jp.misumi-ec.com/maker/misumi/el/support/>http://jp.misumi-ec.com/maker/misumi/el/support/</a>"
	 */
	answer: string;
}
