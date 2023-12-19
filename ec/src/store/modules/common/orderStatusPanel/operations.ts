import { Dispatch } from 'redux';
import { orderStatusPanelActions } from '.';

export const updateShowsStatusOperation = (dispatch: Dispatch) => {
	return (show: boolean) => {
		dispatch(
			show ? orderStatusPanelActions.show() : orderStatusPanelActions.hide()
		);
	};
};
