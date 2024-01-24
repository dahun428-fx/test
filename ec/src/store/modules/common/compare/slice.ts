import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Compare = {
	items: [],
	show: false,
	active: '',
};

const slice = createSlice({
	name: 'compare',
	initialState,
	reducers: {
		setItem(state, action: PayloadAction<CompareItem>) {
			return {
				...state,
				items: [action.payload, ...state.items],
			};
		},
		removeItem(state, action: PayloadAction<CompareItem>) {
			const remainItems = state.items.filter(
				item =>
					item.seriesCode !== action.payload.seriesCode ||
					item.partNumber !== action.payload.partNumber
			);
			return {
				...state,
				items: remainItems,
				active: '',
			};
		},
		updateCompare(state, action: PayloadAction<Compare>) {
			return { ...state, ...action.payload };
		},
		show(state) {
			return { ...state, show: true };
		},
		hide(state) {
			return { ...state, show: false };
		},
	},
});

export const { reducer: compareReducer, actions } = slice;
