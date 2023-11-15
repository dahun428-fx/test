import { my } from './resources/country/my';
import { prd } from './resources/env/prd';
import { global } from './resources/global';
import { en } from './resources/language/en';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://pre-my.misumi-ec.com',
		},
		ect: {
			origin: 'https://pre-api.my.misumi-ec.com',
		},
		auth: {
			origin: 'https://my.mauth.misumi-ec.com',
		},
		sinus: {
			origin: 'https://mex.misumi-ec.com',
		},
		cadenas: {
			origin: 'https://pre-my.misumi-ec.com',
		},
		cameleer: {
			origin: 'https://recommend-my.misumi-ec.com',
		},
		legacy: {
			htmlContents: {
				origin: 'https://pre-my.misumi-ec.com',
			},
			cms: {
				origin: 'https://pre-my.misumi-ec.com',
			},
		},
	},
	web: {
		ec: {
			origin: 'https://pre-my.misumi-ec.com',
		},
		wos: {
			// 以下のように config の値を合成することはあまり推奨されません。真に必要な時に限定してください。
			baseUrl: `https://www.misumi-ec.com${subsidiary.path.web.wos}`,
			staticContents: {
				baseUrl: `https://www.misumi-ec.com${subsidiary.path.web.wosStaticContents}`,
			},
		},
		digitalCatalog: {
			origin: 'https://my.c.misumi-ec.com',
		},
	},
	datadogRUM: {
		applicationId: '640c09e6-e349-4e10-b40d-ad308090ae6e',
		clientToken: 'pub4226af7ee58883012598f9be0ea665d8',
		site: 'datadoghq.com',
		service: 'ec-web',
		env: 'pre',
		sampleRate: 100,
		trackInteractions: true,
		defaultPrivacyLevel: 'mask-user-input',
	},
	metaTags: {
		formatDetection: {
			mobile: 'telephone=no, email=no, address=no',
		},
	},
};

export const config: Config = {
	...global,
	...subsidiary,
	...my,
	...en,
	...prd,
	...site,
};
