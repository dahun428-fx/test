import { Flag } from '@/models/api/Flag';
import UnfitType from '@/models/api/constants/UnfitType';
import { Price } from '@/models/api/msm/ect/price/CheckPriceResponse';

/** WARN: UNDER INVESTIGATION!! */
const basePrice: Price = {
	brandCode: 'MSM1',
	content: '1 Box (30 Rolls)',
	currencyCode: 'MYR',
	daysToShip: 4,
	daysToShipInquiryFlag: Flag.FALSE,
	deliveryDate: '2022/09/10',
	errorList: [],
	expressList: [],
	// expressType: '',
	// expressTypeDisp: '',
	innerCode: 'MDM00016165323',
	// largeOrderMaxQuantity: 0,
	// largeOrderMinQuantity: 0,
	// longLeadTimeThreshold: 0,
	// lowVolumeCharge: undefined,
	// minQuantity: 0,
	// orderDeadline: '',
	// orderUnit: 0,
	partNumber: 'N756-50-25-0.23-YL-PACK',
	piecesPerPackage: 30,
	priceInquiryFlag: Flag.FALSE,
	pricePerPiece: 29.68,
	productName: 'Best Cloth Tape No.756',
	quantity: 1,
	shipDate: '2022/09/08',
	shipType: '3',
	shipTypeDisp: 'Without soil and holidays',
	// specialShipmentFee: 0,
	// specialShipmentType: '',
	standardPartNumber: 'N756-50-25-0.23-YL-PACK',
	standardUnitPrice: 890.18,
	// stockQuantity: 0,
	totalPrice: 890.18,
	// totalPriceIncludingTax: 0,
	unfitType: UnfitType.NotUnfit,
	unfitTypeDisp: 'Not pending',
	unitPrice: 890.18,
	volumeDiscountList: [
		{ minQuantity: 1, maxQuantity: 12, unitPrice: 890.18, daysToShip: 4 },
		{ minQuantity: 13, unitPrice: 890.18, daysToShip: 99 },
	],
	weight: 999,
	weightUnit: 'g',
};

export function createPrice(price?: Partial<Price>): Price {
	return { ...basePrice, ...price };
}
