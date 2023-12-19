import { AppState } from '@/store';

export function selectShowOrderStatusPanel(state: AppState) {
	return state.orderStatusPanel.show;
}
