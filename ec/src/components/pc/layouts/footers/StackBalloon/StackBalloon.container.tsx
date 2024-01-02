import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { StackBalloon as Presenter } from './StackBalloon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	removeItemOperation,
	selectCadDownloadStack,
} from '@/store/modules/common/stack';
import { useSelector } from '@/store/hooks';
import { isEmpty } from '@/utils/predicate';
import { useDispatch } from 'react-redux';
import { removeCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useCancelCadDownloadModal } from '@/components/pc/layouts/footers/CadDownloadStatusBalloon/CancelCadDownloadModal';
import { useConfirmModal } from '@/components/pc/ui/modals/ConfirmModal';

export const StackBalloon: React.FC = () => {
	const stack = useSelector(selectCadDownloadStack);
	const dispatch = useDispatch();

	const { showMessage } = useMessageModal();
	const { showConfirm } = useConfirmModal();

	//CadDownloadStatus => done stack cad List
	//stack reducer 의 stack item 이 변경될 때마다 수행 ( dispatch )
	const stackDoneList = useMemo(() => {
		return stack.items.filter(item => item.status === CadDownloadStatus.Done);
	}, [stack.items]);

	//CadDownloadStatus => putsth, error, pending cad List
	//stack reducer 의 stack item 이 변경될 때마다 수행 ( dispatch )
	const stackPendingList = useMemo(() => {
		return stack.items.filter(item => item.status !== CadDownloadStatus.Done);
	}, [stack.items]);

	//사용자가 클릭한 cad pending, error, putsth list
	const [checkedPendingCadDownloadItems, setCheckedPendingCadDownloadItems] =
		useState<Set<CadDownloadStackItem>>(new Set());
	//사용자가 클릭한 cad done list
	const [checkedDoneCadDownloadItems, setCheckedDoneCadDownloadItems] =
		useState<Set<CadDownloadStackItem>>(new Set());

	const [checkedPendingCadDownloadIds, setCheckedPendingCadDownloadIds] =
		useState<Set<string>>(new Set());
	const [checkedDoneCadDownloadIds, setCheckedDoneCadDownloadIds] = useState<
		Set<string>
	>(new Set());

	console.log(stack.items, stackPendingList, checkedPendingCadDownloadItems);

	/**
	 * 다운로드 대기탭의 CadItem 클릭 이벤트
	 */
	const handleSelectPendingItem = useCallback(
		(pendingCad: CadDownloadStackItem) => {
			const isSelected = checkedPendingCadDownloadIds.has(pendingCad.id);
			if (isSelected) {
				checkedPendingCadDownloadIds.delete(pendingCad.id);
				checkedPendingCadDownloadItems.delete(pendingCad);
			} else {
				checkedPendingCadDownloadIds.add(pendingCad.id);
				checkedPendingCadDownloadItems.add(pendingCad);
			}

			setCheckedPendingCadDownloadIds(
				new Set(Array.from(checkedPendingCadDownloadIds))
			);
			setCheckedPendingCadDownloadItems(
				new Set(Array.from(checkedPendingCadDownloadItems))
			);
		},
		[checkedPendingCadDownloadItems, checkedPendingCadDownloadIds]
	);

	/**
	 * 다운로드 완료탭의 CadItem 클릭 이벤트
	 */
	const handleSelectDoneItem = useCallback(
		(doneCad: CadDownloadStackItem) => {
			const isSelected = checkedDoneCadDownloadIds.has(doneCad.id);
			if (isSelected) {
				checkedDoneCadDownloadItems.delete(doneCad);
				checkedDoneCadDownloadIds.delete(doneCad.id);
			} else {
				checkedDoneCadDownloadItems.add(doneCad);
				checkedDoneCadDownloadIds.add(doneCad.id);
			}
			setCheckedDoneCadDownloadIds(
				new Set(Array.from(checkedDoneCadDownloadIds))
			);
			setCheckedDoneCadDownloadItems(
				new Set(Array.from(checkedDoneCadDownloadItems))
			);
		},
		[checkedDoneCadDownloadItems, checkedDoneCadDownloadIds]
	);

	/**
	 * 전체 선택 버튼 클릭 이벤트
	 * stack tabDone 상태조회로 다운로드 대기탭 / 완료탭 구분하여 함수 실행
	 */
	const handleSelectAllItem = useCallback(() => {
		if (stack.tabDone) {
			if (stackDoneList.length === checkedDoneCadDownloadIds.size) {
				setCheckedDoneCadDownloadIds(new Set());
				setCheckedDoneCadDownloadItems(new Set());
			} else {
				setCheckedDoneCadDownloadIds(
					new Set(
						Array.from(
							stackDoneList.map(item => {
								return item.id;
							})
						)
					)
				);
				setCheckedDoneCadDownloadItems(new Set(Array.from(stackDoneList)));
			}
		} else {
			if (stackPendingList.length === checkedPendingCadDownloadItems.size) {
				setCheckedPendingCadDownloadIds(new Set());
				setCheckedPendingCadDownloadItems(new Set());
			} else {
				setCheckedPendingCadDownloadIds(
					new Set(
						Array.from(
							stackPendingList.map(item => {
								return item.id;
							})
						)
					)
				);
				setCheckedPendingCadDownloadItems(
					new Set(Array.from(stackPendingList))
				);
			}
		}
	}, [
		dispatch,
		stack.tabDone,
		stackDoneList,
		stackPendingList,
		checkedDoneCadDownloadItems,
		checkedPendingCadDownloadItems,
		checkedDoneCadDownloadIds,
		checkedPendingCadDownloadIds,
	]);

	/**
	 * 삭제 버튼 클릭 이벤트
	 * 사용자가 클릭한 CadItem 을 tabDone 여부에 따라 삭제
	 */
	const handleDeleteItems = useCallback(
		async downloadPendingItemSize => {
			if (stack.tabDone) {
				if (isEmpty(Array.from(checkedDoneCadDownloadItems))) {
					showMessage('삭제할 데이터를 선택하세요.');
					return false;
				}
				if (downloadPendingItemSize < 1) {
					const confirm = await showConfirm({
						message: `선택한 데이터 ${checkedDoneCadDownloadItems.size}건을 삭제하시겠습니까?`,
						confirmButton: '예',
						closeButton: '아니오',
					});
					if (!confirm) return;
				}
				checkedDoneCadDownloadItems.forEach(async item => {
					//stack state delete
					removeItemOperation(dispatch)(item.id);
					//localstorage delete
					removeCadDownloadStackItem(item);
				});
				setCheckedDoneCadDownloadIds(new Set());
				setCheckedDoneCadDownloadItems(new Set());
			} else {
				if (isEmpty(Array.from(checkedPendingCadDownloadItems))) {
					showMessage('삭제할 데이터를 선택하세요.');
					return false;
				}
				if (downloadPendingItemSize < 1) {
					const confirm = await showConfirm({
						message: `선택한 데이터 ${checkedPendingCadDownloadItems.size}건을 삭제하시겠습니까?`,
						confirmButton: '예',
						closeButton: '아니오',
					});
					if (!confirm) return;
				}
				checkedPendingCadDownloadItems.forEach(async item => {
					//stack state delete
					removeItemOperation(dispatch)(item.id);
					//localstorage delete
					removeCadDownloadStackItem(item);
				});
				setCheckedPendingCadDownloadIds(new Set());
				setCheckedPendingCadDownloadItems(new Set());
			}
		},
		[
			dispatch,
			stack.tabDone,
			checkedDoneCadDownloadItems,
			checkedPendingCadDownloadItems,
		]
	);

	//사용자가 클릭한 pending cadItem 리셋이벤트
	const resetCheckedPendingCadDownloadItems = () => {
		setCheckedPendingCadDownloadItems(new Set());
		setCheckedPendingCadDownloadIds(new Set());
	};

	const showCancelCadDownloadModal = useCancelCadDownloadModal();

	useEffect(() => {
		// if (stackDoneList.length < 1) {
		// 	return;
		// }
		setCheckedDoneCadDownloadItems(
			new Set(
				Array.from(
					stackDoneList.filter(item => checkedDoneCadDownloadIds.has(item.id))
				)
			)
		);
		setCheckedPendingCadDownloadItems(
			new Set(
				Array.from(
					stackPendingList.filter(item =>
						checkedPendingCadDownloadIds.has(item.id)
					)
				)
			)
		);
	}, [stack]);

	return (
		<>
			<Presenter
				handleSelectPendingItem={handleSelectPendingItem}
				handleSelectDoneItem={handleSelectDoneItem}
				handleSelectAllItem={handleSelectAllItem}
				handleDeleteItems={downloadPendingItemSize =>
					handleDeleteItems(downloadPendingItemSize)
				}
				resetCheckedPendingItems={resetCheckedPendingCadDownloadItems}
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
