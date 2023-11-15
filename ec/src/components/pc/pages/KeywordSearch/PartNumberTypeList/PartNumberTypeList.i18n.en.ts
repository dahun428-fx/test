import { productSpecColumns } from './ProductSpecColumns/ProductSpecColumns.i18n.en';
import { Translation } from '@/i18n/types';

export const partNumberTypeList: Translation = {
	heading: 'Part Number / Type ({{totalCount}} items)',
	productInfo: 'Product information',
	discontinuedLabel: 'Discontinued',
	unlistedLabel: 'No listed product information',
	cad: 'CAD',
	priceLeadTime: 'Price / Days to Ship',
	daysToShip: 'Days to Ship: ',
	standardPrice: 'Standard Price: ',
	specialPrice: 'Special Price',
	quantity: 'Quantity',
	orderNow: 'Order Now',
	addToCart: 'Add to Cart',
	discontinuedYearMonth: 'Product was discontinued in {{yearMonth}}',
	noCartPermissionError:
		'You do not have permission to add the product(s) to the cart',
	showMoreButton: 'Find similar part numbers',
	typeCount: '({{displayCount}} / {{totalCount}} items)',
	close: 'Close',
	productSpecColumns,
};
