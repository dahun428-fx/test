import { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchPartNumberRequest } from '@/models/api/msm/ect/partNumber/SearchPartNumberRequest';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';

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
	}
): Promise<SearchPartNumberResponse$search> {
	return ectApi.get('/api/v1/partNumber/search', request, {
		cancelToken,
		params: { field: options?.fields?.join() },
	});
}

/**
 * Search part number @search
 * @param request
 * @param cancelToken
 */
export function searchPartNumber$search(
	request: SearchPartNumberRequest,
	cancelToken?: CancelToken
): Promise<SearchPartNumberResponse$search> {
	return searchPartNumber(request, cancelToken, { fields: ['@search'] });
}
