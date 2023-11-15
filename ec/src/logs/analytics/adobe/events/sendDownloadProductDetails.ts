export function sendDownloadProductDetails() {
	try {
		window.sc_f_product_sheetDL?.();
	} catch {
		// Do nothing
	}
}
