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

type Props = {
	selectedItemsForCheck: MutableRefObject<Set<CompareItem>>;
	selectedActiveTab: MutableRefObject<string>;
};

export const CompareTabContent = React.memo<Props>(
	({ selectedItemsForCheck, selectedActiveTab }) => {
		const dispatch = useDispatch();

		const compare = useSelector(selectCompare);

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

		console.log('selectedITems =====> ', selectedItems);
		const handleDeleteItem = (compareItem: CompareItem) => {};

		const handleDeleteAllItem = useCallback(() => {
			if (activeSelectedItems.length < 1) {
				return;
			}
			activeSelectedItems.forEach(async item => {
				selectedItems.delete(item);
				removeItemOperation(dispatch)(item);
				removeCompareItem(item);
			});
			// setSelectedItems(new Set(selectedItems));
		}, [selectedItems, activeSelectedItems]);

		useOnMounted(() => {
			console.log('on mounted');
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
					handleTabClick={handleTabClick}
					handleSelectItem={handleSelectItem}
					handleSelectAllItem={handleSelectAllItem}
					handleDeleteAllItem={handleDeleteAllItem}
				/>
			</>
		);
	}
);
CompareTabContent.displayName = 'CompareTabContent';
