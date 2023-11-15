/** 単純系型番確定ログメッセージ */
export interface CodeFixSimpleLogMessage {
	/** Action type */
	actionType: number;
	/** ブランドコード */
	brandCode: string;
	/** シリーズコード */
	seriesCode: string;
	/** 型番 */
	partNumber?: string;
	/** 瞬索くんコード */
	shunsakuCode?: '';
}
