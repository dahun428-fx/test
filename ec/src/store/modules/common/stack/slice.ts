import {
	CadDownloadStack,
	CadDownloadStatus,
	CadDownloadStackItem,
} from '@/models/localStorage/CadDownloadStack';
import { CadDownloadError, CadDownloadState } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CadDownloadState = {
	items: [],
	len: 0,
	done: 0,
	show: false,
	shouldConfirm: false,
	tabDone: false,
};
const slice = createSlice({
	name: 'stack',
	initialState,
	reducers: {
		putsthItems(state, action: PayloadAction<CadDownloadStackItem[]>) {
			return {
				...state,
				show : true,
				items: [...action.payload, ...state.items],
				len: state.len + action.payload.length,
			}
		},
		setItems(state, action: PayloadAction<CadDownloadStackItem[]>) {
			return {
				...state,
				items: action.payload,
			};
		},
		updateStack(state, action: PayloadAction<CadDownloadStack>) {
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
		tabDone(state) {
			return { ...state, tabDone: true };
		},
		tabPutsth(state) {
			return { ...state, tabDone: false };
		},
		show(state) {
			return { ...state, show: true };
		},
		hide(state) {
			return { ...state, show: false };
		},
	},
});

export const { reducer: stackReducer, actions } = slice;
