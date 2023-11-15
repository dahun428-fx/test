/** 訪問ログリクエスト */
export interface VisitLogMessage {
	/** URL */
	url?: string;
	/** シリーズコード */
	seriesCode?: string;
	/** ブランドコード */
	brandCode?: string;
	/** 瞬索くんコード */
	shunsakuCode?: string;
	/**
	 * 階層コード
	 *
	 * var sc_class_cd の値を利用する
	 * ※sc_class_cdがない場合にotherとする
	 */
	classCode?: string;
	/**
	 * スペック検索表示タイプ
	 *
	 * スペック検索ページのみ
	 * - 1: 一覧表示
	 * - 2: 写真表示
	 * - 3: 仕様比較表示
	 */
	specSearchDispType?: string;
	/** Part number */
	partNumber?: string;
}
