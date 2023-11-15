import {
	Payload,
	trackLowerCategoryView,
} from '@/logs/analytics/google/pageView/category/categoryLower';

export async function trackMakerCategoryView(payload: Payload) {
	trackLowerCategoryView(payload);
}
