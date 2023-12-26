import { Dispatch } from 'redux';
import { stackActions } from '.';
import { CadDownloadStack } from '@/models/localStorage/CadDownloadStack';
// import {} from '.';

export const updateStackShowStatusOperation = (dispatch: Dispatch) => {
	return (show: boolean) => {
		dispatch(show ? stackActions.show() : stackActions.hide());
	};
};
export const updateStackTabStatusOperation = (dispatch: Dispatch) => {
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
