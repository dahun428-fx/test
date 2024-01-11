import { Dispatch } from 'redux';
import { stackActions } from '.';
import {
	CadDownloadStack,
	CadDownloadStackItem,
} from '@/models/localStorage/CadDownloadStack';
import { CadDownloadError } from '@/store/modules/cadDownload/types';
import { addCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';

export const updateShowsStatusOperation = (dispatch: Dispatch) => {
	return (show: boolean) => {
		dispatch(show ? stackActions.show() : stackActions.hide());
	};
};
//stack tabdone update
export const updateTabDoneStatusOperation = (dispatch: Dispatch) => {
	return (tabDone: boolean) => {
		dispatch(tabDone ? stackActions.tabDone() : stackActions.tabPutsth());
	};
};
//stack reducer update
export const updateStackOperation = (dispatch: Dispatch) => {
	return (stack: CadDownloadStack) => {
		dispatch(stackActions.updateStack(stack));
	};
};

export const removeItemOperation = (dispatch: Dispatch) => {
	return (id: string) => {
		dispatch(stackActions.removeItem(id));
	};
};

export const addItemOperation = (dispatch: Dispatch) => {
	return (item: CadDownloadStackItem) => {
		dispatch(stackActions.putsthItem(item));
		addCadDownloadStackItem(item);
	};
};

export const updateItemsOperation = (dispatch: Dispatch) => {
	return (items: CadDownloadStackItem[]) => {
		dispatch(stackActions.setItems(items));
	};
};

export const updateItemOperation = (dispatch: Dispatch) => {
	return (item: Partial<CadDownloadStackItem>) => {
		dispatch(stackActions.updateItem(item));
	};
};

export const setErrorOperation = (dispatch: Dispatch) => {
	return ({ stackId, type }: { stackId: string; type: CadDownloadError }) => {
		dispatch(stackActions.setError({ stackId, type }));
	};
};
