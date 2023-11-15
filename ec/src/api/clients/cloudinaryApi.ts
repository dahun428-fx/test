import { CancelToken } from 'axios';
import { createAxios, validateStatus } from '@/api/clients/utils/createAxios';
import { CloudinaryApiRequest } from '@/models/api/cloudinary/CloudinaryApiRequest';
import { CloudinaryApiResponse } from '@/models/api/cloudinary/CloudinaryApiResponse';

/** request timeout (ms) */
const timeout = 29000;

/** request options */
type RequestOptions = {
	/** cancel token */
	cancelToken?: CancelToken;
};

const generateApi = () => {
	const $axios = createAxios({ timeout, validateStatus });

	/**
	 * GET
	 * @param {string} url - path after domain
	 * @param {T} [request] - get parameters
	 * @param {RequestOptions} [options]  - http request options
	 * @returns {Promise<R>} api response
	 * @template T, R, P
	 */
	async function get<
		T extends CloudinaryApiRequest,
		R extends CloudinaryApiResponse
	>(url: string, request?: T, options?: RequestOptions): Promise<R> {
		return $axios
			.get(url, {
				params: { ...request },
				cancelToken: options?.cancelToken,
			})
			.then(response => response.data);
	}

	return { get };
};

export const cloudinaryApi = generateApi();
