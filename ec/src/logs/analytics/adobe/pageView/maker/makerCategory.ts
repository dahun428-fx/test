import {
	trackLowerCategoryView,
	Payload,
} from '@/logs/analytics/adobe/pageView/category/categoryLower';

export async function trackMakerCategoryView(payload: Payload) {
	trackLowerCategoryView(payload);
}
