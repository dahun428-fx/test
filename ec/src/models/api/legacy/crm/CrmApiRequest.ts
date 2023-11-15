import { ApiRequest } from '@/models/api/ApiRequest';

/**
 * CRM API request interface
 */
export interface CrmApiRequest extends ApiRequest {
	subsidiary?: string;
	x?: string;
	x2?: string;
	x3?: string;
	dispPage?: string;
	dispPattern?: string;
}
