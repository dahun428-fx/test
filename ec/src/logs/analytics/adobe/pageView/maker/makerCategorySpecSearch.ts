import {
	trackCategorySpecSearchView,
	Payload,
} from '@/logs/analytics/adobe/pageView/category/categorySpecSearch';

export async function trackMakerCategorySpecSearchView(payload: Payload) {
	trackCategorySpecSearchView(payload);
}
