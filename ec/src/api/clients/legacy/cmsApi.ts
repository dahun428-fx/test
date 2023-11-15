import { getBasicAuth } from '@/api/clients/utils/basicAuth';
import { createAxios } from '@/api/clients/utils/createAxios';
import { config } from '@/config';
import { ApiResponse } from '@/models/api/ApiResponse';
import { isObject } from '@/utils/object';

const origin = config.api.legacy.cms.origin;

const $axios = createAxios({
	baseURL: origin,
	timeout: 29000, // 必要？
	headers: { 'x-msm-web': 'true' }, // Akamai経由のコンテンツにアクセスする際に必要
});

// dev モードの場合のみ url に origin を付与する
if (process.env.NODE_ENV === 'development') {
	$axios.interceptors.response.use(response => {
		return { data: addOrigin(response.data) };
	});

	/* eslint-disable @typescript-eslint/no-explicit-any */
	const addOrigin = (from: unknown) => {
		if (!isObject(from)) {
			return from;
		}
		const to: { [key: string]: any } = {};
		for (const [key, value] of Object.entries(from)) {
			if (Array.isArray(value)) {
				to[key] = value.map(addOrigin);
			} else if (isObject(value)) {
				to[key] = addOrigin(value);
			} else if (key.toLowerCase().endsWith('url')) {
				to[key] = `${origin}${value}`;
			} else {
				to[key] = value;
			}
		}
		return to;
	};
	/* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Movable Type などの CMS コンテンツを取得する API
 */
export const cmsApi = {
	/**
	 * GET request
	 * @param {string} url - api url
	 * @return {Promise<R>} response
	 * @template R
	 */
	async get<R extends ApiResponse>(url: string): Promise<R> {
		const auth = getBasicAuth();
		return $axios.get(url, { auth }).then(response => response.data);
	},
} as const;
