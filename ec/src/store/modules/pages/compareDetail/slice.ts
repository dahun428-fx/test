import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompareDetailLoadStatus, CompareDetailState } from './types';

const initialState: CompareDetailState = {
	status: CompareDetailLoadStatus.INITIAL,
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
	},
});

export const { reducer: compareDetailReducer, actions } = slice;
