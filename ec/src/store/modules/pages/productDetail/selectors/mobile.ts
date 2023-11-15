import { AppState } from '@/store';

export function selectShowsSpecPanel(state: AppState) {
	return !!state.productDetail.showsSpecPanel;
}

export function selectShowsPartNumberListPanel(state: AppState) {
	return !!state.productDetail.showsPartNumberListPanel;
}
