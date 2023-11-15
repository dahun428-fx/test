import { Translation } from '@/i18n/types';

export const domain: Translation = {
	express: {
		deadlineTime: 'Order Deadline - {{time}}',
	},
	quantity: {
		isNullWarning: 'Enter Quantity',
		notIntegerWarning: 'Enter 1 or an integer larger than 1 for the quantity.',
		minQuantityWarning:
			'Minimum order quantity is {{minQuantity}}. Please increase your quantity to {{minQuantity}} or more.',
		minQuantityPackWarning:
			'Minimum order quantity is {{minQuantity}} pack. Please increase your quantity to {{minQuantity}} pack or more.',
		orderUnitWarning:
			'Must be purchased in units of {{orderUnit}}. Please enter a quantity in multiples of {{orderUnit}}.',
		orderUnitPackWarning:
			'Must be purchased in units of {{orderUnit}} pack. Please enter a quantity in multiples of {{orderUnit}}.',
	},
	series: {
		piecePerPackage: '{{piecePerPackage}} Pieces Per Package',
		piecePerPackageWithRange: '{{min}}-{{max}} Pieces Per Package',
	},
	daysToShip: {
		sameDay: 'Same day',
		someDays: `{{days}} Day(s)`,
		shippedSameDay: 'Same-day shipment',
		shipToday: 'Shippable Today',
		needsEstimate: 'Need a quote',
		withInDays: '{{days}} Day(s) or Less',
		all: 'All',
		others: 'Others',
	},
	partNumber: {
		nPieces: '{{n}} Piece(s)',
		nPacks: '{{n}} Pack(s)',
		piecesPerPackage: '{{piecesPerPackage}} Pieces Per Package',
		empty: 'Enter PartNumber.',
		invalidCharacter:
			'Please enter the model number using half-width (single-byte) letters.',
	},
	punchout: {
		error: 'Purchase Linkage Error',
		includesInvalidCharacter:
			'Product number has wrong characters.\nIf you have any questions, please inquire to the person in charge of purchasing.',
		// メッセージが変だが、ect-web-my の通り。
		// The message is strange, but the same as ect-web-my.
		exceedsMaxCheckoutCount:
			'Cart exceeds the number of items allowed for Check Out. Please re-select',
	},
	spec: {
		notNumericalStringError: 'Enter the numerical value.',
		tooManyDecimalPlacesError:
			'The input value can be specified down to the fourth decimal place.',
		outOfRangeError: 'Enter a value matching range condition.',
	},
	brand: {
		brandList: 'Brand List',
		titlePage: 'Page {{page}}',
	},
	category: {
		titlePage: 'Page {{page}}',
	},
	departmentCode: {
		mech: 'Configurable components, factory automation, assembly automation, mechanical, MISUMI catalog, e-catalog, Web Ordering System, WOS',
		el: 'Mail Order, Mail Sale, MISUMI, Electric Components, Electronic Components, FA, Electronics, MISUMI Catalog, Quick Search, e-Catalog',
		fs: 'Mail Order, Mail Sale, MISUMI, Mechanical Components, Tools, MISUMI Catalog, Quick Search, e-Catalog',
		mold: 'Plastic Mold, MISUMI catalog, e-catalog, Web Ordering System, WOS',
		press: 'Press Die, MISUMI catalog, e-catalog, Web Ordering System, WOS',
	},
};
