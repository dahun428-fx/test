import { Translation } from '@/i18n/types';

export const needsQuoteMessage: Translation = {
	nonstandard: 'Check the WOS for the price / Days to ship of this product.',
	bigOrder: 'Quote required when qty. >= {{largeOrderMaxQuantity}}.',
	priceLeadTime: 'Ship date & price for this item are calculated upon request.',
	price: 'The price of this product is quoted on an as-needed basis.',
	leadTime:
		'The delivery date of this product is estimated on an as-needed basis.',
	quoteOnWos: 'Quote on WOS.',
};
