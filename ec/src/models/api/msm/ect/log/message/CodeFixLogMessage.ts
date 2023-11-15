/** 型番確定ログメッセージ */
export interface CodeFixLogMessage {
	/** ブランドコード */
	brandCode: string;
	/** シリーズコード */
	seriesCode: string;
	/** 型番 */
	partNumber?: string;
	/** 瞬索くんコード */
	shunsakuCode?: '';
}
