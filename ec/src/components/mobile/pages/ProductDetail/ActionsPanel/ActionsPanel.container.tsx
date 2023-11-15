import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ActionsPanel as Presenter } from './ActionsPanel';
import { addToCart as addToCartApi } from '@/api/services/addToCart';
import { useAddToCartModal } from '@/components/mobile/modals/AddToCartModal';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/mobile/modals/PaymentMethodRequiredModal';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { AssertionError } from '@/errors/app/AssertionError';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { AddToCartType } from '@/logs/analytics/google/ecommerce/types';
import { useSelector, useStore } from '@/store/hooks';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import {
	checkPriceOperation,
	selectCategoryCodeList,
	selectChecking,
	selectCompletedPartNumber,
	selectPrice,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';
import { moveToOrder } from '@/utils/domain/order';

export const ActionsPanel: React.VFC = () => {
	const dispatch = useDispatch();

	const partNumber = useSelector(selectCompletedPartNumber);
	const price = useSelector(selectPrice);
	const checking = useSelector(selectChecking);
	const store = useStore();
	const [processing, startToProcess, endProcessing] = useBoolState(false);
	const showLoginModal = useLoginModal();
	const showAddToCartModal = useAddToCartModal();

	/** Get categoryCodeList */
	const categoryCodeList = useSelector(selectCategoryCodeList);

	// series
	const series = useSelector(selectSeries);

	const { t } = useTranslation();
	const { showMessage } = useMessageModal();

	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

	const check = useCallback(
		async (quantity: number | null) => {
			try {
				await checkPriceOperation(store)(quantity, t);
			} catch (error) {
				if (
					error instanceof AssertionError &&
					error.type === 'quantity' &&
					error.messages[0]
				) {
					showMessage(error.messages[0]).then();
					return;
				}
				throw error;
			}
		},
		[showMessage, store, t]
	);

	const hasPermission = useCallback(
		async (permission: 'order' | 'addToCart') => {
			await refreshAuth(dispatch)();

			// NOTE: These variables (authenticated, isEcUser, hasOrderPermission, hasCartPermission)
			//       are being used to get latest info when user has logged in on the other tab.
			const authenticated = selectAuthenticated(store.getState());
			if (!authenticated) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return false;
				}
			}

			const isEcUser = selectIsEcUser(store.getState());
			if (isEcUser) {
				showPaymentMethodRequiredModal();
				return false;
			}

			const { hasOrderPermission, hasCartPermission } = selectUserPermissions(
				store.getState()
			);

			if (permission === 'order' && !hasOrderPermission) {
				showMessage(t('mobile.common.order.noPermission'));
				return false;
			}

			if (permission === 'addToCart' && !hasCartPermission) {
				showMessage(t('mobile.common.cart.noPermission'));
				return false;
			}

			return true;
		},
		[
			dispatch,
			showLoginModal,
			showMessage,
			showPaymentMethodRequiredModal,
			store,
			t,
		]
	);

	/** order now */
	const orderNow = useCallback(async () => {
		assertNotNull(partNumber);
		assertNotNull(price);

		ga.events.orderNow({
			partNumberCount: 1,
			partNumber: partNumber.partNumber,
			innerCode: partNumber.innerCode,
		});

		try {
			startToProcess();

			if (!(await hasPermission('order'))) {
				return;
			}

			aa.events.sendOrderNow();

			moveToOrder({
				...price,
				seriesCode: series.seriesCode,
				brandName: series.brandName,
				brandCode: series.brandCode,
			});
		} finally {
			endProcessing();
		}
	}, [
		partNumber,
		price,
		startToProcess,
		hasPermission,
		series.seriesCode,
		series.brandName,
		series.brandCode,
		endProcessing,
	]);

	/** add to cart */
	const addToCart = useCallback(async () => {
		assertNotNull(partNumber);
		assertNotNull(price);

		try {
			startToProcess();

			if (!(await hasPermission('addToCart'))) {
				return;
			}

			const addToCartResponse = await addToCartApi({
				cartItemList: [
					{
						seriesCode: series.seriesCode,
						brandCode: series.brandCode,
						partNumber: partNumber.partNumber,
						quantity: price.quantity,
						innerCode: partNumber.innerCode,
						unitPrice: price.unitPrice,
						standardUnitPrice: price.standardUnitPrice,
						daysToShip: price.daysToShip,
						shipType: price.shipType,
						piecesPerPackage: price.piecesPerPackage,
					},
				],
			});

			if (addToCartResponse.cartItemList.length > 0) {
				showAddToCartModal(addToCartResponse);
			}

			aa.events.sendAddToCart({
				categoryCodeList,
				brandCode: series.brandCode,
				seriesCode: series.seriesCode,
			});

			ga.ecommerce.addToCart({
				type: AddToCartType.PRODUCT_DETAIL,
				currencyCode: price.currencyCode ?? addToCartResponse.currencyCode,
				products: [
					{
						seriesCode: series.seriesCode,
						innerCode: price.innerCode,
						partNumber: price.partNumber,
						quantity: price.quantity,
					},
				],
			});
		} finally {
			endProcessing();
		}
	}, [
		partNumber,
		startToProcess,
		hasPermission,
		price,
		series.seriesCode,
		series.brandCode,
		categoryCodeList,
		showAddToCartModal,
		endProcessing,
	]);

	if (partNumber == null || price == null) {
		return null;
	}

	return (
		<Presenter
			partNumber={partNumber}
			price={price}
			loading={checking || processing}
			check={check}
			addToCart={addToCart}
			orderNow={orderNow}
		/>
	);
};
ActionsPanel.displayName = 'ActionsPanel';
