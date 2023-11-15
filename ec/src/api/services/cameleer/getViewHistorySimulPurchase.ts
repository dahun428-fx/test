import { cameleerApi } from '@/api/clients';
import { GetViewHistorySimulPurchaseRequest } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseRequest';
import { GetViewHistorySimulPurchaseResponse } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';

/**
 * Get Radar Chart Recommend Content
 * @param {GetViewHistorySimulPurchaseRequest} request - request parameters
 * @returns {Promise<GetViewHistorySimulPurchaseResponse>}
 */
export function getViewHistorySimulPurchase(
	// TODO: Request そのものではなく、外から渡す必要のあるものだけに絞り、わかりやすい項目名にする。
	request: GetViewHistorySimulPurchaseRequest
): Promise<GetViewHistorySimulPurchaseResponse | null> {
	return cameleerApi
		.get<
			GetViewHistorySimulPurchaseRequest,
			GetViewHistorySimulPurchaseResponse
		>('/cameleer/REST/ViewHistorySimulPurchase', request)
		.then(response => (Object.keys(response).length === 0 ? null : response))
		.catch(() => null);
}
