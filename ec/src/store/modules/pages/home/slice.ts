import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeState } from './types';
import { authActions } from '@/store/modules/auth';

const initialState: HomeState = {
	orderInfoResponse: null,
	loadingOrderInfo: false,
};

type UpdatePayload = Partial<HomeState>;

const slice = createSlice({
	name: 'pages/home',
	initialState,
	reducers: {
		update: (state, action: PayloadAction<UpdatePayload>) => ({
			...state,
			...action.payload,
		}),
		clear: () => initialState,
	},
	// WARN: experimental implementation
	extraReducers(builder) {
		// 仮に GREFRESHTOKENHASH だけ不正で、GACCESSTOKENKEY が正常という状況があった場合、
		// 通信の都合で logout action 実行 -> update action 実行という順で実行された場合、
		// 画面上はログアウト状態なのに orderInfoResponse が存在するという状況になり得ます。
		// ただし、通常の使い方をしていれば発生しません。
		// 手で GREFRESHTOKENHASH だけ不正な値に書き換えてリロードした場合にだけ起き得ます。
		return builder.addCase(authActions.logout, state => {
			return { ...state, orderInfoResponse: null, loadingOrderInfo: false };
		});
	},
});

export const { reducer: homeReducer, actions } = slice;
