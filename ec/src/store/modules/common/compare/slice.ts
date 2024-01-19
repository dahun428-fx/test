import {
	CompareCookies,
	CompareCookiesItem,
} from '@/models/localStorage/CompareCookies';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CompareCookies = {
	items: [],
};

const slice = createSlice({
	name: 'compare',
	initialState,
	reducers: {
		setItem(state, action: PayloadAction<CompareCookiesItem>) {
			return {
				...state,
				compareCookies: [action.payload, ...state.items],
			};
		},
	},
});

export const { reducer: compareReducer, actions } = slice;
