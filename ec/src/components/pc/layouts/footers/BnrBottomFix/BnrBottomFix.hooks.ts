import { updateCadDownloadStack } from '@/services/localStorage/cadDownloadStack';
import { useSelector } from '@/store/hooks';
import {
	selectCadDownloadLength,
	selectShowCadDownloadBalloon,
	updateShowsStatusOperation,
} from '@/store/modules/common/stack';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const useStack = () => {
	const dispatch = useDispatch();

	const stackShowStatus = useSelector(selectShowCadDownloadBalloon);
	const stackItemLen = useSelector(selectCadDownloadLength);
	const setStackShowStatus = useCallback(
		(show: boolean) => {
			updateShowsStatusOperation(dispatch)(show);
			updateCadDownloadStack({ show });
		},
		[dispatch]
	);

	return {
		stackShowStatus,
		stackItemLen,
		setStackShowStatus,
	};
};
