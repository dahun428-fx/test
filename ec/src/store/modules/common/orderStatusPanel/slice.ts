import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	show: false,
};

const slice = createSlice({
	name: 'orderStatusPanel',
	initialState,
	reducers: {
		show(state) {
			return { ...state, show: true };
		},
		hide(state) {
			return { ...state, show: false };
		},
	},
});

export const { reducer: orderStatusPanelReducer, actions } = slice;
