import { QnaApiError } from '@/errors/api/QnaApiError';
import { QnaApiErrorResponse } from '@/models/api/qna/QnaApiErrorResponse';
import { isObject } from '@/utils/object';
import { AxiosError, AxiosResponse, CancelToken } from 'axios';
import { createAxios, validateStatus } from './utils/createAxios';
import { config } from '@/config';
import { registerRewriteInterceptor } from './utils/dev/rewriteApiResponse';
import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';
import { QnaApiResponse } from '@/models/api/qna/QnaApiResponse';

/** request timeout (ms) */
const timeout = 3000;

/** request options */
type RequestOptions = {
	cancelToken?: CancelToken;
};

function handleError(error: AxiosError) {
	if (isQnaApiErrorResponse(error.response?.data)) {
		throw new QnaApiError(error);
	}
}

function isQnaApiErrorResponse(
	response: unknown
): response is QnaApiErrorResponse {
	if (response == null) {
		return true;
	}
	if (!isObject<QnaApiErrorResponse>(response)) {
		return false;
	}
	return !!response.status;
}

const generateApi = () => {
	const $axios = createAxios(
		{
			baseURL: config.api.qna.origin,
			timeout,
			handleError,
			validateStatus,
		},
		{ shouldSendApiLog: true }
	);
	// 開発者向け機能
	registerRewriteInterceptor($axios);

	/**
	 * DELETE => _delete (not reserved words : delete)
	 * @param {string} url - path after domain
	 * @param {T} request - request body
	 * @param {RequestOptions} [options] - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function _delete<T extends QnaApiRequest, R extends QnaApiResponse>(
		url: string,
		request?: T,
		options?: RequestOptions
	): Promise<R> {
		return $axios
			.delete(url, {
				params: { ...request },
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	/**
	 * PUT
	 * @param {string} url - path after domain
	 * @param {T} request - request body
	 * @param {RequestOptions} [options] - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function put<T extends QnaApiRequest, R extends QnaApiResponse>(
		url: string,
		request: T,
		options?: RequestOptions
	): Promise<R> {
		return $axios
			.put<T, AxiosResponse<R>>(url, request, {
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	/**
	 * POST
	 * @param {string} url - path after domain
	 * @param {T} request - request body
	 * @param {RequestOptions} [options] - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function post<T extends QnaApiRequest, R extends QnaApiResponse>(
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

	/**
	 * GET
	 * @param {string} url - path after domain
	 * @param {T} [request] - get parameters
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function get<T extends QnaApiRequest, R extends QnaApiResponse>(
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
	return { post, get, put, _delete };
};

export const qnaApi = generateApi();
