import { unitPrice } from './UnitPrice/UnitPrice.i18n.en';
import { Translation } from '@/i18n/types';

export const purchaseConditions: Translation = {
	unitPrice,
	unitPriceLabel: 'Unit Price',
	unitPricePiecePerPackage:
		'(This product includes {{piecesPerPackage}} pc(s).)',
	totalAmountLabel: 'Total',
	sameDayShippingMessage:
		'"Same Day" ship out service is available for <0>Stock items* ONLY</0>, if order is placed by 3:00 pm. Please contact our Customer Service Team for more information.\n*Kindly note: Stock items are shipped out from Singapore.',
	daysToShipLabel: 'Days to ship',
};
