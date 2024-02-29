import { ReviewApiErrorResponse } from '@/models/api/review/ReviewApiErrorResponse';
import { isObject } from '@/utils/object';
import { AxiosError, AxiosResponse, CancelToken } from 'axios';
import { createAxios, validateStatus } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { registerRewriteInterceptor } from './utils/dev/rewriteApiResponse';
import { ReviewApiRequest } from '@/models/api/review/ReviewApiRequest';
import { ReviewApiResponse } from '@/models/api/review/ReviewApiResponse';
import { ReviewApiError } from '@/errors/api/ReviewApiError';

/** request timeout (ms) */
const timeout = 3000;

/** request options */
type RequestOptions = {
	/** cancel token */
	cancelToken?: CancelToken;
};

function handleError(error: AxiosError) {
	if (isReviewApiErrorResponse(error.response?.data)) {
		throw new ReviewApiError(error);
	}
}

function isReviewApiErrorResponse(
	response: unknown
): response is ReviewApiErrorResponse {
	if (response == null) {
		return true;
	}

	if (!isObject<ReviewApiErrorResponse>(response)) {
		return false;
	}

	return !!response.status;
}

const generateApi = () => {
	const $axios = createAxios(
		{ baseURL: config.api.review.origin, timeout, handleError, validateStatus },
		{ shouldSendApiLog: true }
	);

	// 開発者向け機能
	registerRewriteInterceptor($axios);

	/**
	 * POST
	 * @param {string} url - path after domain
	 * @param {T} request - request body
	 * @param {RequestOptions} [options] - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R
	 */
	async function post<T extends ReviewApiRequest, R extends ReviewApiResponse>(
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
	async function get<T extends ReviewApiRequest, R extends ReviewApiResponse>(
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
	return { post, get };
};

export const reviewApi = generateApi();
