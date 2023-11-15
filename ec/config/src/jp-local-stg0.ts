import { my } from './resources/country/my';
import { global } from './resources/global';
import { en } from './resources/language/en';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://stg0-jp.misumi-ec.com',
		},
		ect: {
			origin: 'https://stg0-api.jp.misumi-ec.com',
		},
		auth: {
			origin: 'https://stg1-mauth.misumi.jp',
		},
		sinus: {
			origin: 'https://stg.mex.misumi-ec.com',
		},
		cadenas: {
			// CORS bypass proxy for local development
			origin: 'http://localhost:3001',
		},
		cameleer: {
			origin: 'https://stg-recommend-jp.misumi-ec.com',
		},
		legacy: {
			htmlContents: {
				// CORS bypass proxy for local development
				origin: 'http://localhost:3001',
			},
			cms: {
				// CORS bypass proxy for local development
				origin: 'http://localhost:3001',
			},
		},
	},
	web: {
		ec: {
			origin: 'https://stg1-jp.misumi-ec.com',
		},
		wos: {
			// 以下のように config の値を合成することはあまり推奨されません。真に必要な時に限定してください。
			baseUrl: `https://stg0-wos.misumi-ec.com${subsidiary.path.web.wos}`,
			staticContents: {
				baseUrl: `https://stg0-wos.misumi-ec.com${subsidiary.path.web.wosStaticContents}`,
			},
		},
		digitalCatalog: {
			origin: 'https://stg0-jp.c.misumi-ec.com',
		},
	},
	// datadogRUM was copied from my-stg0.ts
	datadogRUM: {
		applicationId: '2b8b4e0c-1853-4564-9fd5-ce7befae3426',
		clientToken: 'pub67d8bb71bd6fa4c856abb5e4b9130886',
		site: 'datadoghq.com',
		service: 'rum-a-ecweb-apl-apne1-my-stg00-01',
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
	...site,
	env: 'stg',
	applicationId: {
		msm: 'ae680197-8861-4a83-90f8-c0d3729bd4e7-stg',
	},
	cookie: {
		domain: '', // NOTE: ローカルでは domain を指定すると Cookie が取得できない。
	},
};
