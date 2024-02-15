import React, { createElement, useCallback, useEffect, useState } from 'react';
import { AddToCartModalMulti, Series } from './AddToCartModalMulti';
import { useModal } from '../../ui/modals/Modal.hooks';
import { config } from '@/config';
import { useSelector } from '@/store/hooks';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsEcUser,
	selectIsPurchaseLinkUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { store } from '@/store';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';
import { ga } from '@/logs/analytics/google';
import { useDispatch } from 'react-redux';
import { useLoginModal } from '../LoginModal';
import { usePaymentMethodRequiredModal } from '../PaymentMethodRequiredModal';
import { useMessageModal } from '../../ui/modals/MessageModal';
import { useTranslation } from 'react-i18next';
import {
	AddCartResponse,
	CartItem,
} from '@/models/api/msm/ect/cart/AddCartResponse';
import { moveToQuote } from '@/utils/domain/order';
import { regacyPartNumberCopy } from '@/utils/clipboardCopy';
import styles from './AddToCartModalMulti.module.scss';

export const useAddToCartModalMulti = (series?: Series) => {
	const dispatch = useDispatch();

	// authenticated
	const authenticated = useSelector(selectAuthenticated);

	/** Purchase Link User or not */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const isEcUser = useSelector(selectIsEcUser);

	const { hasQuotePermission } = selectUserPermissions(store.getState());
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

	const { showModal } = useModal();
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();

	const [t] = useTranslation();

	const currencyCode = config.defaultCurrencyCode;

	const quoteOnWOS = useCallback(
		async (price: Price, cartItem: CartItem) => {
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
				seriesCode: cartItem.seriesCode,
				brandName: cartItem.brandName,
				brandCode: cartItem.brandCode,
				quantity: price.quantity,
			});
		},
		[dispatch, showLoginModal, showMessage, showPaymentMethodRequiredModal, t]
	);

	const handleClipBoardCopy = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		partNumber: string
	) => {
		e.preventDefault();
		e.stopPropagation();
		regacyPartNumberCopy(partNumber);
		clipBoardSuccessShow(e.currentTarget);
	};

	const clipBoardSuccessShow = (target: HTMLAnchorElement) => {
		const html = document.createElement('div');
		const p = document.createElement('p');
		const text = t('components.modals.addToCartModalMulti.clipBoardMessage');
		const textEl = document.createTextNode(text);
		html.className = styles.copyBalloon || '';
		p.appendChild(textEl);
		html.appendChild(p);
		target.appendChild(html);
		setTimeout(() => {
			target.removeChild(html);
		}, 1000);
	};

	return useCallback(
		(
			addCartResponse: AddCartResponse,
			priceList: Price[],
			isCompare?: boolean
		) => {
			const cartItemList = addCartResponse.cartItemList;

			return showModal(
				<AddToCartModalMulti
					priceList={priceList}
					cartItemList={cartItemList}
					currencyCode={currencyCode}
					isPurchaseLinkUser={isPurchaseLinkUser}
					authenticated={authenticated}
					hasQuotePermission={hasQuotePermission}
					quoteOnWOS={quoteOnWOS}
					handleClipBoardCopy={handleClipBoardCopy}
					isEcUser={isEcUser}
					displayStandardPriceFlag={series?.displayStandardPriceFlag}
					series={series}
					isCompare={isCompare}
				/>
			);
		},
		[
			authenticated,
			dispatch,
			hasQuotePermission,
			isPurchaseLinkUser,
			quoteOnWOS,
			series,
			showModal,
		]
	);
};
