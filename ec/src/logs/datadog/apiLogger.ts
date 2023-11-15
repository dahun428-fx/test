import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from './Logger';

const MASK = '***';

const maskTargetKeyList = [
	// ect-api request
	// ect-api login response
	'sessionId',

	// ect-api login response
	// auth-api refresh token request
	'refreshTokenHash',

	// ect-api login request
	'password',

	// auth-api refresh token response
	'access_token',
	'access_token_key',
	'refresh_token',
	'refresh_token_hash',
];
const maskTargetKeySet = new Set(maskTargetKeyList);

const logger = new Logger<Record<string, unknown>, Context>('api/logs', {
	level: 'info',
});

type Request = { url?: string; params: unknown; body: unknown };

type Context = {
	logType: string;
	status?: string;
	statusCode?: number;
	duration?: number;
	request?: Request;
	response?: Record<string, unknown>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rawError?: any;
};

/** Mask object */
const maskObject = (object: object): Record<string, unknown> => {
	const masked: Record<string, unknown> = {};

	Object.entries(object).map(([key, value]) => {
		if (
			value != null &&
			typeof value === 'object' &&
			!(value instanceof Array)
		) {
			masked[key] = maskObject(value);
		} else if (value instanceof Array) {
			masked[key] = value.map(element => {
				if (
					element != null &&
					typeof element === 'object' &&
					!(element instanceof Array)
				) {
					return maskObject(element);
				} else {
					return element;
				}
			});
		} else if (typeof value === 'string') {
			masked[key] = maskTargetKeySet.has(key) ? MASK : value;
		} else {
			masked[key] = value;
		}
	});

	return masked;
};

/** Mask application/x-www-form-urlencoded */
const maskForm = (form: string): string => {
	const params = new URLSearchParams();
	Array.from(new URLSearchParams(form))
		.map(([key, value]) =>
			maskTargetKeySet.has(key) ? [key, MASK] : [key, value]
		)
		.forEach(([key, value]) => {
			params.append(String(key), String(value));
		});
	return params.toString();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mask = (data: any) => {
	let body;

	if (typeof data === 'object') {
		// data is null or object
		body = data;
	} else if (typeof data === 'string') {
		try {
			body = JSON.parse(data);
		} catch {
			try {
				// maybe application/x-www-form-urlencoded
				return maskForm(data);
			} catch {
				// unknown data
				return data;
			}
		}
	}

	// body is null or object
	if (body) {
		return maskObject(body);
	}

	return data;
};

const getRequest = (config: AxiosRequestConfig): Request => ({
	url: config.url,
	params: mask(config.params),
	body: mask(config.data),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResponse = (data: any) => ({ body: mask(data) });

const getDuration = (config: AxiosRequestConfig): number | undefined =>
	config.startedAt !== undefined ? Date.now() - config.startedAt : undefined;

export const apiLogger = {
	info(response: AxiosResponse) {
		try {
			const { config, status } = response;

			// Do not send response on fulfilled.
			logger.info(`api/success ${config.url}`, {
				logType: 'api/success',
				statusCode: status,
				duration: getDuration(config),
				request: getRequest(config),
			});
		} catch {
			// noop
		}
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error(error: any) {
		try {
			// NOTE: error はこの時点では ApiCancelError になっていないので注意。関連: NEW_FE-3414
			if (axios.isCancel(error)) {
				return;
			} else if (axios.isAxiosError(error)) {
				logger.error(`api/error ${error.config.url}`, {
					logType: 'api/error',
					statusCode: error.response?.status,
					duration: getDuration(error.config),
					request: getRequest(error.config),
					response: error.response
						? getResponse(error.response.data)
						: undefined,
				});
			} else {
				logger.error('api/unknown', {
					logType: 'api/unknown',
					rawError: mask(error),
				});
			}
		} catch {
			// noop
		}
	},
};
