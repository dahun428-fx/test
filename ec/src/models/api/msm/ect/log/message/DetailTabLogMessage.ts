export type TabName =
	| '1'
	| '2'
	| '3'
	| '4f' // CAD download 系
	| '4u' // CAD download 系
	| '5'
	| '6'
	| '7'
	| '9'
	| '10'
	| '11'
	| '12'
	| '13' // CAD download 系
	| '15' // CAD download 系
	| '16f' // 型番確定CAD (型番未確定CAD '16u' は、型番未確定CAD表示をしていないため実装なし)
	| '17' // CAD download 系
	| '21'
	| '22'
	| '23';

/** 商品詳細画面におけるタブ切り替えログ */
export interface DetailTabLogMessage {
	/** ブランドコード */
	brandCode: string;
	/** シリーズコード */
	seriesCode: string;
	/** タブ名 */
	tabName: TabName;
	/** URL */
	url: string;
}
