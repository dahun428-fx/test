import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NoListedProduct as Presenter } from './NoListedProduct';
import { addToCart as addToCartApi } from '@/api/services/addToCart';
import { useAddToCartModal } from '@/components/mobile/modals/AddToCartModal';
import { useLoginModal } from '@/components/mobile/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/mobile/modals/PaymentMethodRequiredModal';
import { Option as DisplayTypeOption } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { useBoolState } from '@/hooks/state/useBoolState';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import {
	AddToCartType,
	ItemListName,
} from '@/logs/analytics/google/ecommerce/types';
import { CartItem } from '@/models/api/msm/ect/cart/AddCartRequest';
import { Series } from '@/models/api/msm/ect/type/SearchTypeResponse';
import { store } from '@/store';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { moveToOrder } from '@/utils/domain/order';

type Props = {
	displayType: DisplayTypeOption;
	series: Series;
};

/** No listed product container */
export const NoListedProduct: React.VFC<Props> = ({ displayType, series }) => {
	const [t] = useTranslation();
	const dispatch = useDispatch();
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();
	const showAddToCartModal = useAddToCartModal();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();
	const [loading, startToLoading, endLoading] = useBoolState(false);

	/**
	 * Check if a given quantity is valid.
	 * If the quantity is invalid, it will show an error message and return false.
	 */
	const isValidQuantity = useCallback(
		async (quantity: number | null) => {
			if (quantity === null) {
				await showMessage(
					<>
						<div>
							{t(
								'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.enterQuantity'
							)}
						</div>
						<div>
							{t(
								'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.minimumQuantity'
							)}
						</div>
					</>
				);
				return false;
			}

			if (!quantity) {
				await showMessage(
					<>
						<div>
							{t(
								'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.enterRightQuantity'
							)}
						</div>
						<div>
							{t(
								'mobile.pages.keywordSearch.partNumberTypeList.noListedProduct.minimumQuantity'
							)}
						</div>
					</>
				);
				return false;
			}

			return true;
		},
		[showMessage, t]
	);

	/** Move an item to the order page */
	const handleOrderNow = useCallback(
		async ({
			brandCode,
			brandName,
			partNumber,
			quantity,
		}: {
			brandCode: string;
			brandName: string;
			partNumber: string;
			quantity: number | null;
		}) => {
			if (!(await isValidQuantity(quantity)) || quantity === null) {
				return;
			}

			try {
				// NOTE: Get the latest user info when executing add to cart
				await refreshAuth(dispatch)();

				const authenticated = selectAuthenticated(store.getState());
				if (!authenticated) {
					const result = await showLoginModal();
					if (result !== 'LOGGED_IN') {
						return;
					}
				}

				const isEcUser = selectIsEcUser(store.getState());
				const { hasOrderPermission } = selectUserPermissions(store.getState());

				if (isEcUser) {
					await showPaymentMethodRequiredModal();
					return;
				}

				if (!hasOrderPermission) {
					await showMessage(t('common.order.noPermission'));
					return;
				}

				aa.events.sendAddToCartOrOrderNow({ partNumber, brandCode });
				ga.events.orderNoListedProduct({ partNumber, brandCode, brandName });

				moveToOrder({
					partNumber,
					brandCode,
					quantity,
				});
			} catch (error) {
				// TODO: Error handling
			}
		},
		[
			dispatch,
			isValidQuantity,
			showLoginModal,
			showMessage,
			showPaymentMethodRequiredModal,
			t,
		]
	);

	/** Add an item to the cart */
	const handleAddToCart = useCallback(
		async ({
			brandCode,
			brandName,
			partNumber,
			quantity,
		}: {
			brandCode: string;
			brandName: string;
			partNumber: string;
			quantity: number | null;
		}) => {
			if (!(await isValidQuantity(quantity)) || quantity === null) {
				return;
			}

			try {
				startToLoading();

				// NOTE: Get the latest user info when executing add to cart
				await refreshAuth(dispatch)();

				const authenticated = selectAuthenticated(store.getState());
				if (!authenticated) {
					const result = await showLoginModal();
					if (result !== 'LOGGED_IN') {
						return;
					}
				}

				const isEcUser = selectIsEcUser(store.getState());
				if (isEcUser) {
					await showPaymentMethodRequiredModal();
					return;
				}

				const { hasCartPermission } = selectUserPermissions(store.getState());
				if (!hasCartPermission) {
					await showMessage(t('common.cart.noPermission'));
					return;
				}

				const cartItem: CartItem = {
					brandCode,
					partNumber,
					quantity,
				};

				const addToCartResponse = await addToCartApi({
					cartItemList: [cartItem],
				});

				if (addToCartResponse.cartItemList.length > 0) {
					const cartItemList = addToCartResponse.cartItemList.map(cartItem => {
						return {
							...cartItem,
							brandName: cartItem.brandName ?? brandName,
						};
					});

					aa.events.sendAddToCartOrOrderNow({ partNumber, brandCode });

					ga.ecommerce.addToCart({
						type: AddToCartType.NO_LISTED_IN_CATALOG,
						currencyCode: addToCartResponse.currencyCode,
						products: addToCartResponse.cartItemList.map(item => {
							return {
								seriesCode: item.seriesCode,
								innerCode: item.innerCode,
								partNumber: item.partNumber,
								quantity: item.quantity,
								itemListName: ItemListName.KEYWORD_SEARCH_RESULT,
							};
						}),
					});

					showAddToCartModal({ ...addToCartResponse, cartItemList });
				}
			} finally {
				endLoading();
			}
		},
		[
			dispatch,
			endLoading,
			isValidQuantity,
			showAddToCartModal,
			showLoginModal,
			showMessage,
			showPaymentMethodRequiredModal,
			startToLoading,
			t,
		]
	);

	return (
		<Presenter
			displayType={displayType}
			loading={loading}
			series={series}
			onClickOrderNow={handleOrderNow}
			addToCart={handleAddToCart}
		/>
	);
};
NoListedProduct.displayName = 'NoListedProduct';
