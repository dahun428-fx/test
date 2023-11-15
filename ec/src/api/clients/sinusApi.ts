import { AxiosError, AxiosResponse, CancelToken } from 'axios';
import { registerRewriteInterceptor } from './utils/dev/rewriteApiResponse';
import { createAxios, validateStatus } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { SinusApiError } from '@/errors/api/SinusApiError';
import { SinusApiErrorResponse } from '@/models/api/sinus/SinusApiErrorResponse';
import { SinusApiRequest } from '@/models/api/sinus/SinusApiRequest';
import { SinusApiResponse } from '@/models/api/sinus/SinusApiResponse';
import { isObject } from '@/utils/object';

/** request timeout (ms) */
const timeout = 29000;

/** request options */
type RequestOptions = {
	/** cancel token */
	cancelToken?: CancelToken;
};

/**
 * Axios error handler.
 */
function handleError(error: AxiosError) {
	if (isSinusApiErrorResponse(error.response?.data)) {
		throw new SinusApiError(error);
	}
}

/**
 * Type guard for SinusApiErrorResponse
 */
function isSinusApiErrorResponse(
	response: unknown
): response is SinusApiErrorResponse {
	if (response == null) {
		return true;
	}

	if (!isObject<SinusApiErrorResponse>(response)) {
		return false;
	}

	return !!response.status;
}

const generateApi = () => {
	const $axios = createAxios(
		{ baseURL: config.api.sinus.origin, timeout, handleError, validateStatus },
		{ shouldSendApiLog: true }
	);

	// 開発者向け機能
	registerRewriteInterceptor($axios).then();

	/**
	 * POST
	 * @param {string} url - path after domain
	 * @param {T} request - request body
	 * @param {RequestOptions} [options] - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function post<T extends SinusApiRequest, R extends SinusApiResponse>(
		url: string,
		request: T,
		options?: RequestOptions
	): Promise<R> {
		return $axios
			.post<T, AxiosResponse<R>>(url, request, {
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	return { post };
};

export const sinusApi = generateApi();
