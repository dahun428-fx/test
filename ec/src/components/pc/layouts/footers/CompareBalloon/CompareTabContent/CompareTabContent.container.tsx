import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { CompareTabContent as Presenter } from './CompareTabContent';
import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { removeItemOperation } from '@/store/modules/common/compare';
import { useDispatch } from 'react-redux';
import { removeCompareItem } from '@/services/localStorage/compare';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';

type Props = {
	tabHeads: string[];
	tabContents: CompareItem[];
	activeCategoryCode: string | undefined;
	handleTabClick: (categoryCode: string) => void;
};

export const CompareTabContent = React.memo<Props>(
	({ tabHeads, tabContents, activeCategoryCode, handleTabClick }) => {
		const dispatch = useDispatch();

		const [selectedItems, setSelectedItems] = useState<Set<CompareItem>>(
			new Set()
		);

		const activeSelectedItems = useMemo(() => {
			return Array.from(selectedItems).filter(
				item => item.categoryCode === activeCategoryCode
			);
		}, [selectedItems, activeCategoryCode]);

		const totalCount = useMemo(() => {
			return tabContents.length;
		}, [tabContents]);

		const selectedCount = useMemo(() => {
			return activeSelectedItems.length;
		}, [selectedItems, activeCategoryCode]);

		const handleSelectItem = useCallback(
			(compareItem: CompareItem) => {
				console.log('handleSelectItem ====> ');
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
			// console.log('tabContents ====> ', tabContents);
			console.log('handleSelectAllItem ====> ');
			const isAllSelected = activeSelectedItems.length === tabContents.length;
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
					new Set([...Array.from(selectedItems), ...tabContents])
				);
			}
		}, [selectedItems, tabContents, activeCategoryCode, activeSelectedItems]);

		const handleDeleteAllItem = useCallback(() => {
			if (activeSelectedItems.length < 1) {
				return;
			}
			activeSelectedItems.forEach(async item => {
				selectedItems.delete(item);
				removeItemOperation(dispatch)(item);
				removeCompareItem(item);
			});
			setSelectedItems(new Set(selectedItems));
		}, [selectedItems, activeSelectedItems]);

		useOnMounted(() => {
			// setSelectedItems(new Set(compare.items.filter(item => item.chk)));
			console.log('mount tabcontent');
			return () => console.log('un mounted tabcontent');
		});

		return (
			<>
				<Presenter
					tabHeads={tabHeads}
					tabContents={tabContents}
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
