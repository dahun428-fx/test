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
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { Button } from '@/components/pc/ui/buttons';
import { useTranslation } from 'react-i18next';
import { useBoolState } from '@/hooks/state/useBoolState';

type Props = {
	loading: boolean;
	selectedItemsForCheck: MutableRefObject<Set<CompareItem>>;
	selectedActiveTab: MutableRefObject<string>;
};

/**
 * 비교 팝업 탭 상세
 */
export const CompareTabContent = React.memo<Props>(
	({ selectedItemsForCheck, selectedActiveTab, loading }) => {
		const dispatch = useDispatch();
		const router = useRouter();
		const compare = useSelector(selectCompare);

		const { showConfirm } = useConfirmModal();
		const { showMessage } = useMessageModal();

		const [t] = useTranslation();

		const [selectedItems, setSelectedItems] = useState<Set<CompareItem>>(
			new Set()
		); //선택된 상세
		const [activeCategoryCode, setActiveCategoryCode] = useState<string>(''); //선택된 탭

		/**
		 * 비교 팝업 탭 출력
		 * localStorage 에서 중복 없이 비교 팝업 탭을 불러온다.
		 */
		const tabHeadList = useMemo(() => {
			const categoryCodeList = compare.items.map(item => item.categoryCode);
			return categoryCodeList.reduce<string[]>(
				(previous, current) =>
					previous.includes(current) ? previous : [current, ...previous],
				[]
			);
		}, [compare, compare.items]);

		/**
		 * 비교 팝업 탭 > 비교 팝업 항목 출력
		 * localStorage 에서 활성화된 비교 팝업 탭에 따른 비교 항목들을 불러온다.
		 */
		const tabContentList = useMemo(() => {
			return compare.items.filter(
				item => item.categoryCode === activeCategoryCode
			);
			// .sort((a, b)=> (a.expire) - b.expire);
		}, [compare, compare.items, activeCategoryCode]);

		/**
		 * 비교 팝업 탭 > 비교 팝업 선택된 항목
		 * 선택된 탭 | 선택된 항목 => activeSelectedItems
		 */
		const activeSelectedItems = useMemo(() => {
			return Array.from(selectedItems).filter(
				item => item.categoryCode === activeCategoryCode
			);
		}, [selectedItems, activeCategoryCode]);

		/**
		 * 선택된 탭 > 총 건수
		 */
		const totalCount = useMemo(() => {
			return tabContentList.length;
		}, [tabContentList]);

		/**
		 * 선택된 탭 > 선택 항목 건수
		 */
		const selectedCount = useMemo(() => {
			return activeSelectedItems.length;
		}, [selectedItems, activeCategoryCode]);

		/**
		 * 비교 팝업 탭 클릭 이벤트
		 */
		const handleTabClick = (categoryCode: string) => {
			setActiveCategoryCode(categoryCode);
		};

		/**
		 * 비교 팝업 탭 삭제 이벤트
		 */
		const handleTabDelete = useCallback(async () => {
			if (tabContentList.length < 1) return;

			const categoryName = tabContentList[0]?.categoryName;
			const confirm = await showConfirm({
				message: t(
					'components.ui.layouts.footers.compareBalloon.message.confirm.deleteOne',
					{ categoryName }
				),
				confirmButton: t(
					'components.ui.layouts.footers.compareBalloon.message.yes'
				),
				closeButton: t(
					'components.ui.layouts.footers.compareBalloon.message.no'
				),
			});
			if (!confirm) return;

			tabContentList.forEach(async item => {
				selectedItems.delete(item);
				removeItemOperation(dispatch)(item);
				const { seriesCode, partNumber } = item;
				removeCompareItem(seriesCode, partNumber);
			});
			setSelectedItems(selectedItems);
		}, [tabContentList, selectedItems]);

		/**
		 * 비교 팝업 항목 선택 이벤트
		 */
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

		/**
		 * '전체선택' 버튼 클릭 이벤트
		 */
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

		/**
		 * 개별 삭제 이벤트
		 */
		const handleDeleteItem = useCallback(
			async (
				e: React.MouseEvent<HTMLDivElement, MouseEvent>,
				compareItem: CompareItem
			) => {
				e.preventDefault();
				e.stopPropagation();
				if (activeSelectedItems.length < 1) {
					return;
				}
				const confirm = await showConfirm({
					message: t(
						'components.ui.layouts.footers.compareBalloon.message.confirm.check'
					),
					confirmButton: t(
						'components.ui.layouts.footers.compareBalloon.message.yes'
					),
					closeButton: t(
						'components.ui.layouts.footers.compareBalloon.message.no'
					),
				});
				if (!confirm) return;

				selectedItems.delete(compareItem);
				removeItemOperation(dispatch)(compareItem);
				const { seriesCode, partNumber } = compareItem;
				removeCompareItem(seriesCode, partNumber);
				setSelectedItems(selectedItems);
			},
			[selectedItems, activeSelectedItems]
		);

		/**
		 * '삭제' 버튼 클릭 이벤트
		 */
		const handleDeleteAllItem = useCallback(async () => {
			if (activeSelectedItems.length < 1) {
				showMessage({
					message: t(
						'components.ui.layouts.footers.compareBalloon.message.confirm.alert'
					),
					button: (
						<Button>
							{t('components.ui.layouts.footers.compareBalloon.message.ok')}
						</Button>
					),
				});
				return;
			}
			const confirm = await showConfirm({
				message: t(
					'components.ui.layouts.footers.compareBalloon.message.confirm.deleteAll',
					{ length: activeSelectedItems.length }
				),
				confirmButton: t(
					'components.ui.layouts.footers.compareBalloon.message.yes'
				),
				closeButton: t(
					'components.ui.layouts.footers.compareBalloon.message.no'
				),
			});
			if (!confirm) return;

			activeSelectedItems.forEach(async item => {
				selectedItems.delete(item);
				removeItemOperation(dispatch)(item);
				const { seriesCode, partNumber } = item;
				removeCompareItem(seriesCode, partNumber);
			});
		}, [selectedItems, activeSelectedItems]);

		/**
		 * 각 항목 중 형번 클릭 이벤트
		 */
		const handlePartNumberClick = (
			e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
		) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.currentTarget.href) {
				router.push(e.currentTarget.href);
			}
		};

		/**
		 * 렌더링 될 때, localStorage 의 compare 을 불러온다
		 * > compareBalloon 과 다르게, compareTabContent 는 show 될 때, 새롭게 렌더링 됨.
		 */
		useOnMounted(() => {
			let compare = getCompare();
			updateCompareOperation(dispatch)(compare);
			setSelectedItems(
				new Set(Array.from(compare.items.filter(item => item.chk)))
			);
		});
		/**
		 * 선택된 탭을 초기화
		 * localStorage comapre active | tabHeadList last length
		 */
		useEffect(() => {
			setActiveCategoryCode(
				compare.active
					? compare.active
					: tabHeadList[tabHeadList.length - 1] ?? ''
			);
		}, [compare.active, tabHeadList]);

		/**
		 * 부모 Component CompareBalloon 에 선택된 아이템 전달
		 * => 비교 팝업 탭이 닫힐 때, Compare Item chk 일괄변경
		 */
		useEffect(() => {
			selectedItemsForCheck.current = selectedItems;
		}, [selectedItems]);

		/**
		 * 부모 Component CompareBalloon 에 선택된 탭 전달
		 * => 비교 팝업 탭이 닫힐 때, compare active 변경
		 */
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
					loading={loading}
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
