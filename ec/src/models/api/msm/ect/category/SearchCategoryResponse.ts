import { Flag } from '@/models/api/Flag';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';

/** カテゴリ検索APIレスポンス */
export interface SearchCategoryResponse extends MsmApiResponse {
	/**
	 * 総件数
	 * - ヒットしたカテゴリ情報の件数を返却
	 *   ページ数は取得件数から算出
	 * - example: 5
	 * - NOTE: カテゴリ情報リストの件数(親、子の件数は含まない)
	 */
	totalCount: number;
	/**
	 * カテゴリ情報リスト
	 * - ヒットしたカテゴリ情報のリスト
	 */
	categoryList: Category[];
	/**
	 * メニューグループリスト
	 * - カテゴリページに表示するコンテンツの見出し(メニューグループ)のリスト
	 *   カテゴリコードが指定された場合のみ返却
	 */
	menuGroupList?: MenuGroup[];
	/**
	 * ブランドモードフラグ
	 * - ブランドモードで検索が行われたかどうか
	 *   0: 通常モード
	 *   1: ブランドモード
	 */
	brandModeFlag?: Flag;
	/**
	 * ブランドモードキーワード
	 * - ブランドモード検索時に、検索に使用したキーワード
	 *   (入力されたキーワードからブランド名を除外した部分)
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandModeKeyword?: string;
	/**
	 * ブランドモードブランド名
	 * - ブランドモード検索時に、検索に使用したブランド名称
	 * - example: ミスミ
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandModeBrandName?: string;
	/**
	 * 更新日時
	 * - カテゴリ情報の最終更新日時
	 * - example: 2016/8/31 17:41:29
	 * - NOTE: yyyy/mm/dd hh:mm:ss
	 *         更新日時がリクエストされた場合に返却する
	 */
	updateDateTime?: string;
}

/** カテゴリ情報 */
export interface Category {
	/**
	 * カテゴリコード
	 * - カテゴリコード
	 * - maxLength: 11
	 * - example: M0101000000
	 */
	categoryCode: string;
	/**
	 * カテゴリ名
	 * - カテゴリの名称
	 * - example: リニアシャフト
	 */
	categoryName: string;
	/**
	 * ブランドコード
	 * - ブランドコード
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandCode?: string;
	/**
	 * ブランドURLコード
	 * - ブランドページのURLで使用するコード
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandUrlCode?: string;
	/**
	 * ブランド名
	 * - ブランドの名称
	 * - NOTE: ブランドモードのときのみ返却
	 */
	brandName?: string;
	/**
	 * 事業部コード
	 * - 事業部コード
	 *   mech: メカ
	 *   el: エレ
	 *   fs: FS
	 *   mold: 金型(モールド)
	 *   press: 金型(プレス)
	 * - example: mech
	 */
	departmentCode: string;
	/**
	 * 親カテゴリコードリスト
	 * - トップカテゴリから親カテゴリまでのカテゴリコードのリスト
	 * - example: 「"mech", "M0100000000"]
	 */
	parentCategoryCodeList: string[];
	/**
	 * 画像URL
	 * - カテゴリの画像
	 * - example: //ドメイン名/material/fs/TRC1/PHOTO/t010005448720.jpg
	 */
	categoryImageUrl?: string;
	/**
	 * 集合画像URL
	 * - カテゴリの集合画像
	 */
	categoryGroupImageUrl?: string;
	/**
	 * カテゴリ説明文
	 * - カテゴリページの上部に表示される説明文
	 * - example: 直動部のシャフト（リニアシャフト・焼入れシャフト・ガイドシャフト・スライドシャフト）を豊富に取り揃えております。
	 */
	categoryDetail?: string;
	/**
	 * スペック検索フラグ
	 * - 当該カテゴリでスペック検索を行うか否かを表すフラグ
	 *   0: スペック検索なし
	 *   1: スペック検索あり
	 * - maxLength: 1
	 * - example: 1
	 */
	specSearchFlag: Flag;
	/**
	 * スペック検索表示タイプ
	 * - スペック検索ページのデフォルト表示タイプ
	 *   1: 一覧表示
	 *   2: 写真表示
	 *   3: 仕様比較表示
	 * - example: 1
	 */
	specSearchDispType?: string;
	/**
	 * スペック検索テンプレートタイプリスト
	 * - スペック検索ページのテンプレートタイプのリスト
	 *   1: 基本形状から選ぶ
	 *   2: 仕様・規格表から選ぶ(シャフトパターン)
	 *   3: 仕様・規格表から選ぶ(シャフトホルダパターン)
	 *   4: 中央スペック検索
	 * - maxLength: 1
	 * - example: ["1","2"]
	 */
	templateTypeList?: string[];
	/**
	 * メガナビ内の表示位置
	 * - [行, 列]
	 * - example: [1, 2]
	 */
	topMenuPositionList?: number[];
	/**
	 * 即納配送可フラグ
	 * - 即納対応可能かどうか(中国のみ)
	 *   0: 非対応
	 *   1: 対応
	 * - maxLength: 1
	 * - example: 1
	 */
	promptDeliveryFlag: Flag;
	/**
	 * メタタグリスト
	 * - マスタ情報のメタタグ項目
	 * - example: ["手袋　耐熱","手袋　炉", "手袋　アラミド繊維","手袋　クリーンルーム", "手袋　シリコン"]
	 */
	metatagList?: string[];
	/**
	 * カテゴリ情報リスト(子)
	 * - 子カテゴリ情報（カテゴリ情報リストを返却）
	 */
	childCategoryList: Category[];
	/**
	 * 検索デバッグ情報
	 * - 検索時の内部処理の内容を表す文字列
	 * - example: CN|MT
	 * - NOTE: CN: カテゴリ名称にヒット
	 *         SV: スペック選択肢にヒット
	 *         MT: メタタグにヒット
	 */
	searchDebugInfo?: string;
	/**
	 * 表示順？
	 * NOTE: 外部設計書には存在しない。
	 */
	displayOrder?: number;
	/**
	 * メタタグ？
	 * NOTE: 外部設計書には存在しない。
	 */
	metaTag?: string;
}

/** メニューグループ */
export interface MenuGroup {
	/**
	 * メニューグループ名
	 * - メニューグループ名称
	 */
	menuGroupName?: string;
	/**
	 * メニューリスト
	 * - メニューのリスト
	 */
	menuList?: Menu[];
}

/** メニュー */
export interface Menu {
	/**
	 * メニュー名
	 * - メニューの名称
	 */
	menuName?: string;
	/**
	 * URL
	 * - 遷移先のURL
	 */
	url?: string;
	/**
	 * 別ウィンドウ表示フラグ
	 * - コンテンツを別ウィンドウで表示するかどうか
	 *   0: 同一ウィンドウで表示する
	 *   1: 別ウィンドウで表示する
	 */
	newWindowFlag?: Flag;
	/**
	 * 優先表示アイコンURL
	 * - 優先表示で使用するアイコンのURL
	 * - NOTE: 優先表示するメニューのみ値を返却
	 */
	priorityIconUrl?: string;
	/**
	 * 優先表示順
	 * - 優先表示する際の表示順
	 * - example: 1
	 * - NOTE: 優先表示するメニューのみ値を返却
	 */
	priorityDisplayOrder?: number;
}
