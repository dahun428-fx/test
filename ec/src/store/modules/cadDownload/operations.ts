import { Dispatch } from 'redux';
import { cadDownloadActions } from '.';
import {
	CadDownloadStack,
	CadDownloadStackItem,
} from '@/models/localStorage/CadDownloadStack';
import { addCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';
import { CadDownloadError } from '@/store/modules/cadDownload/types';

export const updateItemsOperation = (dispatch: Dispatch) => {
	return (items: CadDownloadStackItem[]) => {
		dispatch(cadDownloadActions.setItems(items));
	};
};

export const updateShowsStatusOperation = (dispatch: Dispatch) => {
	return (show: boolean) => {
		dispatch(show ? cadDownloadActions.show() : cadDownloadActions.hide());
	};
};

export const updateStackOperation = (dispatch: Dispatch) => {
	return (stack: CadDownloadStack) => {
		dispatch(cadDownloadActions.updateStack(stack));
	};
};

export const removeItemOperation = (dispatch: Dispatch) => {
	return (id: string) => {
		dispatch(cadDownloadActions.removeItem(id));
	};
};

export const addItemOperation = (dispatch: Dispatch) => {
	return (item: CadDownloadStackItem) => {
		dispatch(cadDownloadActions.download(item));
		addCadDownloadStackItem(item);
	};
};

/** localStorage を更新しない item 追加。mobile は localStorage にタッチしてはいけないため涙を飲んで作られました…。 */
export const addItemWithoutLocalStorageOperation = (dispatch: Dispatch) => {
	return (item: CadDownloadStackItem) => {
		dispatch(cadDownloadActions.download(item));
	};
};

export const updateItemOperation = (dispatch: Dispatch) => {
	return (item: Partial<CadDownloadStackItem>) => {
		dispatch(cadDownloadActions.updateItem(item));
	};
};

export const setErrorOperation = (dispatch: Dispatch) => {
	return ({ stackId, type }: { stackId: string; type: CadDownloadError }) => {
		dispatch(cadDownloadActions.setError({ stackId, type }));
	};
};

export const clearAllErrorsOperation = (dispatch: Dispatch) => {
	return () => {
		dispatch(cadDownloadActions.clearAllErrors());
	};
};

export const clearOperation = (dispatch: Dispatch) => {
	return () => {
		dispatch(cadDownloadActions.clear());
	};
};
