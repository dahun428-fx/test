import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {};

type CompareLoadPayload = {
	seriesCode: string;
	partNumber: string;
	// seriesResponse: SearchSeriesResponse$detail;
	// partNumberResponse: SearchPartNumberResponse$search;
};

const slice = createSlice({
	name: '',
	initialState,
	reducers: {
		load(state, action: PayloadAction<CompareLoadPayload>) {
			return {
				...state,
				...action.payload,
				// currentPartNumberResponse: action.payload.partNumberResponse,
			};
		},
	},
});

export const { reducer: compareDetailReducer, actions } = slice;
