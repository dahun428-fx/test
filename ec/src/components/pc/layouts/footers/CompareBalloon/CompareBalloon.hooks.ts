import { Compare } from '@/models/localStorage/Compare';
import { getCompare, updateCompare } from '@/services/localStorage/compare';
import {
	selectCompare,
	updateCompareOperation,
} from '@/store/modules/common/compare';
import { Router } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useCompareBalloon = () => {
	const dispatch = useDispatch();
	const initialized = useRef(false);

	const compare = useSelector(selectCompare);

	console.log('hooks =====> compare : ', compare);
	// const setCompare = useCallback(
	// 	(compare: Compare) => {
	// 		updateCompareOperation(dispatch)(compare);
	// 	},
	// 	[dispatch]
	// );
	// console.log('useCompareBalloon ===> ', compare);
	// const generateCompareData = useCallback(() => {
	// 	if (!initialized.current) {
	// 		let compare = getCompare();
	// 		updateCompare({ show: false });
	// 		setCompare({ ...compare, show: false });
	// 		initialized.current = true;
	// 	}
	// }, [dispatch, compare]);

	// useEffect(() => {
	// 	const handleGenerateData = () => {
	// 		generateCompareData();
	// 	};
	// 	handleGenerateData();
	// 	Router.events.on('routeChangeComplete', handleGenerateData);
	// 	return () => Router.events.off('routeChangeComplete', handleGenerateData);
	// }, [generateCompareData]);
	return {
		compare,
	};
};
