/**
 * PUカタログダウンロードイベントログ
 */
export function detailPUCatalogDL(
	seriesCode = '',
	seriesName = '',
	partNumber = ''
) {
	try {
		window.sc_f_detailpunit_pndl?.(seriesCode, seriesName, partNumber);
	} catch {
		// Do nothing
	}
}
