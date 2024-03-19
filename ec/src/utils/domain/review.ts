import { GetCustomerInfoResponse } from '@/models/api/msm/ect/customerInfo/GetCustomerInfoResponse';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { AddReviewRequest } from '@/models/api/review/AddReviewRequest';
import { ReviewStateType } from '@/models/api/review/SearchReviewResponse';
import { assertNotNull } from '../assertions';
import { UpdateReviewRequest } from '@/models/api/review/UpdateReviewRequest';
import { AddReviewReportRequest } from '@/models/api/review/AddReviewReportRequest';

/** is available reviewState */
export function isAvailaleReviewState(reviewConfig: any | undefined): boolean {
	if (!reviewConfig || !!!reviewConfig.reviewState) {
		return false;
	}
	if (reviewConfig.reviewState > 0) {
		return true;
	}
	return false;
}

/**
 * masking for review
 * @param regId review regId
 * @param regName review regName
 * @param loginedUserCode auth.userCode | user.userCode
 * @returns maked user name - review regname
 */
export function modUserId(
	regId: string,
	regName: string,
	loginedUserCode: string
): string {
	if (regId === loginedUserCode) {
		return regName;
	}
	return `${regName.substring(0, 2)}******`;
}

export function getPageSize(reviewState: ReviewStateType | undefined): number {
	if (reviewState === ReviewStateType.REVIEW_ORIGIN_TYPE) {
		return 3;
	} else {
		return 9;
	}
}

export function createAddParams(
	score: number,
	usePurpose = '',
	content = '',
	series: Series,
	user: GetUserInfoResponse,
	customer?: GetCustomerInfoResponse
): AddReviewRequest {
	assertNotNull(user.userCode);
	assertNotNull(series.categoryName);
	assertNotNull(series.categoryCode);

	return {
		score,
		use_purpose: usePurpose,
		content,
		reg_id: user.userCode,
		reg_name: user.userName ?? '',
		reg_code: user.customerCode ?? '',
		reg_company: user.customerName ?? '',
		reg_tel: customer ? customer.tel : '',
		series_code: series.seriesCode,
		series_name: series.seriesName,
		category_code: series.categoryCode,
		category_name: series.categoryName,
		brand_code: series.brandCode,
		brand_name: series.brandName,
		contact_name: series.contact.contactName ?? '',
	};
}

export function createModifyParams(
	score: number,
	usePurpose = '',
	content = ''
): UpdateReviewRequest {
	return {
		use_purpose: usePurpose,
		content,
		score,
	};
}

export function createReportParams(
	reviewId: number,
	declareCode: string,
	content: string,
	user: GetUserInfoResponse,
	customer?: GetCustomerInfoResponse
): AddReviewReportRequest {
	assertNotNull(user.userCode);
	assertNotNull(user.userName);

	return {
		review_id: reviewId,
		reg_id: user.userCode,
		reg_name: user.userName,
		reg_code: user.customerCode ?? '',
		reg_company: user.customerName ?? '',
		reg_tel: customer?.tel ?? '',
		report_type: declareCode,
		report_content: content,
	};
}

export function createLikeParams(
	reviewId: number,
	user: GetUserInfoResponse,
	customer?: GetCustomerInfoResponse
) {
	assertNotNull(user.userCode);
	assertNotNull(user.userName);

	return {
		review_id: reviewId,
		reg_id: user.userCode,
		reg_name: user.userName,
		reg_code: user.customerCode ?? '',
		reg_company: user.customerName ?? '',
		reg_tel: customer?.tel ?? '',
	};
}

export const REVIEW_START_SIZE = 5;
export const REVIEW_USE_PURPOSE_MAX = 30;
export const REVIEW_CONTENT_MIN = 10;
export const REVIEW_CONTENT_MAX = 1000;
export const REVIEW_REPORT_MAX = 30;
export const REPORT_DIRECT_WRITE_CODE = '9';
