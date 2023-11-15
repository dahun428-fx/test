//=============================================================================
// 開発者向け機能
// features for developers
//=============================================================================
import type { AxiosInstance } from 'axios';
import merge from 'deepmerge';
import { queryManager } from '@/api/managers/queryManager';
import type { ApiResponse } from '@/models/api/ApiResponse';
import { orverwrite, replace } from '@/utils/dev/rewrite';

const onBrowser = typeof window !== 'undefined';

/**
 * GETパラメータ dev:api に基づきAPIレスポンスを書き換えます。
 * - dev:api は複数指定可能です。JSON5 で指定します。
 * - dev:api の format: `{ path: 'APIパス正規表現', response: {上書きしたいレスポンスデータ}, options: { array: 後述 } }`
 * - path か response が指定されていないと書き換えは行われません。
 * - undefined を指定すると undefined に差し替えます。`?dev:api={ path: '/foo', response: { hoge: undefined } }`
 * - array の merge 方法は3種類選べます。デフォルトでは array は連結(concat)されますが、array を
 *   まるごと入れ替えたい場合は、`{ options: { array: 'replace' } }` を指定してください。
 *   1要素ずつ追加・上書きしたい場合は、`{ options: { array: 'overwrite' } }` を指定してください。
 *
 * @example ?dev:api={ path: '/userInfo', response: { permissionList: ['1'] } }&dev:api={ path: '/orderInfo', response: { ... } }
 * @param json5Parser
 * @param response APIレスポンス
 * @param path リクエストしたAPIのパス
 */
async function rewriteApiResponse<T extends ApiResponse>(
	json5Parser: typeof JSON.parse,
	response: T,
	path?: string
): Promise<T> {
	/** 書き換えられた API Response */
	let res = response;

	if (!path) {
		return res;
	}

	queryManager.getDevApi().forEach((devApi: string) => {
		// 開発者専用機能であるため丁寧なエラーハンドリングはしない。
		const params = json5Parser(devApi);
		if (params.path && params.response) {
			if (path.match(new RegExp(params.path))) {
				const options: merge.Options = {};
				if (params.options) {
					if (params.options.array === 'replace') {
						options.arrayMerge = replace;
					} else if (params.options.array === 'overwrite') {
						options.arrayMerge = orverwrite;
					}
				}
				res = merge(res, params.response, options);
			}
		}
	});

	return res;
}

export async function registerRewriteInterceptor($axios: AxiosInstance) {
	if (process.env.NEXT_PUBLIC_ENABLE_DEV_API !== 'true') {
		return;
	}

	// NOTE:
	const parser = await import('json5').then(modules => modules.parse);

	if (onBrowser) {
		// ブラウザで動作している場合、最初にランディングした時の dev:api しか処理しない。
		// 開発者向けの機能であり、可能な限り発動しないようにする。
		if (queryManager.existsDevApi()) {
			$axios.interceptors.response.use(response => ({
				...response,
				data: rewriteApiResponse(parser, response.data, response.config.url),
			}));
		}
	} else {
		// サーバーで動作している場合、runtime 制御になる。
		// init より後で判定させる必要があるためである。
		// 1アクセスあたりの実行頻度は低いため、許容している。これをブラウザ側で書いちゃダメ。
		$axios.interceptors.response.use(response =>
			queryManager.existsDevApi()
				? {
						...response,
						data: rewriteApiResponse(
							parser,
							response.data,
							response.config.url
						),
				  }
				: response
		);
	}
}
