import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryState } from './type';

const initialState: CategoryState = {};

export type LoadPayload = Pick<
	CategoryState,
	'categoryResponse' | 'seriesResponse' | 'brandIndexList'
>;
export type LoadBrandPayload = Pick<CategoryState, 'brandResponse'>;

const slice = createSlice({
	name: 'pages/category',
	initialState,
	reducers: {
		load(state, action: PayloadAction<LoadPayload>) {
			return { ...state, ...action.payload };
		},
		loadBrand(state, action: PayloadAction<LoadBrandPayload>) {
			return { ...state, ...action.payload };
		},
		clear() {
			return initialState;
		},
	},
});

export const { reducer: categoryReducer, actions } = slice;
