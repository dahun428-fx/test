import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	CompareDetail,
	CompareDetailLoadStatus,
	CompareDetailState,
} from './types';

const initialState: CompareDetailState = {
	status: CompareDetailLoadStatus.INITIAL,
	compareDetailItems: [],
};

type UpdatePayload = Partial<CompareDetailState>;

const slice = createSlice({
	name: 'pages/compareDetail',
	initialState,
	reducers: {
		update(state, action: PayloadAction<UpdatePayload>) {
			return {
				...state,
				...action.payload,
			};
		},
		removeItem(state, action: PayloadAction<CompareDetail>) {
			const remainItems = state.compareDetailItems.filter(
				item => item.idx !== action.payload.idx
			);
			return {
				...state,
				compareDetailItems: remainItems,
			};
		},
	},
});

export const { reducer: compareDetailReducer, actions } = slice;
