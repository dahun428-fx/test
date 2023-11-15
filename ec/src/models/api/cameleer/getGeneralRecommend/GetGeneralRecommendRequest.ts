import { CameleerApiRequest } from '@/models/api/cameleer/CameleerApiRequest';

export interface GetGeneralRecommendRequest extends CameleerApiRequest {
	key: string;
}
