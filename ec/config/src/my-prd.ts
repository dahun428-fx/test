import { my } from './resources/country/my';
import { prd } from './resources/env/prd';
import { global } from './resources/global';
import { en } from './resources/language/en';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://my.misumi-ec.com',
		},
		ect: {
			origin: 'https://api.my.misumi-ec.com',
		},
		auth: {
			origin: 'https://my.mauth.misumi-ec.com',
		},
		sinus: {
			origin: 'https://mex.misumi-ec.com',
		},
		cadenas: {
			origin: 'https://my.misumi-ec.com',
		},
		cameleer: {
			origin: 'https://recommend-my.misumi-ec.com',
		},
		legacy: {
			htmlContents: {
				origin: 'https://my.misumi-ec.com',
			},
			cms: {
				origin: 'https://my.misumi-ec.com',
			},
		},
	},
	web: {
		ec: {
			origin: 'https://my.misumi-ec.com',
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
		applicationId: 'f60c5d31-560b-4bad-9e2c-be4b1e4f1745',
		clientToken: 'pubaada807112d4845b382ac2c2f03044cf',
		site: 'datadoghq.com',
		service: 'ec-web',
		env: 'prd',
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
