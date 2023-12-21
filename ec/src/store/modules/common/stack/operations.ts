import { Dispatch } from 'redux';
import { stackActions } from '.';
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
