import { AxiosError, CancelToken } from 'axios';
import { registerRewriteInterceptor } from './utils/dev/rewriteApiResponse';
import { createAxios, validateStatus } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { CameleerApiError } from '@/errors/api/CameleerApiError';
import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';
import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';
import { GeneralRecommendAPIResponse } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

/** request timeout (ms) */
const timeout = 29000;

/** request options */
type RequestOptions = {
	/** cancel token */
	cancelToken?: CancelToken;
};

/** Axios error handler */
function handleError(error: AxiosError) {
	throw new CameleerApiError(error);
}

const generateApi = () => {
	const $axios = createAxios(
		{
			baseURL: config.api.cameleer.origin,
			timeout,
			handleError,
			validateStatus,
		},
		{ shouldSendApiLog: true }
	);

	// 開発者向け機能
	registerRewriteInterceptor($axios).then();

	/**
	 * GET
	 * @param {string} url - path after domain
	 * @param {T} [request] - get parameters
	 * @param {RequestOptions} [options]  - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 * NOTE: 実際のレスポンスそのままではなく配列の最初の要素を返却しているのは、
	 *       返却されるJSONの最上位が array のため、そのまま model に変換できていない。
	 *       よって、実際に返却されるデータから推察し、暫定的に最初の要素を取るようにはしているものの、
	 *       「配列要素は１つだけか」、「０になることはないか」、「複数あった場合の表示対象はどうするのか」、
	 *       「そもそも配列にしている意味はあるのか」といった部分の確認を取れ次第修正すること。
	 */
	async function get<
		T extends CameleerApiRequest,
		R extends CameleerApiResponse | GeneralRecommendAPIResponse | never
	>(url: string, request?: T, options?: RequestOptions): Promise<R> {
		return (
			$axios
				.get(url, {
					params: { ...request },
					cancelToken: options?.cancelToken,
				})
				// TODO: NOTE記載のとおり、GeneralRecommend導入による暫定対応のため、response統一などした際には要再設計。
				.then(response =>
					response.data instanceof Array ? response.data[0] : response.data
				)
		);
	}

	return { get };
};

export const cameleerApi = generateApi();
