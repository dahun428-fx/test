import { my } from './resources/country/my';
import { stg } from './resources/env/stg';
import { global } from './resources/global';
import { en } from './resources/language/en';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://stg0-my.misumi-ec.com',
		},
		ect: {
			origin: 'https://stg0-api.my.misumi-ec.com',
		},
		auth: {
			origin: 'https://stg0-my.mauth.misumi-ec.com',
		},
		sinus: {
			origin: 'https://stg.mex.misumi-ec.com',
		},
		cadenas: {
			origin: 'https://stg0-my.misumi-ec.com',
		},
		cameleer: {
			origin: 'https://stg-recommend-my.misumi-ec.com',
		},
		legacy: {
			htmlContents: {
				origin: 'https://stg0-my.misumi-ec.com',
			},
			cms: {
				origin: 'https://stg0-my.misumi-ec.com',
			},
		},
	},
	web: {
		ec: {
			origin: 'https://stg0-my.misumi-ec.com',
		},
		wos: {
			// 以下のように config の値を合成することはあまり推奨されません。真に必要な時に限定してください。
			baseUrl: `https://stg0-wos.misumi-ec.com${subsidiary.path.web.wos}`,
			staticContents: {
				baseUrl: `https://stg0-wos.misumi-ec.com${subsidiary.path.web.wosStaticContents}`,
			},
		},
		digitalCatalog: {
			origin: 'https://stg0-my.c.misumi-ec.com',
		},
	},
	datadogRUM: {
		applicationId: '2b8b4e0c-1853-4564-9fd5-ce7befae3426',
		clientToken: 'pub67d8bb71bd6fa4c856abb5e4b9130886',
		site: 'datadoghq.com',
		service: 'ec-web',
		env: 'stg0',
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
	...stg,
	...site,
};
