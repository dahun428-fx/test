import { my } from './resources/country/my';
import { chk } from './resources/env/chk';
import { global } from './resources/global';
import { en } from './resources/language/en';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://chk0-my.misumi-ec.com',
		},
		ect: {
			origin: 'https://chk0-api.my.misumi-ec.com',
		},
		auth: {
			origin: 'https://my.mauth.misumi-ec.com',
		},
		sinus: {
			origin: 'https://mex.misumi-ec.com',
		},
		cadenas: {
			origin: 'https://chk0-my.misumi-ec.com',
		},
		cameleer: {
			origin: 'https://recommend-my.misumi-ec.com',
		},
		legacy: {
			htmlContents: {
				origin: 'https://chk0-my.misumi-ec.com',
			},
			cms: {
				origin: 'https://chk0-my.misumi-ec.com',
			},
		},
	},
	web: {
		ec: {
			origin: 'https://chk0-my.misumi-ec.com',
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
	// datadogRUM was copied from my-stg0.ts
	datadogRUM: {
		applicationId: '668a1c45-1256-4925-a478-a80fad33dce8',
		clientToken: 'pub3645ba60f0ec7f71c2b4c74d4e27f8e8',
		site: 'datadoghq.com',
		service: 'ec-web',
		env: 'chk0',
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
	...chk,
	...site,
};
