import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	show: false,
	tabDone: false, //tab : 다운로드 대기 ( false ), 다운로드 완료 ( true )
};
const slice = createSlice({
	name: 'stack',
	initialState,
	reducers: {
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
