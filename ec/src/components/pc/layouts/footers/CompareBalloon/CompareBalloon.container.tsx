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
import {
	CompareDetailLoadStatus,
	updateStatusOperation,
} from '@/store/modules/pages/compareDetail';
import { checkPrice } from '@/api/services/checkPrice';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { assertNotNull } from '@/utils/assertions';
import { addToCart as addToCartApi } from '@/api/services/addToCart';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { store } from '@/store';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/pc/modals/PaymentMethodRequiredModal';
import { useAddToCartModalMulti } from '@/components/pc/modals/AddToCartModalMulti/AddToCartModalMulti.hooks';

/**
 * 비교 푸터 팝업
 */
export const CompareBalloon: FC = () => {
	const initialized = useRef(false);

	const dispatch = useDispatch();
	const showLoginModal = useLoginModal();
	const showAddToCartModal = useAddToCartModalMulti();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

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
		if (!compare.show && initialized.current) {
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
	}, [generateCompareData, router.asPath]);

	/** todo */
	const onClickOrderNow = () => {
		console.log('order');
		const items = Array.from(selectedItemsForCheck.current).filter(
			item => item.categoryCode === selectedActiveTab.current
		);
		console.log('itesm ===> ', items);
	};

	const check = useCallback(async () => {}, []);

	/** todo */
	const addToCart = useCallback(async () => {
		try {
			const items = Array.from(selectedItemsForCheck.current).filter(
				item => item.categoryCode === selectedActiveTab.current
			);
			if (items.length < 1) return;

			// NOTE: Get the latest user info when executing add to cart
			// await refreshAuth(store.dispatch)();

			// if (!selectAuthenticated(store.getState())) {
			// 	const result = await showLoginModal();
			// 	if (result !== 'LOGGED_IN') {
			// 		return;
			// 	}
			// }

			// if (selectIsEcUser(store.getState())) {
			// 	showPaymentMethodRequiredModal();
			// 	return;
			// }

			// if (!selectUserPermissions(store.getState()).hasCartPermission) {
			// 	showMessage(t('common.cart.noPermission'));
			// 	return;
			// }

			// console.log('add to cart');

			// const seriesCode = items[0]?.seriesCode;
			// const firstBrandCode = items[0]?.brandCode;
			// assertNotNull(seriesCode);
			// assertNotNull(firstBrandCode);

			// const productList = items.map(item => {
			// 	return {
			// 		partNumber: item.partNumber,
			// 		quantity: 1,
			// 		brandCode: item.brandCode,
			// 	};
			// });

			// const response = await checkPrice({ productList });

			// if (response.priceList[0] === undefined) {
			// 	return;
			// }

			// const { priceList } = response;

			// const cartItems = priceList.map(item => {
			// 	return {
			// 		seriesCode,
			// 		brandCode: item.brandCode || firstBrandCode,
			// 		partNumber: item.partNumber,
			// 		quantity: item.quantity,
			// 		innerCode: item.innerCode,
			// 		unitPrice: item.unitPrice,
			// 		standardUnitPrice: item.standardUnitPrice,
			// 		daysToShip: item.daysToShip,
			// 		shipType: item.shipType,
			// 		piecesPerPackage: item.piecesPerPackage,
			// 	};
			// });

			// const addToCartResponse = await addToCartApi({
			// 	cartItemList: cartItems,
			// });

			// console.log('itesm ===> ', items, response, addToCartResponse);

			showAddToCartModal();
		} catch (error) {}
	}, [selectedItemsForCheck.current]);

	/** todo */
	const addToMyComponents = () => {
		console.log('addToMyComponents');
		const items = Array.from(selectedItemsForCheck.current).filter(
			item => item.categoryCode === selectedActiveTab.current
		);
		console.log('itesm ===> ', items);
	};

	/**
	 * 비교결과 페이지 오픈
	 * 체크된 상품 확인 ( updateCheckedItemIfNeeded ), 비교결과 페이지 초기화 ( updateStatusOperation -> Initial )
	 * 페이지 이동 ( router push )
	 */
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
		updateCheckedItemIfNeeded(Array.from(selectedItemsForCheck.current));
		updateStatusOperation(dispatch)(CompareDetailLoadStatus.INITIAL);
		initialized.current = false;
		const pageUrl = `${url.compare}/${selectedActiveTab.current}`;
		router.push(pageUrl);
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
