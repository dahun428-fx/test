import { OrderNowPayload } from './types/OrderNowEvents';

export function sendOrderNow({ partNumberCount }: OrderNowPayload = {}) {
	try {
		window.sc_f_products_ordernow?.(partNumberCount);
	} catch {
		// Do nothing
	}
}
