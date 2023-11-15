import { AddToCartOrOrderNowPayload } from './types/AddToCartOrOrderNowEvents';

export function sendAddToCartOrOrderNow({
	partNumber,
	brandCode,
}: AddToCartOrOrderNowPayload) {
	try {
		window.sc_searchresultnonecatalog_sku_gen?.(partNumber, brandCode);
	} catch {
		// Do nothing
	}
}
