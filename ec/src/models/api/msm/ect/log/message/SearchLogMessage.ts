import { Flag } from '@/models/api/Flag';

/** サイト内検索ログ */
export interface SearchLogMessage {
	/**
	 * 再検索フラグ
	 * - 0: 検索結果ページ以外から検索
	 * - 1: 検索結果ページから検索
	 */
	reSearchFlag?: Flag;
	/**
	 * 入力ワード
	 * ゆらぎ補正、類義語展開が実施される前の文字列
	 */
	userInput?: string;
	/**
	 * ブランドモード
	 * - 1: ブランドモードON
	 * - 2：ブランドモード無作動(常にこちらを指定)
	 * NOTE: 廃止にむけ調整するため実装不要であるが、現時点の現行システムでは実装されているため、
	 *  　　　検索結果ページに送信するように定義を加えた。
	 */
	brandMode?: '0' | '1' | '2';
	/** 検索ワード */
	keyword?: string;
	/**
	 * 検索タイプ
	 * - 1: キーワード検索
	 * - 2: 型番検索
	 * - 3: キーワードサジェスト
	 * - 4: 関連キーワードサジェスト
	 * - 5: COMBO 検索
	 */
	searchType?: SearchType;
	/**
	 * 検索結果タイプ
	 *
	 * ※SEARCH_TYPEにより解釈が異なるので注意
	 * - Hit：1: 何らかの検索結果が存在・2: 該当型番あり・3:該当サジェストワードあり
	 * - NotFound：1: 全ての検索結果なし（Combo含まず）・2: 該当型番なし・3:該当サジェストワードなし
	 * - Link：1: 検索結果表示後、商品詳細ページへの遷移・2: 商品詳細ページへの遷移 ・3: 検索結果ページへの遷移
	 * - LinkCtg：1: 検索結果表示後、カテゴリページへの遷移
	 * - LinkMaker：1: 検索結果表示後、メーカーページへの遷移
	 * - LinkKako：1: 検索結果表示後、メカニカル加工ページへの遷移
	 * - LinkKakoMore：1: 検索結果表示後、メカニカル加工　検索結果一覧ページへの遷移
	 * - LinkModu：1: 検索結果表示後、モジュラーページへの遷移
	 * - LinkModuMore：1: 検索結果表示後、モジュラー検索結果一覧ページへの遷移
	 * - LinkGSA：1: 検索結果表示後、全文検索ページへの遷移
	 * - LinkEnd：1: 検索結果表示後、規格廃止品ページへの遷移
	 * - LinkEndSub：1: 検索結果表示後、規格廃止品　代替品の商品詳細ページへの遷移
	 * - LinkEndMore：1: 検索結果表示後、規格廃止品検索結果一覧ページへの遷移
	 * - LinkKoza：1: 検索結果表示後、技術講座ページへの遷移
	 * - LinkKozaMore：1: 検索結果表示後、技術講座検索結果一覧ページへの遷移
	 * - LinkRfnCtg：1: 検索結果表示後、絞込条件でカテゴリを選択
	 * - LinkRfnShip：1: 検索結果表示後、絞込条件で出荷日を選択
	 * - LinkRfnMaker：1: 検索結果表示後、絞込条件でメーカーを選択
	 * - LinkRfnCad：1: 検索結果表示後、絞込条件でCADを選択
	 * - LinkCtgPath：1: 検索結果表示後、商品のパンくず属性からカテゴリページへの遷移
	 * - LinkInner：1: 検索結果表示後、インナーフルマッチによって出力された商品への遷移
	 * - LinkCombo：1: 検索結果表示後、Comboによって出力された型番候補を選択
	 * - LinkSplChk： 検索結果表示後、スペルチェック機能によって出力された単語を選択
	 */
	searchResultType?: string;
	/** URL */
	url?: string;
	/** シリーズコード */
	seriesCode?: string;
	/** ブランドコード */
	brandCode?: string;
	/** 遷移先ページURL */
	forwardPageUrl?: string;
	/** 遷移先ページURLの表示位置 */
	forwardPageUrlDispNo?: string;
	/** サジェスト件数 */
	suggestionsCount?: string;
	/** サジェスト選択キーワード */
	selectedKeyword?: string;
	/** サジェスト選択キーワードの表示位置 */
	selectedKeywordDispNo?: string;
	/**
	 * 未掲載型番一覧
	 * - 複数ある場合は型番をカンマ区切りで送信
	 */
	unpublishedList?: string;
	/** レスポンスタイム */
	responseTime?: string;
	/** 検索結果全体件数 */
	resultCount?: string;
	/** ブランド件数 */
	brandCount?: string;
	/** カテゴリ件数 */
	categoryCount?: string;
	/** シリーズ件数 */
	seriesCount?: string;
	/** inCadLibrary件数 */
	inCadLibraryCount?: string;
	/** Cナビ件数 */
	cNaviCount?: string;
	/** 全文検索結果件数 */
	fullTextSearchCount?: string;
	/** 規格廃止品件数 */
	discontinuedCount?: string;
	/** 技術情報件数 */
	technicalInfoCount?: string;
	/** インナーフルマッチ件数 */
	innerMatchingCount?: string;
	/** Comboの掲載型番件数 */
	comboCount?: string;
	/** 言い換えキーワード件数 */
	paraphraseCount?: string;
	/** 検索結果バナーのヒット件数 */
	bannerCount?: string;
	/** 言い換えキーワード候補リスト */
	paraphraseList?: string;
	/** 検索履歴のキーワード候補リスト */
	suggestHistoryList?: string;
	/** 履歴ワードによる再検索フラグ */
	suggestHistoryFlag?: string;
	/** プレビューの種類 */
	previewType?: string;
	/** プレビューのメーカー候補のブランドコードリスト */
	previewBrandList?: string;
	/** プレビューのカテゴリ候補のカテゴリコードリスト */
	previewCategoryList?: string;
	/** プレビューのシリーズ候補のシリーズコードリスト */
	previewSeriesList?: string;
	/** スペルチェックワード */
	suggestion?: string;
	/** B面フラグ */
	bTestFlag?: Flag;
	/** 型番前方一致件数 */
	prefixCount?: string;
	/** 規格廃止品件数（型番前方一致） */
	prefixdiscontinuedCount?: string;
}

const SearchType = {
	KEYWORD_SEARCH: '1',
	PART_NUMBER_SUGGEST: '2',
	KEYWORD_SUGGEST: '3',
	RELATED_KEYWORD_SUGGEST: '4',
	COMBO_SUGGEST: '5',
} as const;
type SearchType = typeof SearchType[keyof typeof SearchType];
export { SearchType };
