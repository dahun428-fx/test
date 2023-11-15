import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './modules/auth';
import { cacheReducer } from './modules/cache';
import { cadDownloadReducer } from './modules/cadDownload';
import { categoryReducer } from './modules/pages/category';
import { homeReducer } from './modules/pages/home/slice';
import { keywordSearchReducer } from './modules/pages/keywordSearch';
import { productDetailReducer } from './modules/pages/productDetail';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cache: cacheReducer,

		// pages
		home: homeReducer,
		keywordSearch: keywordSearchReducer,
		productDetail: productDetailReducer,
		category: categoryReducer,

		// cad Download
		cadDownload: cadDownloadReducer,
	},
	devTools: process.env.NODE_ENV === 'development',
});

export type GetState = typeof store.getState;
export type AppState = ReturnType<GetState>;
export type AppStore = typeof store;
