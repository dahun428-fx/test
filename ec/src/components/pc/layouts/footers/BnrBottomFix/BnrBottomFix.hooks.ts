import { useSelector } from '@/store/hooks';
import {
	selectShowCadDownloadBalloon,
	updateShowsStatusOperation,
} from '@/store/modules/common/stack';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useStack = () => {
	const dispatch = useDispatch();

	const stackShowStatus = useSelector(selectShowCadDownloadBalloon);
	const setStackShowStatus = useCallback(
		(show: boolean) => {
			console.log('setStackShow status :::: ====> ', show);
			updateShowsStatusOperation(dispatch)(show);
		},
		[dispatch]
	);

	return {
		stackShowStatus,
		setStackShowStatus,
	};
};
