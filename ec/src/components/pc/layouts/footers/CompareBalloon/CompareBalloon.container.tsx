import { FC, useCallback, useEffect, useRef } from 'react';
import { CompareBalloon as Presenter } from './CompareBalloon';
import {
	checkPriceOperation,
	selectCompare,
	selectComparePriceCache,
	selectShowCompareBalloon,
	updateCompareOperation,
	updateCompareStatusOperation,
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
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { assertNotEmpty, assertNotNull } from '@/utils/assertions';
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
import { useBoolState } from '@/hooks/state/useBoolState';
import { CompareLoadStatus } from '@/store/modules/common/compare/types';
import { AssertionError } from 'assert';
import { PriceCheckResult } from './types';
import { useAddToMyComponentsModalMulti } from '@/components/pc/modals/AddToMyComponentsModalMulti/AddToMyComponentsModalMulti.hooks';
import { addMyComponents } from '@/api/services/addMyComponents';
import { moveToOrderMulti } from '@/utils/domain/order';

/**
 * 비교 푸터 팝업
 */
export const CompareBalloon: FC = () => {
	const initialized = useRef(false);

	const dispatch = useDispatch();
	const showLoginModal = useLoginModal();
	const showAddToCartModal = useAddToCartModalMulti();
	const showAddToMyComponentsModal = useAddToMyComponentsModalMulti();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

	const compare = useSelector(selectCompare);
	const compareShowStatus = useSelector(selectShowCompareBalloon);

	const [loading, startToLoading, endLoading] = useBoolState(false);

	const selectedItemsForCheck = useRef<Set<CompareItem>>(new Set()); //CompareTabContent : selectedItem
	const selectedActiveTab = useRef<string>(''); //CompareTabContent: activeCategoryCode
	const storeState = store.getState();
	const priceCache = selectComparePriceCache(storeState);

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

	useEffect(() => {
		if (compare.status === CompareLoadStatus.LOADING) {
			startToLoading();
			setTimeout(() => {
				endLoading();
			}, 1000);
			updateCompareStatusOperation(dispatch)(CompareLoadStatus.READY);
		}
	}, [compare.status, dispatch]);

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

	/**
	 * 가격 체크 이벤트
	 * checkPriceOperation 함수로 compare => priceCache 값 여부를 확인하고,
	 * 없을 경우 price api 를 실행한다.
	 */
	const check = useCallback(
		async (items: CompareItem[]): Promise<PriceCheckResult> => {
			try {
				await checkPriceOperation(store)(items);
			} catch (error) {
				if (error instanceof AssertionError) {
					if (error.message[0]) {
						showMessage(error.message[0]);
						return 'error';
					}
				}
			}
			return 'success';
		},
		[showMessage]
	);

	/**
	 * 가격 가져오기 이벤트
	 * store 에서 compare => priceCache 값 여부를 확인하여
	 * 해당 데이터를 불러온다.
	 */
	const getPrices = useCallback(
		(compareItems: CompareItem[]) => {
			const cache = selectComparePriceCache(store.getState());
			const quantity = 1;
			if (!cache) return [];
			return compareItems.map(item => {
				return cache[`${item.partNumber}\t${quantity}`] ?? null;
			});
		},
		[store]
	);

	/**
	 * 주문 버튼 클릭 이벤트
	 */
	const handleOrderNow = useCallback(async () => {
		try {
			startToLoading();

			const items = Array.from(selectedItemsForCheck.current).filter(
				item => item.categoryCode === selectedActiveTab.current
			);

			if (items.length < 1) {
				showMessage({
					message: t(
						'components.ui.layouts.footers.compareBalloon.message.check'
					),
					button: (
						<Button>
							{t('components.ui.layouts.footers.compareBalloon.message.ok')}
						</Button>
					),
				});
				return;
			}

			await refreshAuth(dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if (selectIsEcUser(store.getState())) {
				showPaymentMethodRequiredModal();
				return;
			}

			if (!selectUserPermissions(store.getState()).hasCartPermission) {
				showMessage(t('common.cart.noPermission'));
				return;
			}

			const quantity = 1;

			const productList = items.map(item => {
				return {
					partNumber: item.partNumber,
					brandCode: item.brandCode,
					quantity,
				};
			});

			moveToOrderMulti(productList);
		} catch (error) {
			console.log(error);
		} finally {
			endLoading();
		}
	}, [
		selectedItemsForCheck.current,
		dispatch,
		showLoginModal,
		showMessage,
		showPaymentMethodRequiredModal,
		t,
	]);

	/**
	 * 장바구니 버튼 클릭 이벤트
	 */
	const addToCart = useCallback(async () => {
		try {
			startToLoading();

			const items = Array.from(selectedItemsForCheck.current).filter(
				item => item.categoryCode === selectedActiveTab.current
			);
			if (items.length < 1) {
				showMessage({
					message: t(
						'components.ui.layouts.footers.compareBalloon.message.check'
					),
					button: (
						<Button>
							{t('components.ui.layouts.footers.compareBalloon.message.ok')}
						</Button>
					),
				});
				return;
			}

			// NOTE: Get the latest user info when executing add to cart
			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if (selectIsEcUser(store.getState())) {
				showPaymentMethodRequiredModal();
				return;
			}

			if (!selectUserPermissions(store.getState()).hasCartPermission) {
				showMessage(t('common.cart.noPermission'));
				return;
			}

			if ((await check(items)) === 'error') {
				return;
			}

			const firstBrandCode = items[0]?.brandCode;
			assertNotNull(firstBrandCode);

			const checkedPriceList = getPrices(items);
			if (!checkedPriceList || checkedPriceList.length < 1) {
				return;
			}

			const validPriceList = checkedPriceList.reduce<Price[]>(
				(previous, current) => {
					if (current) {
						return [...previous, current];
					} else {
						return previous;
					}
				},
				[]
			);
			const cartItems = validPriceList.map(item => {
				const target = items.find(
					compareItem => compareItem.partNumber === item.partNumber
				);
				return {
					seriesCode: target?.seriesCode || '',
					brandCode: item.brandCode || firstBrandCode,
					partNumber: item.partNumber,
					quantity: item.quantity,
					innerCode: item.innerCode,
					unitPrice: item.unitPrice,
					standardUnitPrice: item.standardUnitPrice,
					daysToShip: item.daysToShip,
					shipType: item.shipType,
					piecesPerPackage: item.piecesPerPackage,
				};
			});
			assertNotEmpty(cartItems);
			const addToCartResponse = await addToCartApi({
				cartItemList: cartItems,
			});

			showAddToCartModal(addToCartResponse, validPriceList, true);
		} catch (error) {
			console.log(error);
		} finally {
			endLoading();
		}
	}, [selectedItemsForCheck.current, getPrices, priceCache, check]);

	/**
	 * My부품표 버튼 클릭 이벤트
	 */
	const addToMyComponents = useCallback(async () => {
		try {
			startToLoading();

			const items = Array.from(selectedItemsForCheck.current).filter(
				item => item.categoryCode === selectedActiveTab.current
			);
			if (items.length < 1) {
				showMessage({
					message: t(
						'components.ui.layouts.footers.compareBalloon.message.check'
					),
					button: (
						<Button>
							{t('components.ui.layouts.footers.compareBalloon.message.ok')}
						</Button>
					),
				});
				return;
			}

			await refreshAuth(store.dispatch)();

			if (!selectAuthenticated(store.getState())) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			if ((await check(items)) === 'error') {
				return;
			}

			const firstBrandCode = items[0]?.brandCode;
			assertNotNull(firstBrandCode);

			const checkedPriceList = getPrices(items);
			if (!checkedPriceList || checkedPriceList.length < 1) {
				return;
			}

			const validPriceList = checkedPriceList.reduce<Price[]>(
				(previous, current) => {
					if (current) {
						return [...previous, current];
					} else {
						return previous;
					}
				},
				[]
			);

			const myComponentsItemList = validPriceList.map(item => {
				const target = items.find(
					compareItem => compareItem.partNumber === item.partNumber
				);
				return {
					seriesCode: target?.seriesCode || '',
					brandCode: item.brandCode || firstBrandCode,
					partNumber: item.partNumber,
					quantity: item.quantity,
					innerCode: item.innerCode,
					unitPrice: item.unitPrice,
					standardUnitPrice: item.standardUnitPrice,
					daysToShip: item.daysToShip,
					shipType: item.shipType,
					piecesPerPackage: item.piecesPerPackage,
				};
			});
			assertNotEmpty(myComponentsItemList);
			const addMyComponentsResponse = await addMyComponents({
				myComponentsItemList: myComponentsItemList,
			});

			showAddToMyComponentsModal(addMyComponentsResponse, validPriceList, true);
		} catch (error) {
			console.log(error);
		} finally {
			endLoading();
		}
	}, [selectedItemsForCheck.current, getPrices, priceCache, check]);

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
		const pageUrl = `${url.compare}${selectedActiveTab.current}`;
		router.push(pageUrl);
	}, [selectedActiveTab.current, selectedItemsForCheck.current]);

	return (
		<>
			<Presenter
				loading={loading}
				showStatus={compareShowStatus}
				selectedItemsForCheck={selectedItemsForCheck}
				selectedActiveTab={selectedActiveTab}
				handleClose={handleClose}
				onClickOrderNow={handleOrderNow}
				addToCart={addToCart}
				addToMyComponents={addToMyComponents}
				openCompareDetailPage={openCompareDetailPage}
			/>
		</>
	);
};
