import { CheckPricePayload } from './types/CheckPriceEvents';

export function sendCheckPrice({ partNumberCount }: CheckPricePayload = {}) {
	try {
		window.sc_f_products_price_check?.(partNumberCount);
	} catch {
		// Do nothing
	}
}
