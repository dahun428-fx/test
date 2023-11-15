import { QuoteOrderPayload } from '@/models/domain/order';
import { postFormData } from '@/utils/domain/form';
import { normalizeUrl, url } from '@/utils/url';

type Payload = {
	seriesCode?: string;
	seriesName?: string;
	innerCode?: string;
	partNumber: string;
	brandCode: string;
	brandName?: string;
	quantity: number;
	piecesPerPackage?: number;
	unitPrice?: number;
	standardUnitPrice?: number;
	totalPriceIncludingTax?: number;
	daysToShip?: number;
	expressType?: string;
};

/** Move to order page */
export function moveToOrder(payload: Payload) {
	post(url.directOrder, payload);
}

/** Move to quote page */
export function moveToQuote(payload: Payload) {
	post(url.directQuotation, payload);
}

/** Move to checkout page */
export function moveToCheckout(payload: Payload) {
	post(url.directCheckout, payload);
}

function post(url: string, payload: Payload) {
	postFormData<QuoteOrderPayload>(url, [
		{
			productName: payload.seriesName ?? '',
			productId: payload.seriesCode ?? '',
			productPageUrl: normalizeUrl(location.href),
			productImgUrl: '',
			partNumber: payload.partNumber,
			innerCd: payload.innerCode ?? '',
			makerCd: payload.brandCode,
			makerName: payload.brandName ?? '',
			amount: String(payload.quantity ?? ''),
			campaignEndDate: '',
			pack: String(payload.piecesPerPackage ?? ''),
			unitPrice: String(payload.unitPrice ?? ''),
			catalogPrice: String(payload.standardUnitPrice ?? ''),
			totalPriceWithTaxes: String(payload.totalPriceIncludingTax ?? ''),
			days: String(payload?.daysToShip ?? ''),
			stoke: payload.expressType ?? '',
			estimateOutF: '',
			productType: '',
			siteId: '',
			errorCd: '',
			errorMessage: '',
			errorDivision: '',
			prjPath: '',
		},
	]);
}
