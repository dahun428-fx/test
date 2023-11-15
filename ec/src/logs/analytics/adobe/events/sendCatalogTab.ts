/**
 * FIXME: NOTE:
 * catalog tab click の event であるにも関わらず、 aa の function は pdf download として log を送ってしまう。
 * aa function の開発側に報告と修正依頼は行っているものの（2023/2 時点で）数ヶ月以上修正は行われていない。
 * いつ修正されるのか分からないうちに同じ疑問にぶつかるロスを避けるためにもここに記載する。
 * 明確に修正が確認できた場合この記述は削除したい。
 */
export function sendCatalogTab() {
	try {
		// sc_f_products_pdf_dl が送られる（NOTE参照）
		window.sc_f_products_catalogtab?.();
	} catch {
		// Do nothing
	}
}
