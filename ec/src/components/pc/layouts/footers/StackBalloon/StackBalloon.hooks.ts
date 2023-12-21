import { useSelector } from '@/store/hooks';
import {
	selectStackShowStatus,
	selectStackTabStatus,
	updateStackShowStatusOperation,
	updateStackTabStatusOperation,
} from '@/store/modules/common/stack';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useStackBalloon = () => {
	const dispatch = useDispatch();
	const stackShowStatus = useSelector(selectStackShowStatus);
	const stackTabStatus = useSelector(selectStackTabStatus);

	const [checkedPendingCad, setCheckedPendingCad] = useState<Set<string>>(
		new Set()
	);
	const [checkedDoneCad, setCheckedDoneCad] = useState<Set<string>>(new Set());

	const setStackShowStatus = useCallback(
		(show: boolean) => {
			updateStackShowStatusOperation(dispatch)(show);
		},
		[dispatch]
	);

	const setStackTabDone = useCallback(
		(tabDone: boolean) => {
			updateStackTabStatusOperation(dispatch)(tabDone);
		},
		[dispatch]
	);

	return {
		stackShowStatus,
		stackTabStatus,
		setStackShowStatus,
		setStackTabDone,
	};
};
