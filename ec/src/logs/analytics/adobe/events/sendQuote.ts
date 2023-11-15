export function sendQuote() {
	try {
		window.sc_f_products_quote_directwos?.();
	} catch {
		// Do nothing
	}
}
