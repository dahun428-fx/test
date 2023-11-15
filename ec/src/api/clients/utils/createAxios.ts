import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApplicationError } from '@/errors/ApplicationError';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { ApiError } from '@/errors/api/ApiError';
import { apiLogger } from '@/logs/datadog/apiLogger';
import { isObject } from '@/utils/object';
import { notNull } from '@/utils/predicate';

type AxiosErrorHandler = (error: AxiosError) => void;

type CreateAxiosConfig = AxiosRequestConfig & {
	handleError?: AxiosErrorHandler;
};

/**
 * custom axios creator
 * @param config - axios request default config.
 */
export function createAxios(
	config: CreateAxiosConfig = {},
	options?: { shouldSendApiLog?: true }
) {
	const $axios = axios.create({ paramsSerializer, ...config });
	const { shouldSendApiLog } = options ?? {};

	if (shouldSendApiLog) {
		$axios.interceptors.request.use(config => ({
			...config,
			startedAt: Date.now(),
		}));
	}

	$axios.interceptors.response.use(
		response => {
			if (shouldSendApiLog) {
				apiLogger.info(response);
			}
			return response;
		},
		error => {
			if (shouldSendApiLog) {
				apiLogger.error(error);
			}
			return handleRejected(error, config.handleError);
		}
	);
	return $axios;
}

/**
 * serialize params.
 * @param {unknown} params - params
 * @returns serialized parameters
 * @throws {Error} in case params is not object
 */
function paramsSerializer(params: unknown) {
	if (!isObject(params)) {
		// if params is not object, throws error as non-serializable params.
		throw Error(`Non-serializable params. ${JSON.stringify(params)}`);
	}
	return Object.entries(params)
		.map(([key, value]) => {
			// if value is null or undefined, excludes key from params.
			if (value == null) {
				return;
			}

			if (Array.isArray(value)) {
				if (!value.length) {
					return;
				}
				return `${key}=${value.map(encodeURIComponent).join(`,`)}`;
			}

			if (!isObject(value)) {
				return `${key}=${encodeURIComponent(value)}`;
			}
		})
		.filter(notNull)
		.join('&');
}

/**
 * handle occurred error on calling api.
 * re-throws error according to the cause.
 * @param {unknown} error - occurred error on calling api.
 * @param {AxiosErrorHandler} [handler] - axios error handler.
 */
function handleRejected(error: unknown, handler?: AxiosErrorHandler): never {
	if (axios.isCancel(error)) {
		throw new ApiCancelError();
	}

	if (axios.isAxiosError(error)) {
		handler?.(error);
		throw new ApiError(error);
	}
	throw new ApplicationError(`Unknown type of api error: ${error}`);
}

/**
 * validate HTTP status.
 * @param {number} status - HTTP response status
 * @returns if status belows 400, returns true (fulfilled), otherwise returns false (rejected).
 */
export function validateStatus(status: number) {
	return status >= 200 && status < 400;
}
