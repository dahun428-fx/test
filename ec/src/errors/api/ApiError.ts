import { AxiosError } from 'axios';
import { ApplicationError } from '@/errors/ApplicationError';

/**
 * Api error class
 */
export class ApiError<T> extends ApplicationError {
	/** HTTP status */
	readonly status?: number;

	/** api url occurred error */
	readonly url?: string;

	/** date time at occurred error */
	readonly occurredAt: Date;

	/** api error request */
	readonly params?: unknown;

	/** api error response */
	readonly response?: T;

	/** original error instance */
	readonly original: AxiosError<T>;

	/**
	 * constructor
	 * @param {AxiosError<T>} error - axios error
	 * @param {string} [message] - error message(optional)
	 * @template T
	 */
	constructor(error: AxiosError<T>, message?: string) {
		const status = error.response?.status;
		const response = error.response?.data;
		const url = error.config.url;
		super(message ?? toMessage(status, url, response));
		this.name = 'ApiError';
		this.status = status;
		this.params = error.config.params;
		this.response = response;
		this.url = url;
		this.occurredAt = new Date();
		this.original = error;
	}

	get toJSON() {
		return {
			status: this.status,
			url: this.url,
			params: JSON.stringify(this.params),
			response: JSON.stringify(this.response),
			occurredAt: this.occurredAt,
		};
	}
}

/**
 * Convert to message from error options.
 * @returns error message
 */
function toMessage(status?: number, url?: string, response?: unknown) {
	return [
		`status=${status}`,
		url && `url=${url}`,
		response && `response=${JSON.stringify(response)}`,
	]
		.filter(Boolean)
		.join(', ');
}
