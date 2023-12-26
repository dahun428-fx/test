import {
	CadDownloadStack,
	CadDownloadStackItem,
} from '@/models/localStorage/CadDownloadStack';
import { useSelector } from '@/store/hooks';
import {
	selectShowCadDownloadBalloon,
	selectCadDownloadStack,
	updateStackOperation,
	updateShowsStatusOperation,
	updateTabDoneStatusOperation,
} from '@/store/modules/common/stack';
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCadDownloadStack } from '@/services/localStorage/cadDownloadStack';

export const useStackBalloon = () => {
	const showsStatus = useSelector(selectShowCadDownloadBalloon);
	const cadDownloadStack = useSelector(selectCadDownloadStack);

	const initialized = useRef(false);
	const dispatch = useDispatch();

	const setShowsStatus = useCallback(
		(show: boolean) => {
			updateShowsStatusOperation(dispatch)(show);
		},
		[dispatch]
	);

	const setTabDone = useCallback(
		(tabDone: boolean) => {
			updateTabDoneStatusOperation(dispatch)(tabDone);
		},
		[dispatch]
	);

	const setCadDownloadStack = useCallback(
		(stack: CadDownloadStack) => {
			updateStackOperation(dispatch)(stack);
		},
		[dispatch]
	);

	const generateCadData = useCallback(async () => {
		//auth
		// if (!auth.isReady || !auth.authenticated) {
		// 	return;
		// }
		//api token
		// const token = generateToken(c => (cancelerRef.current = c));

		let stack: CadDownloadStack;

		if (!initialized.current) {
			//removeExpiryItemIfNeeded();
			stack = getCadDownloadStack();
			setCadDownloadStack(stack);
			initialized.current = true;
		}
		stack = cadDownloadStack;

		console.log('stack : ', stack);
	}, [dispatch, setShowsStatus, showsStatus]);

	return {
		showsStatus,
		cadDownloadStack,
		setShowsStatus,
		setTabDone,
		generateCadData,
	};
};
