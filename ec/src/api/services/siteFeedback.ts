import type { CancelToken } from 'axios';
import { msmApi } from '@/api/clients';
import { AddSiteFeedbackRequest } from '@/models/api/msm/ect/siteFeedback/AddSiteFeedbackRequest';
import { AddSiteFeedbackResponse } from '@/models/api/msm/ect/siteFeedback/AddSiteFeedbackResponse';

/**
 * siteFeedback: サイト改善/misumiへのご意見
 * @param {AddSiteFeedbackRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<AddSiteFeedbackResponse>} send to info response
 */
export function siteFeedback(
	request: AddSiteFeedbackRequest,
	cancelToken?: CancelToken
): Promise<AddSiteFeedbackResponse> {
	return msmApi.post(
		'/api/v1/siteFeedback/add',
		{ ...request, suppressResponseCode: true },
		{ cancelToken }
	);
}
