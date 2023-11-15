import { Translation } from '@/i18n/types';

export const meta: Translation = {
	title: {
		withPartNumber:
			'{{partNumber}} | {{seriesName}} | {{brandName}} | MISUMI Malaysia',
		withoutPartNumber: {
			pagination:
				'(Page{{page}})Part Number | {{seriesName}} | {{brandName}} | MISUMI Malaysia',
			withoutPagination: '{{seriesName}} | {{brandName}} | MISUMI Malaysia',
		},
	},
	siteName: 'MISUMI Malaysia',
	description: {
		partNumberPage: ' (Part Numbers) Page{{page}}',
		withPartNumber: {
			group1:
				'{{partNumber}} {{seriesName}} from {{brandName}}. MISUMI has more than 9 millions products of Automation Components, Fastners and Materials. MISUMI offers free CAD downloads, No Shipping charge with short lead times. Available to order online 24 hr.',
			group2:
				'{{partNumber}} {{seriesName}} from {{brandName}}. MISUMI has more than 9 millions products of Material Handling & Storage Products, Safety & General Supplies and Lab & Clean Room Supplies. No Shipping charge with short lead times. Available to order online 24 hr.',
			group3:
				'{{partNumber}} {{seriesName}} from {{brandName}}. MISUMI has more than 9 millions products of Cutting Tools, Processing Tools and Measuring Equipments. No Shipping charge with short lead times. Available to order online 24 hr.',
			group4:
				'{{partNumber}} {{seriesName}} from {{brandName}}. MISUMI offers free CAD downloads, short lead times, No MOQ and competitive pricing of Press Die Components, Plastic Mold Components and Injection Molding Components. Available to order online 24 hr.',
			group5:
				'{{partNumber}} {{seriesName}} from {{brandName}}. MISUMI has more than 9 millions products of Wireing Components, Electrical Components and Control Parts. No Shipping charge with short lead times. Available to order online 24 hr.',
		},
		withoutPartNumber: {
			group1:
				'{{seriesName}} from {{brandName}}{{partNumberPage}}. MISUMI has more than 9 millions products of Automation Components, Fastners and Materials. MISUMI offers free CAD downloads, No Shipping charge with short lead times. Available to order online 24 hr.',
			group2:
				'{{seriesName}} from {{brandName}}{{partNumberPage}}. MISUMI has more than 9 millions products of Material Handling & Storage Products, Safety & General Supplies and Lab & Clean Room Supplies. No Shipping charge with short lead times. Available to order online 24 hr.',
			group3:
				'{{seriesName}} from {{brandName}}{{partNumberPage}}. MISUMI has more than 9 millions products of Cutting Tools, Processing Tools and Measuring Equipments. No Shipping charge with short lead times. Available to order online 24 hr.',
			group4:
				'{{seriesName}} from {{brandName}}{{partNumberPage}}. MISUMI offers free CAD downloads, short lead times, No MOQ and competitive pricing of Press Die Components, Plastic Mold Components and Injection Molding Components. Available to order online 24 hr.',
			group5:
				'{{seriesName}} from {{brandName}}{{partNumberPage}}. MISUMI has more than 9 millions products of Wireing Components, Electrical Components and Control Parts. No Shipping charge with short lead times. Available to order online 24 hr.',
		},
	},
};
