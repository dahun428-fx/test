import type { SelectedCadDataFormat } from '@/models/localStorage/CadDownloadStack_origin';

export const MAX_CADENAS_RETRY = 50;

export function isSucceeded(query: URLSearchParams) {
	const errorType = query.get('error_type');
	const mident = query.get('mident');
	const vonaPartNumber = query.get('vona_pn');
	const resolvedPartNumber = query.get('resolved_pn');

	if (!mident || !errorType) {
		return false;
	}

	if (errorType === 'OK') {
		return true;
	}

	if (
		(errorType === 'A' ||
			errorType === 'A0' ||
			errorType === 'B' ||
			errorType === 'B0') &&
		vonaPartNumber &&
		resolvedPartNumber &&
		vonaPartNumber === resolvedPartNumber
	) {
		return true;
	}

	return false;
}

/** Get CAD format saved in local storage */
export function getCadFormat(selected: SelectedCadDataFormat) {
	// TODO: Re-check version is `null` or `none`. Same in function `utils/cad.ts`
	if (selected.version && selected.version !== 'null') {
		return selected.version;
	}

	if (selected.format && selected.format !== 'others') {
		return selected.format;
	}

	return selected.formatOthers;
}
