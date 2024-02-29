import { reviewApi } from '@/api/clients/reviewApi';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { SearchReviewResponse } from '@/models/api/review/SearchReviewResponse';
import { CancelToken } from 'axios';

const constants = {
	API_PATH: '/ec-review',
	API_PATH_DATA: '/ec-review-data',
	API_PATH_INFO: '/ec-review-info',
	API_PATH_RECOMMEND: '/ec-review-recommend',
	API_PATH_REPORT: '/ec-review-report',
	API_PATH_COUNT: '/ec-review-count',
	API_PATH_RT: '/ec-code',
	API_CONFIG: '/ec-config-data',
	REVIEW_PAGE_SIZE: 9,
	REVIEW_STATE: 1,
};

export function searchProductReviews(
	request: SearchReviewRequest,
	cancelToken?: CancelToken
): Promise<SearchReviewResponse> {
	return reviewApi.post(`/api/ec-review-data`, request, {
		cancelToken,
	});
}

export function searchReviewConfig(
	cancelToken?: CancelToken
): Promise<SearchReviewResponse> {
	return reviewApi.get('/api/ec-config-data', {}, { cancelToken });
}

export function searchReviewInfo(
	seriesCode: string,
	cancelToken?: CancelToken
): Promise<SearchReviewResponse> {
	return reviewApi.get(
		`/api/ec-review-info/${seriesCode}`,
		{},
		{ cancelToken }
	);
}
