import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { Dispatch } from 'redux';
import { compareActions } from '.';
import { addCompareItem } from '@/services/localStorage/compare';

export const updateShowsCompareBalloonStatusOperation = (
	dispatch: Dispatch
) => {
	return (show: boolean) => {
		dispatch(show ? compareActions.show() : compareActions.hide());
	};
};

export const addItemOperation = (dispatch: Dispatch) => {
	return (item: CompareItem) => {
		dispatch(compareActions.setItem(item));
		addCompareItem(item);
	};
};

export const updateCompareOperation = (dispatch: Dispatch) => {
	return (compare: Compare) => {
		dispatch(compareActions.updateCompare(compare));
	};
};

export const removeItemOperation = (dispatch: Dispatch) => {
	return (compareItem: CompareItem) => {
		dispatch(compareActions.removeItem(compareItem));
	};
};
