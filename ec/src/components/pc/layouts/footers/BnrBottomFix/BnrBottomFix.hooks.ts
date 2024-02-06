import { updateCadDownloadStack } from '@/services/localStorage/cadDownloadStack';
import { updateCompare } from '@/services/localStorage/compare';
import { useSelector } from '@/store/hooks';
import {
	selectCompareItemsLength,
	selectShowCompareBalloon,
	updateShowsCompareBalloonStatusOperation,
} from '@/store/modules/common/compare';
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

export const useCompare = () => {
	const dispatch = useDispatch();

	const compareShowStatus = useSelector(selectShowCompareBalloon);
	const compareItemLen = useSelector(selectCompareItemsLength);
	const setCompareShowStatus = useCallback(
		(show: boolean) => {
			updateShowsCompareBalloonStatusOperation(dispatch)(show);
			updateCompare({ show });
		},
		[dispatch]
	);
	return {
		compareItemLen,
		compareShowStatus,
		setCompareShowStatus,
	};
};
