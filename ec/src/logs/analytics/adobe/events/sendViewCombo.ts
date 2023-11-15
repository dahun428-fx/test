export function sendViewCombo() {
	try {
		window.sc_searchresult_onlycombo?.();
	} catch {
		// Do nothing
	}
}
