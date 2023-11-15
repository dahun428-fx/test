import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** キーワードサジェスト検索APIレスポンス */
export interface SuggestKeywordResponse extends MsmApiResponse {
	/**
	 * キーワードリスト
	 * - 検索用候補キーワード一覧
	 * - NOTE: キーワードリストか遷移先情報のどちらか一方を返却
	 */
	keywordList?: string[];
	/**
	 * 遷移先情報
	 * - NOTE: サジェストリストか遷移先情報のどちらか一方を返却
	 */
	forwardInfo?: ForwardInfo;
}

/** 遷移先情報 */
export interface ForwardInfo {
	/**
	 * 遷移先タイプ
	 * - 遷移先タイプ
	 *   1: UnitLibrary
	 *   2: Category
	 *   3: Series
	 *   4: URL
	 * - example: 1
	 */
	forwardType: string;
	/**
	 * 遷移先タイプ表示文言
	 * - 遷移先タイプの表示文言
	 * - example: 検索コード | Unit Library
	 */
	forwardTypeDisp: string;
	/**
	 * 遷移先タイトル
	 * - 遷移先のタイトル
	 * - example: 段積み治具
	 * - NOTE: WEBCODE等、直接遷移対象のキーワードが入力された場合に返却する
	 */
	forwardTitle: string;
	/**
	 * 遷移先画像URL
	 * - 遷移先の画像URL
	 * - example: http://ドメイン名/msmec/ideanote/000072/img/img_unit_thum.png
	 * - NOTE: WEBCODE等、直接遷移対象のキーワードが入力された場合に返却する
	 */
	forwardImageUrl: string;
	/**
	 * キーワード
	 * - 入力したキーワード
	 */
	keyword: string;
	/**
	 * 遷移先ページURL
	 * - 遷移先ページのURL
	 * - example: http://ドメイン名/ec/unitlibrary/detail/000072.html?TypeCode=UL72
	 * - NOTE: WEBCODE等、直接遷移対象のキーワードが入力された場合に返却する
	 */
	forwardPageUrl: string;
}
