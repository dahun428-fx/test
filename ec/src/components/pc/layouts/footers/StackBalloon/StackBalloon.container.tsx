import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { StackBalloon as Presenter } from './StackBalloon';
import { stackList } from './dummy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	selectCadDownloadStack,
	updateStackShowStatusOperation,
} from '@/store/modules/common/stack';
import { useSelector } from '@/store/hooks';

export const StackBalloon: React.FC = () => {
	const stack = useSelector(selectCadDownloadStack);

	const stackDoneList = useMemo(() => {
		return stackList.filter(item => item.status === CadDownloadStatus.Done);
	}, [stackList]);

	const stackPendingList = useMemo(() => {
		return stackList.filter(item => item.status !== CadDownloadStatus.Done);
	}, [stackList]);

	const [checkedPendingCadDownloadItems, setCheckedPendingCadDownloadItems] =
		useState<Set<CadDownloadStackItem>>(new Set());
	const [checkedDoneCadDownloadItems, setCheckedDoneCadDownloadItems] =
		useState<Set<CadDownloadStackItem>>(new Set());

	const handleSelectPendingItem = useCallback(
		(pendingCad: CadDownloadStackItem) => {
			const isSelected = checkedPendingCadDownloadItems.has(pendingCad);
			if (isSelected) {
				checkedPendingCadDownloadItems.delete(pendingCad);
			} else {
				checkedPendingCadDownloadItems.add(pendingCad);
			}

			setCheckedPendingCadDownloadItems(
				new Set(Array.from(checkedPendingCadDownloadItems))
			);
			console.log(checkedPendingCadDownloadItems);
		},
		[checkedPendingCadDownloadItems]
	);

	const handleSelectDoneItem = useCallback(
		(doneCad: CadDownloadStackItem) => {
			const isSelected = checkedDoneCadDownloadItems.has(doneCad);
			if (isSelected) {
				checkedDoneCadDownloadItems.delete(doneCad);
			} else {
				checkedDoneCadDownloadItems.add(doneCad);
			}

			setCheckedDoneCadDownloadItems(
				new Set(Array.from(checkedDoneCadDownloadItems))
			);
			console.log(checkedDoneCadDownloadItems);
		},
		[checkedDoneCadDownloadItems]
	);

	const handleSelectAllItem = useCallback(() => {
		if (stack.tabDone) {
			if (stackDoneList.length === checkedDoneCadDownloadItems.size) {
				setCheckedDoneCadDownloadItems(new Set());
			} else {
				setCheckedDoneCadDownloadItems(new Set(Array.from(stackDoneList)));
			}
		} else {
			if (stackPendingList.length === checkedPendingCadDownloadItems.size) {
				setCheckedPendingCadDownloadItems(new Set());
			} else {
				setCheckedPendingCadDownloadItems(
					new Set(Array.from(stackPendingList))
				);
			}
		}
	}, [
		stack.tabDone,
		stackDoneList,
		stackPendingList,
		checkedDoneCadDownloadItems,
		checkedPendingCadDownloadItems,
	]);

	const handleCadDownloadClick = useCallback(() => {
		if (stack.tabDone) {
			console.log(checkedDoneCadDownloadItems);
		} else {
			console.log(checkedPendingCadDownloadItems);
		}
	}, [
		stack.tabDone,
		checkedDoneCadDownloadItems,
		checkedPendingCadDownloadItems,
	]);

	useEffect(() => {
		setCheckedDoneCadDownloadItems(new Set());
		setCheckedPendingCadDownloadItems(new Set());
	}, []);

	return (
		<>
			<Presenter
				handleSelectPendingItem={handleSelectPendingItem}
				handleSelectDoneItem={handleSelectDoneItem}
				handleSelectAllItem={handleSelectAllItem}
				handleCadDownloadClick={handleCadDownloadClick}
				doneList={stackDoneList}
				pendingList={stackPendingList}
				checkedDoneCadDownloadItems={checkedDoneCadDownloadItems}
				checkedPendingCadDownloadItems={checkedPendingCadDownloadItems}
			/>
		</>
	);
};
StackBalloon.displayName = 'StackBalloon';
