import { GetCustomerInfoResponse } from '@/models/api/msm/ect/customerInfo/GetCustomerInfoResponse';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { assertNotNull } from '../assertions';
import { UpdateQnaRequest } from '@/models/api/qna/UpdateQnaRequest';
import { AddQnaReportRequest } from '@/models/api/qna/AddQnaReportRequest';

/** isAvailable qnaState */
export function isAvailaleQnaState(qnaConfig: any | undefined): boolean {
	if (!qnaConfig || !!!qnaConfig.qnaState) {
		return false;
	}
	if (qnaConfig.qnaState > 0) {
		return true;
	}
	return false;
}

export function getPageSize(qnaState: number | undefined): number {
	const defaultPageSize = 3;
	return defaultPageSize;
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

export function createAddParams(
	question: string,
	partNo: string,
	series: Series,
	user: GetUserInfoResponse,
	customer?: GetCustomerInfoResponse
) {
	assertNotNull(user.userCode);
	assertNotNull(series.categoryName);
	assertNotNull(series.categoryCode);

	return {
		usePurpose: '',
		content: question,
		part_no: partNo,
		reg_id: user.userCode,
		reg_name: user.userName ?? '',
		reg_code: user.customerCode ?? '',
		reg_company: user.customerName ?? '',
		reg_tel: customer?.tel ?? '',
		reg_email: customer?.customerEmail ?? '',
		series_code: series.seriesCode,
		series_name: series.seriesName,
		category_code: series.categoryCode,
		category_name: series.categoryName,
		brand_code: series.brandCode,
		brand_name: series.brandName,
		contact_name: 'TS팀',
	};
}

export function createModifyParams(
	partNo: string,
	content: string
): UpdateQnaRequest {
	return {
		part_no: partNo,
		content,
	};
}

export function createReportParams(
	qnaId: number,
	declareCode: string,
	content: string,
	user: GetUserInfoResponse,
	customer?: GetCustomerInfoResponse
): AddQnaReportRequest {
	assertNotNull(user.userCode);
	assertNotNull(user.userName);

	return {
		qna_id: qnaId,
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
	qnaId: number,
	user: GetUserInfoResponse,
	customer?: GetCustomerInfoResponse
) {
	assertNotNull(user.userCode);
	assertNotNull(user.userName);

	return {
		qna_id: qnaId,
		reg_id: user.userCode,
		reg_name: user.userName,
		reg_code: user.customerCode ?? '',
		reg_company: user.customerName ?? '',
		reg_tel: customer?.tel ?? '',
	};
}

export const QNA_USE_PURPOSE_MAX = 30;
export const QNA_PART_NO_MAX = 100;
export const QNA_QUESTION_MIN = 10;
export const QNA_QUESTION_MAX = 1000;
export const QNA_REPORT_MAX = 30;
export const QNA_REPORT_DIRECT_WRITE_CODE = '9';
