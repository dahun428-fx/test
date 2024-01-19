export interface CompareCookies {
	items: CompareCookiesItem[];
}

export interface CompareCookiesItem {
	categoryCode: string;
	seriesCode: string;
	partNumber: string;
	expire: string;
	categoryCode1?: string;
	categoryName1?: string;
	categoryCode2?: string;
	categoryName2?: string;
	categoryCode3?: string;
	categoryName3?: string;
	categoryCode4?: string;
	categoryName4?: string;
	categoryCode5?: string;
	categoryName5?: string;
	minQuantity?: number;
	innerCode?: string;
	isPu: boolean;
	chk?: number;
}
