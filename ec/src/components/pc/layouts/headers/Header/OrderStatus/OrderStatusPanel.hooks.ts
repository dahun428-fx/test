import {
	selectShowOrderStatusPanel,
	updateShowsStatusOperation,
} from '@/store/modules/common/orderStatusPanel';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useOrderStatusPanel = () => {
	const dispatch = useDispatch();

	const showsStatus = useSelector(selectShowOrderStatusPanel);

	const setShowsStatus = useCallback(
		(show: boolean) => {
			updateShowsStatusOperation(dispatch)(show);
		},
		[dispatch]
	);

	return {
		showsStatus,
		setShowsStatus,
	};
};
