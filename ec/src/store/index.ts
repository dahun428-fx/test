import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './modules/auth';
import { cacheReducer } from './modules/cache';
import { cadDownloadReducer } from './modules/cadDownload';
import { categoryReducer } from './modules/pages/category';
import { homeReducer } from './modules/pages/home/slice';
import { keywordSearchReducer } from './modules/pages/keywordSearch';
import { productDetailReducer } from './modules/pages/productDetail';
import { orderStatusPanelReducer } from './modules/common/orderStatusPanel';
import { stackReducer } from './modules/common/stack';
import { compareReducer } from './modules/common/compare';
import { compareDetailReducer } from './modules/pages/compareDetail';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		cache: cacheReducer,

		// pages
		home: homeReducer,
		keywordSearch: keywordSearchReducer,
		productDetail: productDetailReducer,
		category: categoryReducer,
		compareDetail: compareDetailReducer,

		// cad Download
		cadDownload: cadDownloadReducer,
		stack: stackReducer,
		// compare
		compare: compareReducer,

		//orderStatusPanel
		orderStatusPanel: orderStatusPanelReducer,
	},
	devTools: process.env.NODE_ENV === 'development',
});

export type GetState = typeof store.getState;
export type AppState = ReturnType<GetState>;
export type AppStore = typeof store;
