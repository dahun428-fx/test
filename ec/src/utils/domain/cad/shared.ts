import { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack';
import { Cookie, getCookie } from '@/utils/cookie';

/** Get selected CAD data format from Cookie */
export function getSelectedCadDataFormat(): SelectedCadDataFormat {
	const format = getCookie(Cookie.CAD_DATA_FORMAT);
	if (!format) {
		return {};
	}

	try {
		return JSON.parse(decodeURIComponent(format));
	} catch (e) {
		return {};
	}
}
