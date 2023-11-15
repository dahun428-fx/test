import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartApi } from '@/api/services/addToCart';
import { useAddToCartModal } from '@/components/mobile/modals/AddToCartModal';
import { usePaymentMethodRequiredModal } from '@/components/mobile/modals/PaymentMethodRequiredModal';
import { useUniversalLoader } from '@/components/mobile/ui/loaders/UniversalLoader.context';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import {
	AddToCartType,
	ItemListName,
} from '@/logs/analytics/google/ecommerce/types';
import { CartItem } from '@/models/api/msm/ect/cart/AddCartRequest';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';
import { QuoteOrderPayload } from '@/models/domain/order';
import { store } from '@/store';
import {
	selectAuthenticated,
	selectIsAbleToCheckout,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
	selectUserPermissions,
	refreshAuth,
} from '@/store/modules/auth';
import { postFormData } from '@/utils/domain/form';
import { isValidQuantityNumber } from '@/utils/domain/quantity';
import { url } from '@/utils/url';

/**
 * Hook for showing no listed product content
 */
export const useOrderNoListedProductContent = () => {
	const { t } = useTranslation();
	const [inputQuantity, setInputQuantity] = useState('');
	const dispatch = useDispatch();

	const { showMessage } = useMessageModal();
	const showAddToCartModal = useAddToCartModal();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();
	const { showLoading, hideLoading } = useUniversalLoader();
	const isEcUser = useSelector(selectIsEcUser);
	const authenticated = useSelector(selectAuthenticated);
	const { hasCartPermission, hasOrderPermission } = useSelector(
		selectUserPermissions
	);
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	// Customer type checkout
	const isCustomerTypeCheckout = useSelector(selectIsAbleToCheckout);

	const isValidQuantity = useCallback(
		(quantity: string) => {
			if (quantity.trim() === '') {
				showMessage(
					t('mobile.components.modals.orderNoListedProductModal.enterQuantity')
				);
				setInputQuantity('');
				return false;
			}

			if (!isValidQuantityNumber(quantity)) {
				showMessage(
					t(
						'mobile.components.modals.orderNoListedProductModal.enterRightQuantity'
					)
				);
				setInputQuantity('');
				return false;
			}

			return true;
		},
		[showMessage, t]
	);

	const addToCart = useCallback(
		async (partNumber: PartNumber) => {
			if (!isValidQuantity(inputQuantity)) {
				return;
			}
			// TODO: Confirm about validation for minQuantity, orderUnit

			try {
				showLoading();

				await refreshAuth(dispatch)();
				const isEcUser = selectIsEcUser(store.getState());
				const { hasCartPermission } = selectUserPermissions(store.getState());

				if (isEcUser) {
					showPaymentMethodRequiredModal();
					return;
				}

				if (!hasCartPermission) {
					showMessage(t('mobile.common.cart.noPermission'));
					return;
				}

				if (hasCartPermission) {
					const payload: CartItem = {
						seriesCode: partNumber.seriesCode,
						innerCode: partNumber.innerCode,
						brandCode: partNumber.brandCode,
						partNumber: partNumber.partNumber,
						quantity: Number(inputQuantity),
					};

					const addToCartResponse = await addToCartApi({
						cartItemList: [payload],
						priceCheckFlag: '0',
					});

					if (addToCartResponse && addToCartResponse.cartItemList.length > 0) {
						const cartItemList = addToCartResponse.cartItemList.map(
							cartItem => {
								return {
									...cartItem,
									brandName: cartItem.brandName ?? partNumber.brandName,
								};
							}
						);
						aa.events.sendAddNoListedProductToCartEvent(partNumber);
						ga.ecommerce.addToCart({
							type: AddToCartType.NO_LISTED_IN_CATALOG,
							currencyCode: addToCartResponse.currencyCode,
							products: cartItemList.map(item => ({
								...item,
								seriesCode: item.seriesCode ?? '',
								itemListName: ItemListName.SUGGEST_PREVIEW,
							})),
						});
						showAddToCartModal({ ...addToCartResponse, cartItemList });
					} else {
						// TODO: Handle when add to cart failed: Set suppressResponseCode = true
					}
					// TODO: Confirm show `Communication error` or detail error from api response
				}
			} finally {
				hideLoading();
			}
		},
		[
			dispatch,
			hideLoading,
			inputQuantity,
			isValidQuantity,
			showAddToCartModal,
			showLoading,
			showMessage,
			showPaymentMethodRequiredModal,
			t,
		]
	);

	const orderNow = useCallback(
		async (partNumber: PartNumber) => {
			if (!isValidQuantity(inputQuantity)) {
				return;
			}

			try {
				await refreshAuth(dispatch)();
				const isEcUser = selectIsEcUser(store.getState());
				const { hasOrderPermission } = selectUserPermissions(store.getState());

				if (isEcUser) {
					showPaymentMethodRequiredModal();
					return;
				}

				if (!hasOrderPermission) {
					showMessage(t('mobile.common.order.noPermission'));
					return;
				}

				if (hasOrderPermission) {
					const payload: QuoteOrderPayload = {
						productName: '',
						productId: '',
						productPageUrl: '',
						productImgUrl: '',
						partNumber: partNumber.partNumber,
						makerCd: partNumber.brandCode,
						makerName: '',
						innerCd: '',
						amount: String(inputQuantity),
						campaignEndDate: '',
						pack: '',
						unitPrice: '',
						catalogPrice: '',
						totalPriceWithTaxes: '',
						days: '',
						stoke: '',
						estimateOutF: '',
						productType: '',
						siteId: '',
						errorCd: '',
						errorMessage: '',
						errorDivision: '',
						prjPath: '',
					};

					aa.events.sendOrderNoListedProductEvent(partNumber);
					ga.events.orderNoListedProduct(partNumber);
					postFormData<QuoteOrderPayload>(url.directOrder, [payload]);
				}
			} catch (error) {
				// TODO: Error handling
			}
		},
		[
			dispatch,
			inputQuantity,
			isValidQuantity,
			showMessage,
			showPaymentMethodRequiredModal,
			t,
		]
	);

	return {
		isEcUser,
		authenticated,
		isPurchaseLinkUser,
		isCustomerTypeCheckout,
		hasCartPermission,
		hasOrderPermission,
		addToCart,
		orderNow,
		setInputQuantity,
	};
};
