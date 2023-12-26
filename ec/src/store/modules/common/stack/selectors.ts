import { AppState } from '@/store';

export function selectShowCadDownloadBalloon(state: AppState) {
	return state.stack.show;
}

export function selectCadDownloadStack(state: AppState) {
	return state.stack;
}
