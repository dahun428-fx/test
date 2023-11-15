/**
 * 行情報
 */
export type RowData = Record<string, string>;

/**
 * どの項目がどの列を示すかを表すマップ
 */
export type ColumnMap = { [key: string]: string };

/**
 * 項目定義
 */
export type Property = {
	/** 項目名 */
	name: string;
	/** 項目論理名 */
	logicalName: string;
	/** 型 */
	type: string;
	/** 必須であるか */
	required: boolean;
	/** 説明 */
	descriptions?: string[];
	/** 子要素の型 */
	childDef?: { name: string; logicalName: string; from: number; to: number };
};

/**
 * インターフェース
 */
export type Model = {
	/** インターフェース名 */
	name: string;
	/** インターフェース論理名 */
	logicalName: string;
	/** 項目リスト */
	properties: Property[];
	/** ルートモデルか */
	root?: boolean;
};
