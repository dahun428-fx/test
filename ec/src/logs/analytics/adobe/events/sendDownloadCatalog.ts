export function sendDownloadCatalog() {
	try {
		window.sc_f_products_pdf_dl?.();
	} catch {
		// Do nothing
	}
}
