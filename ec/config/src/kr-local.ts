import { kr } from './resources/country/kr';
import { stg } from './resources/env/stg';
import { global } from './resources/global';
import { ko } from './resources/language/kr';
import { subsidiary } from './resources/subsidiary';
import { Config, Site } from '@/config/types';

const site: Site = {
	api: {
		msm: {
			origin: 'https://stg0-kr.misumi-ec.com',
		},
		ect: {
			origin: 'https://stg0-api.kr.misumi-ec.com',
		},
		auth: {
			origin: 'https://stg0-kr.mauth.misumi-ec.com',
		},
		sinus: {
			origin: 'https://stg.mex.misumi-ec.com',
		},
		cadenas: {
			// CORS bypass proxy for local development
			origin: 'http://localhost:3001',
		},
		cameleer: {
			origin: 'https://stg-recommend-kr.misumi-ec.com',
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
			// origin: 'https://stg0-kr.misumi-ec.com',
			// origin: 'http://localhost:3000',
			origin: 'http://local.misumi-ec.com:3000',
		},
		wos: {
			// 以下のように config の値を合成することはあまり推奨されません。真に必要な時に限定してください。
			baseUrl: `https://stg0-wos.misumi-ec.com${subsidiary.path.web.wos}`,
			staticContents: {
				baseUrl: `https://stg0-wos.misumi-ec.com${subsidiary.path.web.wosStaticContents}`,
			},
		},
		digitalCatalog: {
			origin: 'https://stg0-kr.c.misumi-ec.com',
		},
	},
	// datadogRUM was copied from my-stg0.ts
	// TODO: Update datadog setting for korea
	datadogRUM: {
		applicationId: '',
		clientToken: '',
		site: 'datadoghq.com',
		service: '',
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
	...kr,
	...ko,
	...stg,
	...site,
	cookie: {
		domain: '', // NOTE: ローカルでは domain を指定すると Cookie が取得できない。
	},
};
