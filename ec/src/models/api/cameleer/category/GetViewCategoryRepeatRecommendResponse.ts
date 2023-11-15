import { CameleerApiResponse } from '@/models/api/cameleer/CameleerApiResponse';

export interface GetViewCategoryRepeatRecommendResponse
	extends CameleerApiResponse {
	recommendItems: RecommendItem[];
}

interface RecommendItem {
	/** category code */
	itemCd: string;
	/** category name */
	name: string;
	linkUrl: string;
	imgUrl: string;
	description: string;
	categoryCdLv2: string;
	categoryCdLv3: string;
	categoryCdLv4: string;
	categoryCdLv5: string;
	categoryCdLv6: string;
	categoryCdLv7: string;
	isActive: number;
	ttl: number;
	position: number;
}
