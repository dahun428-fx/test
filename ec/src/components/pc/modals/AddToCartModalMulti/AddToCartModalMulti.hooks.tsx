import { useCallback, useEffect, useState } from 'react';
import { AddToCartModalMulti, Series } from './AddToCartModalMulti';
import { useModal } from '../../ui/modals/Modal.hooks';

export const useAddToCartModalMulti = () => {
	const [cartItemList, setCartItemList] = useState<any[]>([]);
	const [priceList, setPriceList] = useState<any[]>([]);

	const { showModal } = useModal();

	useEffect(() => {
		setCartItemList([
			{
				partNumber: 'PSFG6-20',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				unitPrice: 1300,
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
				expressList: [],
				lowVolumeCharge: {},
				unfitType: '0',
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
						errorParameterList: ['5'],
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
				unitPrice: 1300,
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
				expressList: [],
				lowVolumeCharge: {},
				unfitType: '0',
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
				partNumber: 'PSFG6-44',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				unitPrice: 1300,
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
				expressList: [],
				lowVolumeCharge: {},
				unfitType: '0',
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
						errorParameterList: ['10'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
			{
				partNumber: 'PSFG6-66',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				unitPrice: 1300,
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
				expressList: [],
				lowVolumeCharge: {},
				unfitType: '0',
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
						errorParameterList: ['15'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
			{
				partNumber: 'PSFG6-101',
				productName: '샤프트 스트레이트 타입',
				seriesCode: '110302634310',
				innerCode: 'MDM00000543459',
				productImageUrl:
					'//stg0-kr.misumi-ec.com/linked/material/mech/MSM1/PHOTO/10302634310.jpg',
				brandCode: 'MSM1',
				brandName: '미스미 (MISUMI)',
				quantity: 1,
				unitPrice: 2490,
				standardUnitPrice: 2490,
				totalPrice: 2490,
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
						unitPrice: 2490,
						daysToShip: 3,
					},
					{
						minQuantity: 5,
						maxQuantity: 19,
						unitPrice: 2370,
						daysToShip: 3,
					},
					{
						minQuantity: 20,
						maxQuantity: 49,
						unitPrice: 2240,
						daysToShip: 3,
					},
					{
						minQuantity: 50,
						maxQuantity: 99,
						unitPrice: 1990,
						daysToShip: 3,
					},
					{
						minQuantity: 100,
						unitPrice: 1990,
						daysToShip: 99,
					},
				],
				expressList: [],
				lowVolumeCharge: {},
				unfitType: '0',
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
							'1/2490/3|5/2370/3|20/2240/3|50/1990/3|100/1990/99',
						],
					},
					{
						errorCode: 'WOS027',
						errorType: '2',
						errorParameterList: ['2739.000'],
					},
					{
						errorCode: 'WOS031',
						errorType: '2',
						errorParameterList: ['30018110013'],
					},
					{
						errorCode: 'WOS037',
						errorType: '2',
						errorParameterList: ['23'],
					},
					{
						errorCode: 'WOS038',
						errorType: '2',
						errorParameterList: ['g'],
					},
				],
			},
		]);
	}, []);
	/**
	 *
	 *
	 *
	 */
	return useCallback(() => {
		return showModal(
			<AddToCartModalMulti priceList={priceList} cartItemList={cartItemList} />
		);
	}, [showModal, cartItemList]);
};
