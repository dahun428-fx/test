import { CadType } from './types/DownloadCad';

function sendDownloadCad(cadType: CadType) {
	try {
		window.sc_f_products_cad_dl?.(cadType);
	} catch {
		// Do nothing
	}
}

/** Download CADENAS */
export function sendDownloadCadenas() {
	sendDownloadCad('config');
}

/** Download SINUS */
export function sendDownloadSinus() {
	sendDownloadCad('SINUS');
}

/** Download web2Cad */
export function sendDownloadWeb2Cad() {
	sendDownloadCad('web2cad');
}

/** Download Fixed CAD */
export function sendDownloadFixedCad() {
	sendDownloadCad('fix');
}
