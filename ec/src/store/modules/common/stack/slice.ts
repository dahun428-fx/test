import {
	CadDownloadStack,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CadDownloadStack = {
	items: [],
	len: 0,
	done: 0,
	show: false,
	shouldConfirm: false,
	tabDone: false,
};
const slice = createSlice({
	name: 'stack',
	initialState,
	reducers: {
		updateStack(state, action: PayloadAction<CadDownloadStack>) {
			return {
				...state,
				...action.payload,
			};
		},
		removeItem(state, action: PayloadAction<string>) {
			const remainItems = state.items.filter(
				item => item.id !== action.payload
			);
			return {
				...state,
				items: remainItems,
				done: remainItems.filter(item => item.status === CadDownloadStatus.Done)
					.length,
				len: remainItems.length,
			};
		},
		tabDone(state) {
			return { ...state, tabDone: true };
		},
		tabPutsth(state) {
			return { ...state, tabDone: false };
		},
		show(state) {
			return { ...state, show: true };
		},
		hide(state) {
			return { ...state, show: false };
		},
	},
});

export const { reducer: stackReducer, actions } = slice;
