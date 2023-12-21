import { AppState } from '@/store';

export function selectStackShowStatus(state: AppState) {
	return state.stack.show;
}

export function selectStackTabStatus(state: AppState) {
	return state.stack.tabDone;
}
