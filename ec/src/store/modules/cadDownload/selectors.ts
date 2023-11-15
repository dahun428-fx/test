import { AppState } from '@/store';

/** auth module */
export function selectCadDownloadItems(state: AppState) {
	return state.cadDownload.items;
}

/** Cad download balloon is show or not */
export function selectShowCadDownloadBalloon(state: AppState) {
	return state.cadDownload.show;
}

/** Get cad download stack */
export function selectCadDownloadStack(state: AppState) {
	return state.cadDownload;
}

/** Get cad download errors */
export function selectCadDownloadErrors(state: AppState) {
	return state.cadDownload.errors;
}
