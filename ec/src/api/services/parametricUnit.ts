import { ectApi } from '@/api/clients';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { CancelToken } from 'axios';

/**
 * Search part number
 * @param request
 * @param cancelToken
 * @param options
 */
export function searchPartNumber(
	request: SearchPartNumberRequest,
	cancelToken?: CancelToken,
	options?: {
		fields?: string[];
		userAgent?: string;
	}
): Promise<SearchPartNumberResponse$search> {
	return ectApi.get('/api/v1/parametricUnit/partNumber/search', request, {
		cancelToken,
		params: { field: options?.fields?.join() },
	});
}

/**
 * Parametric Unit Search part number @search
 * @param request
 * @param cancelToken
 */
export function searchPartNumber$search(
	request: SearchPartNumberRequest,
	cancelToken?: CancelToken,
	options?: {
		isBot?: boolean;
		userAgent?: string;
	}
): Promise<SearchPartNumberResponse$search> {
	return searchPartNumber(request, cancelToken, {
		...options,
		fields: ['@search'],
	});
}
