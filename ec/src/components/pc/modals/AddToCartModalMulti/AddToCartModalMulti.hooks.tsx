import React, { createElement, useCallback, useEffect, useState } from 'react';
import { AddToCartModalMulti, Series } from './AddToCartModalMulti';
import { useModal } from '../../ui/modals/Modal.hooks';
import { config } from '@/config';
import { useSelector } from '@/store/hooks';
import {
	refreshAuth,
	selectAuthenticated,
	selectIsAbleToCheckout,
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
import { CartItem } from '@/models/api/msm/ect/cart/AddCartResponse';
import { moveToQuote } from '@/utils/domain/order';
import { regacyPartNumberCopy } from '@/utils/clipboardCopy';
import styles from './AddToCartModalMulti.module.scss';

export const useAddToCartModalMulti = (series?: Series) => {
	const dispatch = useDispatch();

	// authenticated
	const authenticated = useSelector(selectAuthenticated);

	/** Purchase Link User or not */
	const isPurchaseLinkUser = useSelector(selectIsPurchaseLinkUser);
	const isAbleToCheckout = useSelector(selectIsAbleToCheckout);
	const isEcUser = useSelector(selectIsEcUser);

	const { hasQuotePermission } = selectUserPermissions(store.getState());
	const showPaymentMethodRequiredModal = usePaymentMethodRequiredModal();

	const [cartItemList, setCartItemList] = useState<any[]>([]);
	const [priceList, setPriceList] = useState<any[]>([]);

	const { showModal } = useModal();
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();

	const [t] = useTranslation();

	const currencyCode = config.defaultCurrencyCode;
	console.log('currencyCode===>', currencyCode);
	useEffect(() => {
		const list = [
			{
				partNumber: 'PSFG6-30',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				unitPrice: 1300,
				piecesPerPackage: 100,
				standardUnitPrice: 1300,
				totalPrice: 1300,
				daysToShip: 3,
				shipType: '3',
				shipTypeDisp: '토 / 공휴일 제외',
				shipDate: '2024/02/13',
				priceInquiryFlag: '0',
				orderDeadline: '2024/02/13',
				daysToShipInquiryFlag: '0',
				volumeDiscountList: [
					{
						minQuantity: 1,
						maxQuantity: 4,
						unitPrice: 1300,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 1240,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 1170,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1040,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1040,
						daysToShip: 99,
					},
				],
				expressList: [
					{
						expressType: 'T0',
						expressTypeDisp: '2일째 출하(익스프레스T)',
						chargeType: '1',
						charge: 5200,
						expressDeadline: '11:00',
					},
				],
				lowVolumeCharge: { charge: 3000, chargeType: '2' },
				unfitType: '4',
				unfitTypeDisp: '미확정이 아님',
				errorList: [
					{
						errorCode: 'WOS006',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS009',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS021',
						errorType: '2',
						errorParameterList: [
							'1/1300/3|5/1240/3|20/1170/3|50/1040/3|100/1040/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['1430.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['7'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
			{
				partNumber: 'PSFG6-33',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				piecesPerPackage: 100,
				unitPrice: 1100,
				standardUnitPrice: 1300,
				totalPrice: 1300,
				daysToShip: 3,
				shipType: '3',
				shipTypeDisp: '토 / 공휴일 제외',
				shipDate: '2024/02/13',
				priceInquiryFlag: '0',
				daysToShipInquiryFlag: '0',
				volumeDiscountList: [
					{
						minQuantity: 1,
						maxQuantity: 4,
						unitPrice: 1300,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 1240,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 1170,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1040,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1040,
						daysToShip: 99,
					},
				],
				expressList: [
					{
						expressType: 'T0',
						expressTypeDisp: '2일째 출하(익스프레스T)',
						chargeType: '1',
						charge: 5200,
						expressDeadline: '11:00',
					},
				],
				lowVolumeCharge: {},
				unfitType: '4',
				unfitTypeDisp: '미확정이 아님',
				errorList: [
					{
						errorCode: 'WOS006',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS009',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS021',
						errorType: '2',
						errorParameterList: [
							'1/1300/3|5/1240/3|20/1170/3|50/1040/3|100/1040/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['1430.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['8'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
			{
				partNumber: 'PSFG6-35',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				unitPrice: 1200,
				standardUnitPrice: 1300,
				totalPrice: 1300,
				daysToShip: 3,
				shipType: '3',
				shipTypeDisp: '토 / 공휴일 제외',
				shipDate: '2024/02/13',
				priceInquiryFlag: '0',
				daysToShipInquiryFlag: '0',
				volumeDiscountList: [
					{
						minQuantity: 1,
						maxQuantity: 4,
						unitPrice: 1300,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 1240,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 1170,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1040,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1040,
						daysToShip: 99,
					},
				],
				expressList: [
					{
						expressType: 'T0',
						expressTypeDisp: '2일째 출하(익스프레스T)',
						chargeType: '1',
						charge: 5200,
						expressDeadline: '11:00',
					},
				],
				lowVolumeCharge: {},
				unfitType: '4',
				unfitTypeDisp: '미확정이 아님',
				errorList: [
					{
						errorCode: 'WOS006',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS009',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS021',
						errorType: '2',
						errorParameterList: [
							'1/1300/3|5/1240/3|20/1170/3|50/1040/3|100/1040/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['1430.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['8'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
		];
		const priceList = [
			{
				partNumber: 'PSFG6-30',
				standardPartNumber: 'PSFG6-30',
				innerCode: 'MDM00000543459',
				zinnerCode: '30018110013',
				brandCode: 'MSM1',
				productName: '샤프트 스트레이트 타입',
				unitPrice: 1300,
				standardUnitPrice: 1300,
				pricePerPiece: 1300,
				quantity: 1,
				totalPrice: 1300,
				currencyCode: 'KRW',
				daysToShip: 3,
				shipDate: '2024/02/13',
				deliveryDate: '2024/02/14',
				shipType: '3',
				shipTypeDisp: '토 / 공휴일 제외',
				priceInquiryFlag: '0',
				daysToShipInquiryFlag: '0',
				weight: 7,
				weightUnit: 'g',
				volumeDiscountList: [
					{
						minQuantity: 1,
						maxQuantity: 4,
						unitPrice: 1300,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 1240,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 1170,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1040,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1040,
						daysToShip: 99,
					},
				],
				expressList: [
					{
						expressType: 'T0',
						expressTypeDisp: '2일째 출하(익스프레스T)',
						chargeType: '1',
						charge: 5200,
						expressDeadline: '11:00',
					},
				],
				unfitType: '4',
				unfitTypeDisp: '미확정이 아님',
				errorList: [
					{
						errorCode: 'WOS006',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS009',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS021',
						errorType: '2',
						errorParameterList: [
							'1/1300/3|5/1240/3|20/1170/3|50/1040/3|100/1040/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['1430.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['7'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
			{
				partNumber: 'PSFG6-33',
				standardPartNumber: 'PSFG6-33',
				innerCode: 'MDM00000543459',
				zinnerCode: '30018110013',
				brandCode: 'MSM1',
				productName: '샤프트 스트레이트 타입',
				unitPrice: 1100,
				standardUnitPrice: 1300,
				pricePerPiece: 1300,
				quantity: 1,
				totalPrice: 1300,
				piecesPerPackage: 100,
				currencyCode: 'KRW',
				daysToShip: 3,
				shipDate: '2024/02/13',
				deliveryDate: '2024/02/14',
				shipType: '3',
				shipTypeDisp: '토 / 공휴일 제외',
				priceInquiryFlag: '0',
				daysToShipInquiryFlag: '0',
				weight: 8,
				weightUnit: 'g',
				volumeDiscountList: [
					{
						minQuantity: 1,
						maxQuantity: 4,
						unitPrice: 1300,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 1240,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 1170,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1040,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1040,
						daysToShip: 99,
					},
				],
				expressList: [
					{
						expressType: 'T0',
						expressTypeDisp: '2일째 출하(익스프레스T)',
						chargeType: '1',
						charge: 5200,
						expressDeadline: '11:00',
					},
				],
				unfitType: '4',
				unfitTypeDisp: '미확정이 아님',
				errorList: [
					{
						errorCode: 'WOS006',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS009',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS021',
						errorType: '2',
						errorParameterList: [
							'1/1300/3|5/1240/3|20/1170/3|50/1040/3|100/1040/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['1430.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['8'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
			{
				partNumber: 'PSFG6-35',
				standardPartNumber: 'PSFG6-35',
				innerCode: 'MDM00000543459',
				zinnerCode: '30018110013',
				brandCode: 'MSM1',
				productName: '샤프트 스트레이트 타입',
				unitPrice: 1200,
				standardUnitPrice: 1300,
				pricePerPiece: 1300,
				piecesPerPackage: 100,
				quantity: 1,
				totalPrice: 1300,
				currencyCode: 'KRW',
				daysToShip: 3,
				shipDate: '2024/02/13',
				deliveryDate: '2024/02/14',
				shipType: '3',
				shipTypeDisp: '토 / 공휴일 제외',
				priceInquiryFlag: '0',
				daysToShipInquiryFlag: '0',
				weight: 8,
				weightUnit: 'g',
				volumeDiscountList: [
					{
						minQuantity: 1,
						maxQuantity: 4,
						unitPrice: 1300,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 1240,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 1170,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1040,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1040,
						daysToShip: 99,
					},
				],
				expressList: [
					{
						expressType: 'T0',
						expressTypeDisp: '2일째 출하(익스프레스T)',
						chargeType: '1',
						charge: 5200,
						expressDeadline: '11:00',
					},
				],
				unfitType: '4',
				unfitTypeDisp: '미확정이 아님',
				errorList: [
					{
						errorCode: 'WOS006',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS009',
						errorType: '2',
						errorParameterList: [''],
					},
					{
						errorCode: 'WOS021',
						errorType: '2',
						errorParameterList: [
							'1/1300/3|5/1240/3|20/1170/3|50/1040/3|100/1040/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['1430.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['8'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
		];
		setCartItemList(list);
		setPriceList(priceList);
	}, []);

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
		const text = '수량/형번을 클립보드에 복사했습니다';
		const textEl = document.createTextNode(text);
		html.className = styles.copyBalloon || '';
		p.appendChild(textEl);
		html.appendChild(p);
		target.appendChild(html);
		setTimeout(() => {
			target.removeChild(html);
		}, 1000);
	};

	return useCallback(() => {
		return showModal(
			<AddToCartModalMulti
				priceList={priceList}
				cartItemList={cartItemList}
				currencyCode={currencyCode}
				isPurchaseLinkUser={isPurchaseLinkUser}
				isAbleToCheckout={isAbleToCheckout}
				authenticated={authenticated}
				hasQuotePermission={hasQuotePermission}
				quoteOnWOS={quoteOnWOS}
				handleClipBoardCopy={handleClipBoardCopy}
				isEcUser={isEcUser}
				displayStandardPriceFlag={series?.displayStandardPriceFlag}
			/>
		);
	}, [showModal, cartItemList, priceList]);
};
