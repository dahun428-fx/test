import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { Logger } from '@/logs/datadog';
import { GetOrderInfoRequest } from '@/models/api/msm/ect/orderInfo/GetOrderInfoRequest';
import { GetOrderInfoResponse } from '@/models/api/msm/ect/orderInfo/GetOrderInfoResponse';
import { store } from '@/store';
import { selectIsEcUser, selectUser } from '@/store/modules/auth';

const availableCurrencyCodes = Array.of<string | undefined>(
	'MYR',
	'SGD',
	'USD'
);

/**
 * Get order info.
 * @param {GetOrderInfoRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<GetOrderInfoResponse>} search result
 */
export async function getOrderInfo(
	request: GetOrderInfoRequest,
	cancelToken?: CancelToken
): Promise<GetOrderInfoResponse> {
	const response = await ectApi.get<GetOrderInfoRequest, GetOrderInfoResponse>(
		'/api/v1/orderInfo',
		request,
		{ cancelToken }
	);

	// 通貨コードが返ってこない場合の調査用
	const isECUser = selectIsEcUser(store.getState());
	if (!isECUser && !availableCurrencyCodes.includes(response.currencyCode)) {
		Logger.error('Currency code is unavailable', {
			data: {
				sessionStatus: selectUser(store.getState())?.sessionStatus,
				orderInfo: response,
			},
		});
	}

	return response;
}
