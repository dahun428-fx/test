import { AppState } from '@/store';

export function selectCompare(state: AppState) {
	return state.compare;
}
export function selectShowCompareBalloon(state: AppState) {
	return state.compare.show;
}
export function selectCompareActiveCategoryCode(state: AppState) {
	return state.compare.active;
}
