import { unitPrice } from './UnitPrice/UnitPrice.i18n.en';
import { Translation } from '@/i18n/types';

export const priceLeadTime: Translation = {
	unitPriceLabel: 'Unit Price',
	totalAmountLabel: 'Total',
	daysToShipLabel: 'Days to ship',
	quantityLabel: 'Order Qty.',
	sameDayShippingMessage:
		'"Same Day" ship out service is available for <0>Stock items* ONLY</0>, if order is placed by 3:00 pm. Please contact our Customer Service Team for more information.\n*Kindly note: Stock items are shipped out from Singapore.',
	unitPrice,
	piecesPerPackage: 'Pkg. ({{piecesPerPackage}} pc(s). included)',
};
