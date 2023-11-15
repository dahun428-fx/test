/**
 * APIから実際に返却される構造
 */
export interface GeneralRecommendAPIResponse {
	contents: GetGeneralRecommendResponse;
}

/**
 * generalRecommendモジュールを経由して利用される。
 * 便宜上contents以下にフォーカスして利用しやすいように実質的実態の配列のみに絞ったもの
 */
export type GetGeneralRecommendResponse =
	| GeneralRecommendSeriesItem[]
	| GeneralRecommendCategoryItem[];

interface CommonGeneralRecommendItem {
	/* イメージURL */
	imgUrl: string;
	/* リンクURL */
	linkUrl: string;
	/* logging用。response取得後の処理として追加付与し、logging時に参照させる */
	position: number;
	/* logging用。ログは初回表示時の1回のみでよいので、送信完了後にtrue化してフラグ判定に使う */
	initialized: boolean;
}
export interface GeneralRecommendSeriesItem extends CommonGeneralRecommendItem {
	/* シリーズコード */
	seriesCode: string;
	/* シリーズ名 */
	seriesName: string;
	/* ブランド名 */
	brandName: string;
	/* 通貨 */
	currencyCode: string;
	/* 最小通常単価 */
	minStandardUnitPrice: string;
	/* 最大通常単価 */
	maxStandardUnitPrice: string;
	/* 最小通常出荷日数 */
	minStandardDaysToShip: string;
	/* 最大通常出荷日数 */
	maxStandardDaysToShip: string;
	/* 最小最短出荷日数 */
	minShortestDaysToShip: string;
	/* 最大最短出荷日数 */
	maxShortestDaysToShip: string;
}

export interface GeneralRecommendCategoryItem
	extends CommonGeneralRecommendItem {
	/** category name */
	name: string;
	/** category code */
	itemCd: string;
}
