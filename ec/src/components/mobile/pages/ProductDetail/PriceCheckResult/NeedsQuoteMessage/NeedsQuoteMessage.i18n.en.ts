import { Translation } from '@/i18n/types';

export const needsQuoteMessage: Translation = {
	outOfSpecific: 'Check the WOS for the price / Days to ship of this product.',
	bigOrder:
		'Quote required when qty. >= {{largeOrderMaxQuantity}}.\nQuote on WOS.',
	priceLeadTime:
		'Ship date & price for this item are calculated upon request. Please use WOS to quote.\nQuote on WOS.',
	price:
		'The price of this product is quoted on an as-needed basis. Go to the WOS.',
	leadTime:
		'The delivery date of this product is estimated on an as-needed basis. Go to the WOS.',
	quoteTarget: {
		all: 'Unit Price / Total / Days to ship',
		price: 'Unit Price / Total',
		daysToShip: 'Days to ship',
	},
};
