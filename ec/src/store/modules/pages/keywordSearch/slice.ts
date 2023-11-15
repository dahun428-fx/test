import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KeywordSearchState, Status } from './types';

const initialState: KeywordSearchState = {
	status: Status.INITIAL,
};

type UpdatePayload = Partial<KeywordSearchState>;

const slice = createSlice({
	name: 'pages/keywordSearch',
	initialState,
	reducers: {
		update(state, action: PayloadAction<UpdatePayload>) {
			return { ...state, ...action.payload };
		},
		addTypeSpecs(
			state,
			action: PayloadAction<KeywordSearchState['partNumberResponses']>
		) {
			return {
				...state,
				partNumberResponses: {
					...state.partNumberResponses,
					...action.payload,
				},
			};
		},
		clear() {
			return initialState;
		},
	},
});

export const { reducer: keywordSearchReducer, actions } = slice;
