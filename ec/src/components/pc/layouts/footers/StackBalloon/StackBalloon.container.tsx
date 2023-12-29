import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { StackBalloon as Presenter } from './StackBalloon';
import { stackList } from './dummy';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	removeItemOperation,
	selectCadDownloadStack,
	updateItemOperation,
	updateShowsStatusOperation,
} from '@/store/modules/common/stack';
import { useSelector } from '@/store/hooks';
import { isEmpty } from '@/utils/predicate';
import { useDispatch } from 'react-redux';
import {
	removeCadDownloadStackItem,
	initializeCadDownloadStack,
} from '@/services/localStorage/cadDownloadStack';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useCancelCadDownloadModal } from '@/components/pc/layouts/footers/CadDownloadStatusBalloon/CancelCadDownloadModal';

export const StackBalloon: React.FC = () => {
	const stack = useSelector(selectCadDownloadStack);
	const dispatch = useDispatch();

	const { showMessage } = useMessageModal();

	const stackDoneList = useMemo(() => {
		return stack.items.filter(item => item.status === CadDownloadStatus.Done);
	}, [stack.items]);

	const stackPendingList = useMemo(() => {
		return stack.items.filter(item => item.status !== CadDownloadStatus.Done);
	}, [stack.items]);

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

	const handleDeleteItems = useCallback(() => {
		if (stack.tabDone) {
			if (isEmpty(Array.from(checkedDoneCadDownloadItems))) {
				showMessage('삭제할 데이터를 선택하세요.');
				return false;
			}
			checkedDoneCadDownloadItems.forEach(async item => {
				//stack state delete
				removeItemOperation(dispatch)(item.id);
				//localstorage delete
				removeCadDownloadStackItem(item);
			});
			setCheckedDoneCadDownloadItems(new Set());
		} else {
			if (isEmpty(Array.from(checkedPendingCadDownloadItems))) {
				showMessage('삭제할 데이터를 선택하세요.');
				return false;
			}
			checkedPendingCadDownloadItems.forEach(async item => {
				//stack state delete
				removeItemOperation(dispatch)(item.id);
				//localstorage delete
				removeCadDownloadStackItem(item);
			});
			setCheckedPendingCadDownloadItems(new Set());
		}
	}, [
		stack.tabDone,
		dispatch,
		checkedDoneCadDownloadItems,
		checkedPendingCadDownloadItems,
	]);

	const resetCheckedPendingCadDownloadItems = () => {
		setCheckedPendingCadDownloadItems(new Set());
	};

	const resetCheckedDoneCadDownloadItems = () => {
		setCheckedDoneCadDownloadItems(new Set());
	};

	const showCancelCadDownloadModal = useCancelCadDownloadModal();

	return (
		<>
			<Presenter
				handleSelectPendingItem={handleSelectPendingItem}
				handleSelectDoneItem={handleSelectDoneItem}
				handleSelectAllItem={handleSelectAllItem}
				handleDeleteItems={handleDeleteItems}
				resetCheckedPendingCadDownloadItems={
					resetCheckedPendingCadDownloadItems
				}
				resetCheckedDoneCadDownloadItems={resetCheckedDoneCadDownloadItems}
				showCancelCadDownloadModal={showCancelCadDownloadModal}
				doneList={stackDoneList}
				pendingList={stackPendingList}
				checkedDoneCadDownloadItems={checkedDoneCadDownloadItems}
				checkedPendingCadDownloadItems={checkedPendingCadDownloadItems}
			/>
		</>
	);
};
StackBalloon.displayName = 'StackBalloon';
