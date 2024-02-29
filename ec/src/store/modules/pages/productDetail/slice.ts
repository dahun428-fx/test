import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetailState } from './types';
import type { TemplateType } from '@/models/api/constants/TemplateType';
import { Sort } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { ReviewResponse } from '@/models/api/review/SearchReviewResponse';

const initialState: ProductDetailState = {
	templateType: null,
	seriesResponse: null,
	partNumberResponse: null,
	currentPartNumberResponse: null,
	priceCache: {},
};

type LoadPayload = {
	templateType: TemplateType;
	seriesResponse: SearchSeriesResponse$detail;
	partNumberResponse: SearchPartNumberResponse$search;
	page: number;
	sort?: Sort[];
	inputPartNumber?: string;
};
type UpdatePayload = Partial<ProductDetailState>;

const slice = createSlice({
	name: 'pages/productDetail',
	initialState,
	reducers: {
		load(state, action: PayloadAction<LoadPayload>) {
			return {
				...state,
				...action.payload,
				currentPartNumberResponse: action.payload.partNumberResponse,
			};
		},
		update(state, action: PayloadAction<UpdatePayload>) {
			return { ...state, ...action.payload };
		},
		updatePriceCache(state, action: PayloadAction<Price>) {
			const price = action.payload;
			return {
				...state,
				quantity: price.quantity,
				priceCache: {
					...state.priceCache,
					[`${price.partNumber}\t${price.quantity}`]: price,
				},
			};
			return state;
		},
		updateReview(state, action: PayloadAction<ReviewResponse>) {
			return {
				...state,
				reviewResponse: {
					...state.reviewResponse,
					...action.payload,
				},
			};
		},
		clear() {
			return initialState;
		},
	},
});

export const { reducer: productDetailReducer, actions } = slice;
