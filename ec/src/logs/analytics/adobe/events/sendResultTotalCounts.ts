import { store } from '@/store';
import { selectEachHitCount } from '@/store/modules/pages/keywordSearch';

export function sendResultTotalCounts() {
	const eachCount = selectEachHitCount(store.getState());

	try {
		window.sc_f_search_results?.(
			eachCount.brand,
			eachCount.category,
			eachCount.series,
			eachCount.fullText,
			0, // v5以降ない機能
			eachCount.techInfo,
			eachCount.type,
			eachCount.inCADLibrary,
			0, // Cナビ (Malaysiaにない機能)
			eachCount.combo
		);
	} catch {
		// Do nothing
	}
}
