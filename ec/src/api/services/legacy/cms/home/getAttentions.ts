import { cmsApi } from '@/api/clients';
import { GetAttentionsResponse } from '@/models/api/cms/home/GetAttentionsResponse';

/**
 * Get attentions
 */
export async function getAttentions(): Promise<GetAttentionsResponse> {
	return cmsApi.get('/ecm/attention_all.json');
}
