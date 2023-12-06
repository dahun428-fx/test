import { Subsidiary } from '@/config/types';

export const subsidiary: Subsidiary = {
	subsidiaryCode: 'KOR',
	locales: ['ko'],
	defaultCurrencyCode: 'KRW', // For fallback of the currency code obtained from the API.
	cookie: {
		domain: '.misumi-ec.com',
	},
	path: {
		web: {
			userRegistrationGuide: '/guide/category/member/register_flow.html',
			wos: '/my',
			wosStaticContents: '/contents/my',
		},
	},
	form: {
		length: {
			max: {
				loginId: 128,
				password: 128,
				keyword: 200,
				quantity: 5,
			},
		},
	},
	pagination: {
		detail: {
			size: 60,
			sizeList: [30, 60, 90],
		},
		series: {
			size: 45,
			sizeList: [30, 45, 60],
		},
		techView: {
			size: 10,
			sizeList: [10, 20, 50, 100],
		},
	},
};
