import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { GetCustomerInfoResponse } from '@/models/api/msm/ect/customerInfo/GetCustomerInfoResponse';

const initialState: AuthState = {
	authenticated: false,
	isReady: false,
	userCode: null,
	customerCode: null,
	user: null,
	customer: null,
};

type LoginPayload = {
	userCode: string;
	customerCode: string | null;
	user: GetUserInfoResponse;
	customer?: GetCustomerInfoResponse;
};

type RestorePayload = {
	userCode: string;
	customerCode: string | null;
	expiresIn?: number;
	user: GetUserInfoResponse;
	customer?: GetCustomerInfoResponse;
};

const slice = createSlice({
	name: 'auth',
	initialState: initialState as AuthState,
	reducers: {
		login(state, action: PayloadAction<LoginPayload>) {
			return { authenticated: true, isReady: true, ...action.payload };
		},
		logout() {
			return { ...initialState, isReady: true };
		},
		restore(_, action: PayloadAction<RestorePayload>) {
			return { authenticated: true, isReady: true, ...action.payload };
		},
	},
});

export const { reducer: authReducer, actions } = slice;
