/** Payload for Quote or Order on WOS */
export type QuoteOrderPayload = {
	productName: string;
	productId: string;
	productPageUrl: string;
	productImgUrl: '';
	partNumber: string;
	innerCd: string;
	makerCd: string;
	makerName: string;
	amount: string;
	campaignEndDate: '';
	pack: string;
	unitPrice: string;
	catalogPrice: string;
	totalPriceWithTaxes: string;
	days: string;
	stoke: string;
	estimateOutF: '';
	productType: '';
	siteId: '';
	errorCd: '';
	errorMessage: '';
	errorDivision: '';
	prjPath: '';
};
