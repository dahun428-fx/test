import { reviewApi } from '@/api/clients/reviewApi';
import { AddReviewLikeRequest } from '@/models/api/review/AddReviewLikeRequest';
import { AddReviewLikeResponse } from '@/models/api/review/AddReviewLikeResponse';
import { AddReviewReportRequest } from '@/models/api/review/AddReviewReportRequest';
import { AddReviewReportResponse } from '@/models/api/review/AddReviewReportResponse';
import { AddReviewRequest } from '@/models/api/review/AddReviewRequest';
import { AddReviewResponse } from '@/models/api/review/AddReviewResponse';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { SearchReviewResponse } from '@/models/api/review/SearchReviewResponse';
import { UpdateReviewRequest } from '@/models/api/review/UpdateReviewRequest';
import { UpdateReviewResponse } from '@/models/api/review/UpdateReviewResponse';
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

export function searchMyReviewCountInSeries(
	regId: string,
	seriesCode: string,
	cancelToken?: CancelToken
): Promise<SearchReviewResponse> {
	return reviewApi.post(
		`/api/ec-review-count`,
		{ reg_id: regId, series_code: seriesCode },
		{ cancelToken }
	);
}

export function addReview(
	request: AddReviewRequest,
	cancelToken?: CancelToken
): Promise<AddReviewResponse> {
	return reviewApi.post(`/api/ec-review`, request, { cancelToken });
}

export function searchReviewDetail(
	reviewId: number,
	cancelToken?: CancelToken
): Promise<SearchReviewResponse> {
	return reviewApi.get(`/api/ec-review/${reviewId}`, {}, { cancelToken });
}

export function modifyReview(
	reviewId: number,
	request: UpdateReviewRequest,
	cancelToken?: CancelToken
): Promise<UpdateReviewResponse> {
	return reviewApi.put(`/api/ec-review/${reviewId}`, request, { cancelToken });
}

export function removeReview(reviewId: number, cancelToken?: CancelToken) {
	return reviewApi._delete(`/api/ec-review/${reviewId}`, {}, { cancelToken });
}

export function searchReviewReportData(
	cancelToken?: CancelToken
): Promise<SearchReviewResponse> {
	return reviewApi.get(`/api/ec-code/RT`, {}, { cancelToken });
}

export function addReviewReport(
	request: AddReviewReportRequest,
	cancelToken?: CancelToken
): Promise<AddReviewReportResponse> {
	return reviewApi.post(`/api/ec-review-report`, request, { cancelToken });
}

export function addReviewLike(
	request: AddReviewLikeRequest,
	cancelToken?: CancelToken
): Promise<AddReviewLikeResponse> {
	return reviewApi.post(`/api/ec-review-recommend`, request, { cancelToken });
}
