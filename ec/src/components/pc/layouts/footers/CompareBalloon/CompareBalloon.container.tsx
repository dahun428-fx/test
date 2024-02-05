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
import { Router, useRouter } from 'next/router';
import { url } from '@/utils/url';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { Button } from '@/components/pc/ui/buttons';
import { useTranslation } from 'react-i18next';

/**
 * 비교 푸터 팝업
 */
export const CompareBalloon: FC = () => {
	const initialized = useRef(false);

	const dispatch = useDispatch();

	const compare = useSelector(selectCompare);
	const compareShowStatus = useSelector(selectShowCompareBalloon);

	const selectedItemsForCheck = useRef<Set<CompareItem>>(new Set()); //CompareTabContent : selectedItem
	const selectedActiveTab = useRef<string>(''); //CompareTabContent: activeCategoryCode

	const { showMessage } = useMessageModal();
	const [t] = useTranslation();

	const router = useRouter();

	/**
	 * 비교 팝업 업데이트 ( store )
	 * setCompare => updateCompareOperation : store compare update 로직
	 */
	const setCompare = useCallback(
		(compare: Compare) => {
			updateCompareOperation(dispatch)(compare);
		},
		[dispatch]
	);

	/**
	 * 비교 팝업 닫기 ( store, localStorage : show => false )
	 */
	const handleClose = () => {
		updateCompare({ show: false });
		updateShowsCompareBalloonStatusOperation(dispatch)(false);
	};

	/**
	 * 비교 팝업 업데이트 ( localStorage )
	 * compare.show == false 일때,
	 * selectedItemForCheck : 선택된 비교 아이템,
	 * selectedActiveTab : 선택된 비교 탭,
	 * localStorage 에 반영
	 */
	useEffect(() => {
		if (!compare.show) {
			updateCheckedItemIfNeeded(Array.from(selectedItemsForCheck.current));
			updateCompare({ active: selectedActiveTab.current });
		}
	}, [compare.show]);

	/**
	 * 비교 팝업 초기화
	 * 페이지 첫 로딩시에만 해당 로직 수행
	 * => 비교팝업 닫기
	 */
	const generateCompareData = useCallback(() => {
		if (!initialized.current) {
			let compare = getCompare();
			updateCompare({ show: false });
			setCompare({ ...compare, show: false });
			initialized.current = true;
		}
	}, [dispatch, compareShowStatus, compare, setCompare]);

	/**
	 * 페이지 변경 완료시에 비교 팝업 초기화 로직 수행 ( generateCompareData() )
	 */
	useEffect(() => {
		const handleGenerateData = () => {
			generateCompareData();
		};
		handleGenerateData();
		Router.events.on('routeChangeComplete', handleGenerateData);
		return () => Router.events.off('routeChangeComplete', handleGenerateData);
	}, [generateCompareData]);

	/** todo */
	const onClickOrderNow = () => {
		console.log('order');
		const items = Array.from(selectedItemsForCheck.current).filter(
			item => item.categoryCode === selectedActiveTab.current
		);
		console.log('itesm ===> ', items);
	};

	/** todo */
	const addToCart = () => {
		console.log('add to cart');
		const items = Array.from(selectedItemsForCheck.current).filter(
			item => item.categoryCode === selectedActiveTab.current
		);
		console.log('itesm ===> ', items);
	};

	/** todo */
	const addToMyComponents = () => {
		console.log('addToMyComponents');
		const items = Array.from(selectedItemsForCheck.current).filter(
			item => item.categoryCode === selectedActiveTab.current
		);
		console.log('itesm ===> ', items);
	};

	const openCompareDetailPage = useCallback(() => {
		if (selectedItemsForCheck.current.size < 1) {
			showMessage({
				message: t(
					'components.ui.layouts.footers.compareBalloon.message.notSelected'
				),
				button: (
					<Button>
						{t('components.ui.layouts.footers.compareBalloon.message.ok')}
					</Button>
				),
			});
			return;
		}

		router.push(`${url.compare}/${selectedActiveTab.current}`);
	}, [selectedActiveTab.current, selectedItemsForCheck.current]);

	return (
		<>
			<Presenter
				showStatus={compareShowStatus}
				selectedItemsForCheck={selectedItemsForCheck}
				selectedActiveTab={selectedActiveTab}
				handleClose={handleClose}
				onClickOrderNow={onClickOrderNow}
				addToCart={addToCart}
				addToMyComponents={addToMyComponents}
				openCompareDetailPage={openCompareDetailPage}
			/>
		</>
	);
};
