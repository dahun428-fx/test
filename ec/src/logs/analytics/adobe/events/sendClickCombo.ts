import { ClickComboPayload } from './types/ClickCombo';

export function sendClickCombo({
	brandCode,
	seriesCode,
	partNumber,
}: ClickComboPayload) {
	try {
		window.sc_searchresult_comboclicktopn?.(
			brandCode ?? '',
			seriesCode ?? '',
			partNumber ?? ''
		);
	} catch (e) {
		// Do nothing
	}
}
