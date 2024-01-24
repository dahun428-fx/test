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
import { getCompare, updateCompare } from '@/services/localStorage/compare';
import { Compare } from '@/models/localStorage/Compare';
import { Router } from 'next/router';

export const CompareBalloon: FC = () => {
	const initialized = useRef(false);

	const dispatch = useDispatch();

	const compare = useSelector(selectCompare);
	const compareShowStatus = useSelector(selectShowCompareBalloon);

	const [activeCategoryCode, setActiveCategoryCode] = useState<string>();

	const tabHeadList = useMemo(() => {
		const categoryCodeList = compare.items.map(item => item.categoryCode);
		return categoryCodeList.reduce<string[]>(
			(previous, current) =>
				previous.includes(current) ? previous : [current, ...previous],
			[]
		);
	}, [compare.items]);

	const tabContentList = useMemo(() => {
		return compare.items.filter(
			item => item.categoryCode === activeCategoryCode
		);
	}, [compare.items, activeCategoryCode]);

	const setCompare = useCallback(
		(compare: Compare) => {
			updateCompareOperation(dispatch)(compare);
		},
		[dispatch]
	);

	const handleTabClick = (categoryCode: string) => {
		setActiveCategoryCode(categoryCode);
	};

	const handleClose = () => {
		updateCompare({ show: false });
		updateShowsCompareBalloonStatusOperation(dispatch)(false);
	};

	const generateCompareData = useCallback(() => {
		if (!initialized.current) {
			let compare = getCompare();
			updateCompare({ show: false });
			setCompare({ ...compare, show: false });
			initialized.current = true;
		}
	}, [dispatch, compare]);

	useEffect(() => {
		const handleGenerateData = () => {
			generateCompareData();
		};
		handleGenerateData();
		Router.events.on('routeChangeComplete', handleGenerateData);
		return () => Router.events.off('routeChangeComplete', handleGenerateData);
	}, [generateCompareData]);

	useEffect(() => {
		const compare = getCompare();
		if (!initialized.current || !compare.show) return;
		if (!compare || compare.items.length < 1) {
			return;
		}

		console.log('compare active ====> ', compare.active);
		const activeCode = compare.active
			? compare.active
			: tabHeadList[tabHeadList.length - 1];
		setActiveCategoryCode(activeCode);
	}, [compare.show, compare.active, tabHeadList]);

	return (
		<>
			<Presenter
				compare={compare}
				showStatus={compareShowStatus}
				tabHeads={tabHeadList}
				tabContents={tabContentList}
				activeCategoryCode={activeCategoryCode}
				handleTabClick={handleTabClick}
				handleClose={handleClose}
			/>
		</>
	);
};
