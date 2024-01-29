import React, {
	MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { CompareTabContent as Presenter } from './CompareTabContent';
import { CompareItem } from '@/models/localStorage/Compare';
import {
	removeItemOperation,
	selectCompare,
	updateCompareOperation,
} from '@/store/modules/common/compare';
import { useDispatch, useSelector } from 'react-redux';
import { getCompare, removeCompareItem } from '@/services/localStorage/compare';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useRouter } from 'next/router';
import { useConfirmModal } from '@/components/pc/ui/modals/ConfirmModal';

type Props = {
	selectedItemsForCheck: MutableRefObject<Set<CompareItem>>;
	selectedActiveTab: MutableRefObject<string>;
};

export const CompareTabContent = React.memo<Props>(
	({ selectedItemsForCheck, selectedActiveTab }) => {
		const dispatch = useDispatch();
		const router = useRouter();
		const compare = useSelector(selectCompare);

		const { showConfirm } = useConfirmModal();

		const [selectedItems, setSelectedItems] = useState<Set<CompareItem>>(
			new Set()
		);
		const [activeCategoryCode, setActiveCategoryCode] = useState<string>('');

		const tabHeadList = useMemo(() => {
			const categoryCodeList = compare.items.map(item => item.categoryCode);
			return categoryCodeList.reduce<string[]>(
				(previous, current) =>
					previous.includes(current) ? previous : [current, ...previous],
				[]
			);
		}, [compare, compare.items]);

		const tabContentList = useMemo(() => {
			return compare.items.filter(
				item => item.categoryCode === activeCategoryCode
			);
		}, [compare, compare.items, activeCategoryCode]);

		const activeSelectedItems = useMemo(() => {
			return Array.from(selectedItems).filter(
				item => item.categoryCode === activeCategoryCode
			);
		}, [selectedItems, activeCategoryCode]);

		const totalCount = useMemo(() => {
			return tabContentList.length;
		}, [tabContentList]);

		const selectedCount = useMemo(() => {
			return activeSelectedItems.length;
		}, [selectedItems, activeCategoryCode]);

		const handleTabClick = (categoryCode: string) => {
			setActiveCategoryCode(categoryCode);
		};

		const handleTabDelete = useCallback(async () => {
			if (tabContentList.length < 1) return;
			console.log('handledTabDelete ====>', tabContentList);

			// const categoryName = getCategoryName(tabContentList[0]?.categoryCode)
			const categoryName = tabContentList[0]?.categoryName;
			const confirm = await showConfirm({
				message: `${categoryName}의 모든 형번이 삭제됩니다. ${categoryName}을(를) 삭제하시겠습니까?`,
				confirmButton: '예',
				closeButton: '아니오',
			});
			if (!confirm) return;

			tabContentList.forEach(async item => {
				selectedItems.delete(item);
				removeItemOperation(dispatch)(item);
				removeCompareItem(item);
			});
		}, [tabContentList, selectedItems]);

		const handleSelectItem = useCallback(
			(compareItem: CompareItem) => {
				const isSelected = selectedItems.has(compareItem);
				if (isSelected) {
					selectedItems.delete(compareItem);
				} else {
					selectedItems.add(compareItem);
				}
				setSelectedItems(new Set(Array.from(selectedItems)));
			},
			[selectedItems]
		);

		const handleSelectAllItem = useCallback(() => {
			const isAllSelected =
				activeSelectedItems.length === tabContentList.length;
			if (isAllSelected) {
				setSelectedItems(
					new Set(
						Array.from(selectedItems).filter(
							item => item.categoryCode !== activeCategoryCode
						)
					)
				);
			} else {
				setSelectedItems(
					new Set([...Array.from(selectedItems), ...tabContentList])
				);
			}
		}, [
			selectedItems,
			tabContentList,
			activeCategoryCode,
			activeSelectedItems,
		]);

		const handleDeleteItem = useCallback(
			async (compareItem: CompareItem) => {
				if (activeSelectedItems.length < 1) {
					return;
				}
				const confirm = await showConfirm({
					message: '삭제하시겠습니까?',
					confirmButton: '예',
					closeButton: '아니오',
				});
				if (!confirm) return;

				selectedItems.delete(compareItem);
				removeItemOperation(dispatch)(compareItem);
				removeCompareItem(compareItem);
			},
			[selectedItems, activeSelectedItems]
		);

		const handleDeleteAllItem = useCallback(async () => {
			if (activeSelectedItems.length < 1) {
				return;
			}
			const confirm = await showConfirm({
				message: `선택하신 ${activeSelectedItems.length}개의 형번이 삭제됩니다. 삭제하시겠습니까?`,
				confirmButton: '예',
				closeButton: '아니오',
			});
			if (!confirm) return;

			activeSelectedItems.forEach(async item => {
				selectedItems.delete(item);
				removeItemOperation(dispatch)(item);
				removeCompareItem(item);
			});
		}, [selectedItems, activeSelectedItems]);

		const handlePartNumberClick = (
			e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
		) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.currentTarget.href) {
				router.push(e.currentTarget.href);
			}
		};

		useOnMounted(() => {
			let compare = getCompare();
			updateCompareOperation(dispatch)(compare);
		});

		useEffect(() => {
			setActiveCategoryCode(
				compare.active
					? compare.active
					: tabHeadList[tabHeadList.length - 1] ?? ''
			);
		}, [compare.active, tabHeadList]);

		useEffect(() => {
			setSelectedItems(new Set(compare.items.filter(item => item.chk)));
		}, [compare.items]);

		useEffect(() => {
			selectedItemsForCheck.current = selectedItems;
		}, [selectedItems]);

		useEffect(() => {
			selectedActiveTab.current = activeCategoryCode;
		}, [activeCategoryCode]);

		return (
			<>
				<Presenter
					compare={compare}
					tabHeads={tabHeadList}
					tabContents={tabContentList}
					activeCategoryCode={activeCategoryCode}
					totalCount={totalCount}
					selectedCount={selectedCount}
					selectedItems={selectedItems}
					handlePartNumberClick={handlePartNumberClick}
					handleTabClick={handleTabClick}
					handleTabDelete={handleTabDelete}
					handleSelectItem={handleSelectItem}
					handleDeleteItem={handleDeleteItem}
					handleSelectAllItem={handleSelectAllItem}
					handleDeleteAllItem={handleDeleteAllItem}
				/>
			</>
		);
	}
);
CompareTabContent.displayName = 'CompareTabContent';
