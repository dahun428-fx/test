import { expressServiceTable } from './ExpressServiceTable/ExpressServiceTable.i18n.en';
import { Translation } from '@/i18n/types';

export const actionsPanel: Translation = {
	quantityLabel: 'Order Qty.',
	piecePerPackage: 'Pkg. {{piecesPerPackage}} pc(s). included',
	priceCheckButton: 'Check Price / Days to ship',
	noQuotePermission: 'You do not have quotation permission',
	stockQuantity: 'Quantity in stock {{stock}} pieces',
	noStock: 'Not in stock',
	promptRegistration:
		'This is standard price, please <0>register</0> to see the actual price',
	orderableMinQuantityPack: 'Minimum order quantity is {{minQuantity}} pack.',
	orderableMinQuantity: 'Minimum order quantity is {{minQuantity}}.',
	orderDeadline:
		'Please note that if this product is ordered after {{orderDeadline}}, the order will not be received until the following day.',
	shippable:
		'*{{ stock }} pieces can be shipped now from our stock. Please check the unit price and ship date before placing orders as they may vary depending on the order quantity.',
	stockDescription:
		'*"Current stock quantity" is the quantity available at the time when you access this screen. Such quantity may change before you complete your order because the stock quantity fluctuates constantly.',
	shippingDateWarning:
		'*The ship dates shown in the table are our normal ship dates. Such ship dates may differ from the actual ship dates.',
	addToMyComponents: 'Add to My Components',
	showMoreOptions: 'More Options',
	strongNoticeForDefaults: 'Following values set as default.',
	additionalNoticeForDefaults: '(Click "More Options" to reset values.)',
	openDefaults: 'Check the default value',
	closeDefaults: 'Close',
	expressServiceTable,
	confirmButton: 'Next',
	closeButton: 'Close',
	unableToAddToCart: 'The product cannot be added to the cart',
	unableToAddToMyComponents: 'Product cannot be added',
};
