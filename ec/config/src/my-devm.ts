import { my } from './resources/country/my';
import { dev } from './resources/env/dev';
import { global } from './resources/global';
import { en } from './resources/language/en';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://devm-jp.misumi-ec.com',
		},
		ect: {
			origin: 'https://devm-api.jp.misumi-ec.com',
		},
		auth: {
			origin: 'https://stg0-my.mauth.misumi-ec.com',
		},
		sinus: {
			origin: 'https://stg.mex.misumi-ec.com',
		},
		cadenas: {
			origin: 'https://devm-jp.misumi-ec.com',
		},
		cameleer: {
			origin: 'https://stg-recommend-my.misumi-ec.com',
		},
		legacy: {
			htmlContents: {
				origin: 'https://devm-jp.misumi-ec.com',
			},
			cms: {
				origin: 'https://devm-jp.misumi-ec.com',
			},
		},
	},
	web: {
		ec: {
			origin: 'https://devm-jp.misumi-ec.com',
		},
		wos: {
			// 以下のように config の値を合成することはあまり推奨されません。真に必要な時に限定してください。
			baseUrl: `https://devm-jp.misumi-ec.com${subsidiary.path.web.wos}`,
			staticContents: {
				baseUrl: `https://devm-jp.misumi-ec.com${subsidiary.path.web.wosStaticContents}`,
			},
		},
		digitalCatalog: {
			origin: 'https://stg0-my.c.misumi-ec.com',
		},
	},
	datadogRUM: {
		applicationId: '423ba163-5eee-4687-bde9-f263c4c7fe60',
		clientToken: 'pub333df7c5f350bfbd3f3ad9840fafa67c',
		site: 'datadoghq.com',
		service: 'ec-web',
		env: 'devm',
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
	...dev,
	...site,
};
