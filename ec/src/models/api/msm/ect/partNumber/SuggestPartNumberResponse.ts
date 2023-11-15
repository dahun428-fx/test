import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** 型番サジェスト検索APIレスポンス */
export interface SuggestPartNumberResponse extends MsmApiResponse {
	/**
	 * 型番候補リスト
	 */
	partNumberList: PartNumber[];
	/**
	 * COMBO呼び出すべきフラグ
	 * - COMBOサジェストAPIを呼ぶべきかのフラグ
	 *   0: 不要
	 *   1: 要
	 * - example: 0
	 * - NOTE: 以下を満たす時に1を返します。
	 *         ・入力keywordが6文字以上
	 *         ・サジェスト結果が10件未満
	 *         ・通常型番が1件もフル型番確定していない
	 */
	comboFlag: Flag;
	/**
	 * 検索キーワード補正フラグ
	 * - 入力文字列が変換されて検索が実行されたかを表すフラグ
	 *   0: 補正なし
	 *   1: 補正あり
	 * - example: 0
	 * - NOTE: 内部で検索処理を実行する前に、リクエストされたキーワードを補正したかどうかを返します。
	 *         ・リクエストキーワード≠補正キーワードが１つでも存在する場合に１を返却します。
	 */
	normalizeFlag: Flag;
	/**
	 * 検索キーワード変換フラグ
	 * - 入力文字列が変換されて検索が実行されたかを表すフラグ
	 *   0: 補正なし
	 *   1: 補正あり
	 * - example: 0
	 * - NOTE: 内部で検索処理を実行する前に、リクエストされたキーワードを変換したかどうかを返します。
	 *         ・補正キーワード≠検索キーワードが１つでも存在する場合に１を返却します。
	 */
	convertFlag: Flag;
}

/** 型番候補 */
export interface PartNumber {
	/**
	 * 型番タイプ
	 * - 検索結果の型番のタイプ
	 *   1: 通常型番
	 *   2: 商品情報未掲載
	 *   3: Eカタログ未掲載
	 *   4: Cナビ
	 *   5: 規格廃止品
	 * - example: 1
	 */
	partNumberType: PartNumberType;
	/**
	 * 型番タイプ表示文言
	 * - 注釈の表示文言
	 *   1: (なし)
	 *   2: 商品情報未掲載。見積・注文に進みます。
	 *   3: カタログ未掲載品
	 *   4: Cナビ
	 * - example: 商品情報未掲載。見積・注文に進みます。
	 */
	partNumberTypeDisp?: string;
	/**
	 * 補正キーワード
	 * - ユーザ入力文字から型番検索に使う文字を抽出した文字列。
	 *   ＜例＞
	 *   リクエストキーワード："デイトン　sjx10 13_100_TiCN　　　"
	 *   補正キーワード："SJX10 13_100_TICN"
	 * - example: SJX10 13_100_TICN
	 * - NOTE: ・先頭全角文字を除去「型番 SFJ3-10」対応
	 *         ・後方空白除去
	 *         ・大文字小文字、全角半角の統一（大文字化）
	 */
	normalizedKeyword: string;
	/**
	 * 検索キーワード
	 * - 内部的に検索を実行した文字列。
	 *   ＜例＞
	 *   補正キーワード："SJX10 13_100_TICN"
	 *   検索キーワード："SJX10-13-100-XCN"
	 * - example: SJX10-13-100-XCN
	 * - NOTE: 顧客型式で返却する。
	 *         Dayton品でチェックマスタ上はX2Aで、型式変換によってX2になる場合、X2で返却する。
	 */
	searchedKeyword: string;
	/**
	 * 型番
	 * - 候補型番(タイプ、型番候補、フル型番)もしくはCナビコード
	 * - example: AN
	 */
	partNumber: string;
	/**
	 * ブランドコード
	 * - シリーズの所属するブランドコード
	 * - example: MSM
	 */
	brandCode: string;
	/**
	 * ブランド名
	 * - 型番のメーカ
	 * - example: ミスミ
	 */
	brandName: string;
	/**
	 * シリーズコード
	 * - 型番のシリーズコード
	 * - example: 110400153530
	 */
	seriesCode?: string;
	/**
	 * シリーズ名
	 * - 型番のシリーズ名
	 *   複数のシリーズに紐付いているインナーの場合のみ返却する
	 */
	seriesName?: string;
	/**
	 * インナーコード
	 * - 型番のインナーコード
	 */
	innerCode?: string;
	/**
	 * チェック方法Cフラグ
	 * - 型番のチェック方法Cフラグ
	 * - example: 1
	 */
	checkCFlag?: Flag;
	/**
	 * 確定タイプ
	 * - 確定タイプ
	 *   2: タイプまで確定済み
	 *   3: インナーまで確定済み
	 *   4: フル型番確定済み
	 *   Cナビコードの場合は返却しない
	 * - example: 2
	 * - NOTE: 確定タイプのコード値はシリーズ検索APIのコード値に統一
	 *         型番サジェストAPIでは、「1:シリーズまで確定済み」は返却しない
	 */
	completeType?: string;
	/**
	 * ユニットコード(仮)リスト
	 * - コンベヤの部材品を特定するためのユニットコード。
	 *   統合インナーコードを利用。
	 * - maxLength: 14
	 * - example: MDM00001066213
	 */
	unitCodeList?: string[];
	/**
	 * 規格廃止日
	 * - 規格廃止日
	 * - example: yyyy/mm/dd
	 */
	discontinuedDate?: string;
	/**
	 * 代替品メッセージ
	 */
	alternativeMessage?: string;
}

/**
 * 型番のタイプ
 *   1: 通常型番
 *   2: 商品情報未掲載
 *   3: (紙)カタログ未掲載
 *   4: Cナビ (マレーシアには存在しない)
 *   5: 規格廃止品
 */
const PartNumberType = {
	NORMAL: '1',
	NO_LISTED: '2',
	NO_CATALOG: '3',
	// C_NAVI: '4',
	DISCONTINUED: '5',
} as const;
type PartNumberType = typeof PartNumberType[keyof typeof PartNumberType];
export { PartNumberType };
