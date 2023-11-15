import { CancelToken } from 'axios';
import { cameleerApi } from '@/api/clients';
import { GetViewHistoryRequest } from '@/models/api/cameleer/getViewHistory/GetViewHistoryRequest';
import { GetViewHistoryResponse } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';

/**
 * Get View History Recommend Content
 * @param {GetViewHistoryRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<GetViewHistoryResponse>}
 */
export function getViewHistory(
	// TODO: Request そのものではなく、外から渡す必要のあるものだけに絞り、わかりやすい項目名にする。
	request: GetViewHistoryRequest,
	cancelToken?: CancelToken
): Promise<GetViewHistoryResponse | null> {
	return cameleerApi
		.get<GetViewHistoryRequest, GetViewHistoryResponse>(
			'/cameleer/REST/ViewHistory',
			request,
			{
				cancelToken,
			}
		)
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}
