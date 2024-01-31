import { AppState } from '@/store';

export function selectCompareDetailLoadStatus(state: AppState) {
	return state.compareDetail.status;
}
export function selectPartNumberResponses(state: AppState) {
	return state.compareDetail.partNumberItems;
}
export function selectSeriesResponses(state: AppState) {
	return state.compareDetail.seriesItems;
}
export function selectSpecListResponses(state: AppState) {
	return state.compareDetail.specItems;
}
