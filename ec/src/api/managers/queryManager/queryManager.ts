import type { ParsedUrlQuery } from 'querystring';
import { config } from '@/config';

const onBrowser = typeof window !== 'undefined';

const keys = {
	devApi: 'dev:api',
} as const;

type InitPayload = {
	query: ParsedUrlQuery;
};

/**
 * Server side store
 * - NOTE: localhost で npm run dev などで実行している場合、
 *         この store は画面に対するリクエスト間で共有されます。
 *         素早く2つのタブでリロードをした場合などに、サーバサイド通信においてのみ、
 *         dev:api の内容が混線する場合があります。
 *         これは本番環境で許される挙動ではありませんが、
 *         この機能は開発者のためだけのものであることと、
 *         本番環境では無効にされていることから、許容しています。
 *         本番稼働させる機能を実装する場合は、
 *         Vercel に deploy された後どうなるかまで含めて、良く検討してください。
 * - WARN: 上記の事情から、この作りを安易に真似するととてつもない事故を
 *         引き起こすことがあり得ます。注意してください。
 */
type Store = {
	devApi: string[];
};

let store: Store = {
	devApi: [],
};

export const queryManager = {
	/**
	 * Initialize queryManager's store
	 * - Only for server side
	 * - Please call it at first on getServerSideProps.
	 */
	init({ query }: InitPayload) {
		if (config.env === 'prd') {
			// 本番環境では dev:api は一律無効にする。
			// queryManager で dev:api 以外も扱うことになった場合、ここは再考。
			return;
		}

		const devApi = query[keys.devApi];

		// init なので置き換え
		store = {
			devApi:
				typeof devApi === 'string'
					? [devApi]
					: devApi instanceof Array
					? devApi
					: [],
		};
	},

	existsDevApi(): boolean {
		if (config.env === 'prd') {
			// 本番環境では dev:api は一律無効にする
			return false;
		}

		if (onBrowser) {
			return Array.from(new URLSearchParams(window.location.search)).some(
				([key]) => key === keys.devApi
			);
		} else {
			return store.devApi.length > 0;
		}
	},

	getDevApi(): string[] {
		if (config.env === 'prd') {
			// 本番環境では dev:api は一律無効にする
			return [];
		}

		if (onBrowser) {
			return Array.from(new URLSearchParams(window.location.search))
				.filter(([key]) => key === keys.devApi)
				.map(([, value]) => value);
		} else {
			return store.devApi;
		}
	},
};
