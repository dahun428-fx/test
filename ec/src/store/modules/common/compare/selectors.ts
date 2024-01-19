import { AppState } from '@/store';

export function selectCompareCookies(state: AppState) {
	return state.compare;
}
