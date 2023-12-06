import { AxiosError, AxiosResponse, CancelToken } from 'axios';
import { registerRewriteInterceptor } from './utils/dev/rewriteApiResponse';
import { getSessionId } from './utils/session';
import { createAxios } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { MsmApiErrorResponse } from '@/models/api/msm/MsmApiErrorResponse';
import { MsmApiParams } from '@/models/api/msm/MsmApiParams';
import { MsmApiRequest } from '@/models/api/msm/MsmApiRequest';
import { MsmApiResponse } from '@/models/api/msm/MsmApiResponse';
import { isObject } from '@/utils/object';

/** request timeout (ms) */
const timeout = 29000;

/** default http GET parameters */
async function getDefaultParams() {
	// TODO: lang, debug, ...
	return {
		sessionId: await getSessionId(),
		applicationId: config.applicationId.msm,
		// NOTE: マレーシアに英語以外の言語が追加されたら要改善
		lang: 'KOR',
	};
}

/** request options */
type RequestOptions<P extends MsmApiParams> = {
	/** parameters */
	params?: P;
	/** cancel token */
	cancelToken?: CancelToken;
};

/**
 * Axios error handler.
 */
function handleError(error: AxiosError) {
	if (isMsmApiErrorResponse(error.response?.data)) {
		throw new MsmApiError(error);
	}
}

/**
 * Type guard MsmApiErrorResponse
 */
function isMsmApiErrorResponse(
	response: unknown
): response is MsmApiErrorResponse {
	if (response == null) {
		return true;
	}

	if (!isObject<MsmApiErrorResponse>(response)) {
		return false;
	}

	return Array.isArray(response.errorList) && isObject(response.errorList[0]);
}

const generateApi = (type: 'msm' | 'ect') => {
	const $axios = createAxios(
		{
			baseURL: config.api[type].origin,
			timeout,
			handleError,
		},
		{ shouldSendApiLog: true }
	);

	// 開発者向け機能
	registerRewriteInterceptor($axios).then();

	/**
	 * GET
	 * @param {string} url - path after domain
	 * @param {T} [request] - get parameters
	 * @param {RequestOptions<P>} [options]  - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R, P
	 */
	async function get<
		T extends MsmApiRequest,
		R extends MsmApiResponse,
		P extends MsmApiParams = MsmApiParams
	>(url: string, request?: T, options?: RequestOptions<P>): Promise<R> {
		return $axios
			.get(url, {
				params: {
					...(await getDefaultParams()),
					...request,
					...options?.params,
				},
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	/**
	 * POST
	 * @param {string} url - path after domain
	 * @param {T} request - request body
	 * @param {RequestOptions<P>} [options] - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R, P
	 */
	async function post<
		T extends MsmApiRequest,
		R extends MsmApiResponse,
		P extends MsmApiParams = MsmApiParams
	>(url: string, request: T, options?: RequestOptions<P>): Promise<R> {
		return $axios
			.post<T, AxiosResponse<R>>(url, request, {
				params: {
					...(await getDefaultParams()),
					...options?.params,
				},
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	return { get, post };
};

/** msm-api family */
export const msmApi = generateApi('msm');

/** ect-api */
export const ectApi = generateApi('ect');
