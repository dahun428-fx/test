import { AppState } from '@/store';

export function selectShowCadDownloadBalloon(state: AppState) {
	return state.stack.show;
}

export function selectCadDownloadStack(state: AppState) {
	return state.stack;
}

export function selectCadDownloadLength(state: AppState) {
	return state.stack.len;
}
/** Get cad download errors */
export function selectCadDownloadErrors(state: AppState) {
	return state.stack.errors;
}
