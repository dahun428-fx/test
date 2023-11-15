import { AxiosError, CancelToken } from 'axios';
import { createAxios, validateStatus } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { CadenasApiError } from '@/errors/api/CadenasApiError';
import { CadenasApiRequest } from '@/models/api/cadenas/CadenasApiRequest';
import { CadenasApiResponse } from '@/models/api/cadenas/CadenasApiResponse';

/** request timeout (ms) */
const timeout = 29000;

/** request options */
type RequestOptions = {
	/** cancel token */
	cancelToken?: CancelToken;
};

/** Axios error handler */
function handleError(error: AxiosError) {
	throw new CadenasApiError(error);
}

const generateApi = () => {
	const $axios = createAxios(
		{
			baseURL: config.api.cadenas.origin,
			timeout,
			handleError,
			validateStatus,
		},
		{ shouldSendApiLog: true }
	);

	/**
	 * GET
	 * @param {string} url - path after domain
	 * @param {T} [request] - get parameters
	 * @param {RequestOptions} [options]  - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function get<T extends CadenasApiRequest, R extends CadenasApiResponse>(
		url: string,
		request?: T,
		options?: RequestOptions
	): Promise<R> {
		return $axios
			.get(url, {
				params: { ...request },
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	return { get };
};

export const cadenasApi = generateApi();
