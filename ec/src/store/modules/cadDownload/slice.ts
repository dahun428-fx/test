import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CadDownloadState, CadDownloadError } from './types';
import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';

const initialState: CadDownloadState = {
	show: false,
	items: [],
	len: 0,
	done: 0,
	// TODO: confirm is not used
	shouldConfirm: false,
};

const slice = createSlice({
	name: 'cadDownload',
	initialState,
	reducers: {
		download(state, action: PayloadAction<CadDownloadStackItem>) {
			return {
				...state,
				show: true,
				items: [action.payload, ...state.items],
				len: state.len + 1,
			};
		},
		setItems(state, action: PayloadAction<CadDownloadStackItem[]>) {
			return {
				...state,
				items: action.payload,
			};
		},
		updateStack(state, action: PayloadAction<CadDownloadState>) {
			return {
				...state,
				...action.payload,
			};
		},
		removeItem(state, action: PayloadAction<string>) {
			const remainItems = state.items.filter(
				item => item.id !== action.payload
			);
			return {
				...state,
				items: remainItems,
				done: remainItems.filter(item => item.status === CadDownloadStatus.Done)
					.length,
				len: remainItems.length,
			};
		},
		updateItem(state, action: PayloadAction<Partial<CadDownloadStackItem>>) {
			const updatedItems = state.items.map(item => {
				if (item.id === action.payload.id) {
					return {
						...item,
						...action.payload,
					};
				}
				return item;
			});
			return {
				...state,
				items: updatedItems,
				done: updatedItems.filter(
					item => item.status === CadDownloadStatus.Done
				).length,
			};
		},
		show(state) {
			return { ...state, show: true };
		},
		hide(state) {
			return { ...state, show: false };
		},
		setError(
			state,
			action: PayloadAction<{ stackId: string; type: CadDownloadError }>
		) {
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.stackId]: action.payload.type,
				},
			};
		},
		clearAllErrors(state) {
			return {
				...state,
				errors: undefined,
			};
		},
		clear() {
			return { ...initialState };
		},
	},
});

export const { reducer: cadDownloadReducer, actions } = slice;
