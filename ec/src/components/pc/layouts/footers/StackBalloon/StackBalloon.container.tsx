import {
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { StackBalloon as Presenter } from './StackBalloon';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	removeItemOperation,
	selectCadDownloadStack,
	updateItemOperation,
	updateItemsOperation,
} from '@/store/modules/common/stack';
import { useSelector } from '@/store/hooks';
import { isEmpty } from '@/utils/predicate';
import { useDispatch } from 'react-redux';
import { removeCadDownloadStackItem } from '@/services/localStorage/cadDownloadStack';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useCancelCadDownloadModal } from '@/components/pc/layouts/footers/CadDownloadStatusBalloon/CancelCadDownloadModal';
import { useConfirmModal } from '@/components/pc/ui/modals/ConfirmModal';
import { useTranslation } from 'react-i18next';

export const StackBalloon: React.FC = () => {
	const [t] = useTranslation();

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

	/**
	 * 다운로드 대기탭의 CadItem 클릭 이벤트
	 */
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
		},
		[checkedPendingCadDownloadItems]
	);

	/**
	 * 다운로드 완료탭의 CadItem 클릭 이벤트
	 */
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
		},
		[checkedDoneCadDownloadItems]
	);

	/**
	 * 전체 선택 버튼 클릭 이벤트
	 * stack tabDone 상태조회로 다운로드 대기탭 / 완료탭 구분하여 함수 실행
	 */
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
		dispatch,
		stack.tabDone,
		stackDoneList,
		stackPendingList,
		checkedDoneCadDownloadItems,
		checkedPendingCadDownloadItems,
	]);

	/**
	 * 삭제 버튼 클릭 이벤트
	 * 사용자가 클릭한 CadItem 을 tabDone 여부에 따라 삭제
	 */
	const handleDeleteItems = useCallback(
		async downloadPendingItemSize => {
			if (stack.tabDone) {
				if (isEmpty(Array.from(checkedDoneCadDownloadItems))) {
					showMessage(
						t(
							'components.ui.layouts.footers.stackBalloon.message.delete.choice'
						)
					);
					//삭제할 데이터를 선택하세요.
					return false;
				}
				if (downloadPendingItemSize < 1) {
					const confirm = await showConfirm({
						message: t(
							'components.ui.layouts.footers.stackBalloon.message.delete.confirm',
							{ length: checkedDoneCadDownloadItems.size }
						),
						// `선택한 데이터 ${checkedDoneCadDownloadItems.size}건을 삭제하시겠습니까?`,
						confirmButton: t(
							'components.ui.layouts.footers.stackBalloon.message.common.yes'
						), //예
						closeButton: t(
							'components.ui.layouts.footers.stackBalloon.message.common.no'
						), //아니오
					});
					if (!confirm) return;
				}
				checkedDoneCadDownloadItems.forEach(async item => {
					//stack state delete
					removeItemOperation(dispatch)(item.id);
					//localstorage delete
					removeCadDownloadStackItem(item);
				});
				setCheckedDoneCadDownloadItems(new Set());
				//Pending
			} else {
				if (isEmpty(Array.from(checkedPendingCadDownloadItems))) {
					showMessage(
						t(
							'components.ui.layouts.footers.stackBalloon.message.delete.choice'
						)
					);
					// '삭제할 데이터를 선택하세요.'
					return false;
				}
				if (downloadPendingItemSize < 1) {
					const confirm = await showConfirm({
						message: t(
							'components.ui.layouts.footers.stackBalloon.message.delete.confirm',
							{ length: checkedPendingCadDownloadItems.size }
						),
						// `선택한 데이터 ${checkedPendingCadDownloadItems.size}건을 삭제하시겠습니까?`
						confirmButton: t(
							'components.ui.layouts.footers.stackBalloon.message.common.yes'
						), //예
						closeButton: t(
							'components.ui.layouts.footers.stackBalloon.message.common.no'
						), //아니오
					});
					if (!confirm) return;
				}
				checkedPendingCadDownloadItems.forEach(async item => {
					//stack state delete
					removeItemOperation(dispatch)(item.id);
					//localstorage delete
					removeCadDownloadStackItem(item);
				});
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

	const showCancelCadDownloadModal = useCancelCadDownloadModal();

	useEffect(() => {
		const stackCondition = stack.show && !stack.tabDone && stack.len > 0;
		if (stackCondition) {
			const checkedIds = Array.from(checkedPendingCadDownloadItems).map(
				item => {
					return item.id;
				}
			);
			const items = stack.items.filter(item => {
				if (
					(checkedIds.includes(item.id) || item.checkOnStack) &&
					item.status !== CadDownloadStatus.Done
				) {
					return item;
				}
			});
			setCheckedPendingCadDownloadItems(new Set(items));
		}
	}, [stack.show, stack.items]);

	return (
		<>
			<Presenter
				handleSelectPendingItem={handleSelectPendingItem}
				handleSelectDoneItem={handleSelectDoneItem}
				handleSelectAllItem={handleSelectAllItem}
				handleDeleteItems={downloadPendingItemSize =>
					handleDeleteItems(downloadPendingItemSize)
				}
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
