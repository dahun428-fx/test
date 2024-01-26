import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CompareBalloon as Presenter } from './CompareBalloon';
import {
	selectCompare,
	selectShowCompareBalloon,
	updateCompareOperation,
	updateShowsCompareBalloonStatusOperation,
} from '@/store/modules/common/compare';
import { useSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import {
	getCompare,
	updateCheckedItemIfNeeded,
	updateCompare,
} from '@/services/localStorage/compare';
import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { Router } from 'next/router';

export const CompareBalloon: FC = () => {
	const initialized = useRef(false);

	const dispatch = useDispatch();

	const compare = useSelector(selectCompare);
	const compareShowStatus = useSelector(selectShowCompareBalloon);

	const selectedItemsForCheck = useRef<Set<CompareItem>>(new Set());
	const selectedActiveTab = useRef<string>('');

	const setCompare = useCallback(
		(compare: Compare) => {
			updateCompareOperation(dispatch)(compare);
		},
		[dispatch]
	);

	const handleClose = () => {
		updateCompare({ show: false });
		updateShowsCompareBalloonStatusOperation(dispatch)(false);
	};

	useEffect(() => {
		if (!compare.show) {
			console.log(
				'compare [compareBaloon container] ======> ',
				compare,
				selectedItemsForCheck.current,
				selectedActiveTab.current
			);
			updateCheckedItemIfNeeded(Array.from(selectedItemsForCheck.current));
			updateCompare({ active: selectedActiveTab.current });
		}
	}, [compare.show]);

	const generateCompareData = useCallback(() => {
		if (!initialized.current) {
			let compare = getCompare();
			updateCompare({ show: false });
			setCompare({ ...compare, show: false });
			initialized.current = true;
		}
	}, [dispatch, compareShowStatus, compare, setCompare]);

	useEffect(() => {
		const handleGenerateData = () => {
			generateCompareData();
		};
		handleGenerateData();
		Router.events.on('routeChangeComplete', handleGenerateData);
		return () => Router.events.off('routeChangeComplete', handleGenerateData);
	}, [generateCompareData]);

	return (
		<>
			<Presenter
				showStatus={compareShowStatus}
				selectedItemsForCheck={selectedItemsForCheck}
				selectedActiveTab={selectedActiveTab}
				handleClose={handleClose}
			/>
		</>
	);
};
