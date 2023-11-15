import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AddToCartModal, Series } from './AddToCartModal';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { usePaymentMethodRequiredModal } from '@/components/pc/modals/PaymentMethodRequiredModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useModal } from '@/components/pc/ui/modals/Modal.hooks';
import { ga } from '@/logs/analytics/google';
import { AddCartResponse } from '@/models/api/msm/ect/cart/AddCartResponse';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { store } from '@/store';
import { useSelector } from '@/store/hooks';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
	selectIsAbleToCheckout,
	selectUserPermissions,
} from '@/store/modules/auth';
import { updateCartCount } from '@/store/modules/cache';
import { assertNotNull } from '@/utils/assertions';
import { moveToQuote } from '@/utils/domain/order';

/** Add to cart modal hook */
export const useAddToCartModal = (series?: Series) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { hasQuotePermission } = selectUserPermissions(store.getState());

	const { showModal } = useModal();
	const showLoginModal = useLoginModal();
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();
	const { showMessage } = useMessageModal();

	// authenticated
	const authenticated = useSelector(selectAuthenticated);

	/** Purchase Link User or not */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const isAbleToCheckout = useSelector(selectIsAbleToCheckout);

	const quoteOnWOS = useCallback(
		async (price: Price) => {
			assertNotNull(series);
			ga.events.quote();

			if (!price || price.quantity === undefined) {
				return;
			}

			await refreshAuth(dispatch)();

			// NOTE: These variables (authenticatedOnQuotingOnWOS, isEcUserOnQuotingOnWOS, hasQuotingOnWOSPermission)
			//       are being used to get the latest info when user has logged in on the other tab.
			const authenticatedOnQuotingOnWOS = selectAuthenticated(store.getState());
			if (!authenticatedOnQuotingOnWOS) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}

			const isEcUserOnQuotingOnWOS = selectIsEcUser(store.getState());

			// NOTE: Check EC user or not
			if (isEcUserOnQuotingOnWOS) {
				showPaymentMethodRequiredModal();
				return;
			}

			const { hasQuotePermission: hasQuotingOnWOSPermission } =
				selectUserPermissions(store.getState());

			// Check has quote permission or not
			if (!hasQuotingOnWOSPermission) {
				showMessage(t('components.modals.addToCartModal.noQuotePermission'));
				return;
			}

			moveToQuote({
				...price,
				seriesCode: series.seriesCode,
				brandName: series.brandName,
				brandCode: series.brandCode,
				quantity: price.quantity,
			});
		},
		[
			dispatch,
			series,
			showLoginModal,
			showMessage,
			showPaymentMethodRequiredModal,
			t,
		]
	);

	return useCallback(
		(addCartResponse: AddCartResponse, price?: Price) => {
			const cartCount = addCartResponse.cartCount;
			const addedCount = addCartResponse.cartItemList.length;
			const cartItem = addCartResponse.cartItemList[0];
			// FIXME: ここは実装を見直して欲しい。これは利用者側で cartItemList[0] が null でないことを保証する必要がある。
			assertNotNull(cartItem);
			const brandName = cartItem.brandName;
			const seriesCode = cartItem.seriesCode ?? series?.seriesCode ?? '';

			updateCartCount(dispatch)(addCartResponse.cartCount);

			// NOTE: Handle to show in No listed product case
			const mergedPrice: Price = price ?? cartItem;

			// NOTE: price(価格チェック結果）が返却されず addToCartResponse.currencyCode が適用されるのは、
			//       未掲載品のカート追加時で価格チェックを実施しない場合のみの想定
			const currencyCode = price
				? price.currencyCode
				: addCartResponse.currencyCode;

			return showModal(
				<AddToCartModal
					{...{
						price: mergedPrice,
						series,
						currencyCode,
						seriesCode,
						brandName,
						cartCount,
						addedCount,
						hasQuotePermission,
						quoteOnWOS,
						isPurchaseLinkUser,
						isAbleToCheckout,
						authenticated,
					}}
				/>
			);
		},
		[
			authenticated,
			dispatch,
			hasQuotePermission,
			isAbleToCheckout,
			isPurchaseLinkUser,
			quoteOnWOS,
			series,
			showModal,
		]
	);
};
