import { Dispatch } from 'redux';
import { stackActions } from '.';
import { CadDownloadStack } from '@/models/localStorage/CadDownloadStack';
import { cadDownloadActions } from '../../cadDownload';

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
