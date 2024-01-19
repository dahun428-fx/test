import { CompareCookiesItem } from '@/models/localStorage/CompareCookies';
import { Dispatch } from 'redux';
import { compareActions } from '.';
import { addCompareItem } from '@/services/localStorage/compare';

export const addItemOperation = (dispatch: Dispatch) => {
	return (item: CompareCookiesItem) => {
		dispatch(compareActions.setItem(item));
		addCompareItem(item);
	};
};
