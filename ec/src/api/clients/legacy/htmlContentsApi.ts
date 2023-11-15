import { CancelToken } from 'axios';
import { getBasicAuth } from '@/api/clients/utils/basicAuth';
import { createAxios } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { HtmlContentsApiRequest } from '@/models/api/legacy/htmlContents/HtmlContentsApiRequest';

/** request timeout (ms) */
const timeout = 29000;

/** request options */
type RequestOptions = {
	/** cancel token */
	cancelToken?: CancelToken;
};

const generateApi = () => {
	const origin = config.api.legacy.htmlContents.origin;
	const $axios = createAxios({
		baseURL: origin,
		timeout,
		headers: { 'x-msm-web': 'true' }, // Akamai経由のコンテンツにアクセスする際に必要
	});

	const defaultParams = {} as const;

	/**
	 * GET
	 * @param {string} url - path after domain
	 * @param {T} [request] - get parameters
	 * @param {RequestOptions} [options]  - http request options
	 * @returns {Promise<string>} response
	 * @template T
	 */
	async function get<T extends HtmlContentsApiRequest>(
		url: string,
		request?: T,
		options?: RequestOptions
	): Promise<string> {
		const auth = getBasicAuth();
		return $axios
			.get(url, {
				params: { ...defaultParams, ...request },
				cancelToken: options?.cancelToken,
				responseType: 'text',
				auth,
			})
			.then(response => {
				// ローカル動確時のみ、img src="" の中身が /operation/〜 であれば origin を先頭に追加。
				// - FIXME: いくらなんでもグロすぎるので改善
				// - WARN: 他で絶対にこのような地獄の記述はしないでください。
				//         以下は改善される可能性のある、暫定の実装です。
				// - NOTE: この方式だと、localhost で npm run start で起動した場合、
				//         画像パスは書き変わらないため、画像はロードできなくなります。問題になってきたら要改善です。
				if (
					process.env.NODE_ENV === 'development' &&
					response.status === 200 &&
					typeof response.data === 'string'
				) {
					return response.data
						.replaceAll('src="/operation/', `src="${origin}/operation/`)
						.replaceAll(
							'link href="/operation/',
							`link href="${origin}/operation/`
						);
				} else {
					return response.data;
				}
			});
	}

	return { get };
};

/** legacy html contents api (実際にはAPIではない) */
export const htmlContentsApi = generateApi();
