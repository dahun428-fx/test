import { ReviewApiResponse } from '@/models/api/review/ReviewApiResponse';

export interface SearchReviewResponse extends ReviewApiResponse {
	status?: ReviewResponseStatusType;
	data?: any[];
	message?: string;
}

export interface ReviewResponse {
	reviewConfig?: ReviewConfig;
	reviewData?: ReviewDetail[];
	reviewInfo?: ReviewInfo;
}

export interface ReviewConfig {
	maxReviewRecCnt: number;
	noticeScore: number;
	reviewState: ReviewStateType;
	blindApproveMode: number;
}

export interface ReviewInfo {
	seriesCode: string;
	seriesName: string;
	categoryCode: string;
	categoryName: string;
	brandCode: string;
	brandName: string;
	score: number;
	totalScore: number;
	recommendCnt?: number;
	reportCnt?: number;
	reviewCnt: number;
	maxReviewRecCnt?: number;
	noticeScore?: number;
	reviewState: ReviewStateType;
	blindApproveMode?: number;
}

export interface ReviewDetail {
	reviewId: number;
	score: number;
	usePurpose?: string;
	content?: string;
	regDate: string;
	regId: string;
	regCode: string;
	regTel?: string;
	regCompany?: string;
	seriesCode: string;
	seriesName: string;
	categoryCode: string;
	categoryName: string;
	brandCode: string;
	brandName: string;
	recommendCnt: number;
	reportCnt: number;
	noticeYn?: string | null;
	misumiComment?: string | null;
	memo?: string | null;
	procUserId?: string | null;
	procDate?: string | null;
	procContent?: string | null;
	procUserNm?: string | null;
	reviewState: ReviewStateType;
	deleteState: string; //"Y" | "N"
	deleteDate?: string | null;
	deleteUserId?: string | null;
	regName: string;
	imageCnt?: number;
	contactName?: string;
}

/**
 * 상품 리뷰 신고 사유 리스트
 * -example
 * 	code: "1",
 *  explain : "상품품질과 관련 없는 비방 내용",
 *  remark: "",
 *  seq : 1,
 *  sn : 1,
 *  useYn : "Y",
 */
export interface ReportDeclareDetail {
	code: string;
	explain: string;
	groupCode: string;
	remark: string;
	seq: number;
	sn: number;
	useYn: string;
}

/**
 * 정렬타입
 * default : 1
 * 1 => 평점높은순,
 * 2 => 평점낮은순,
 * 3 => 추천 많은 순,
 * 4 => 최신등록일 순,
 * 0 => 내글보기
 */
export const ReviewSortType = {
	ORDER_BY_RATE: 1,
	ORDER_BY_LOW_RATE: 2,
	ORDER_BY_RECOMMEND: 3,
	ORDER_BY_DATE: 4,
	MY_REVIEW: 0,
};
export type ReviewSortType = typeof ReviewSortType[keyof typeof ReviewSortType];

/**
 * 리뷰state타입
 * default : 2,
 * 1 => 생략 ( not show detail )
 * 2 => 전체 ( orign )
 * 0 => 사용하지않음
 */
export const ReviewStateType = {
	REVIEW_ORIGIN_TYPE: 2,
	REVIEW_SKIP_TYPE: 1,
	REVIEW_NOT_AVAILABLE: 0,
};

export type ReviewStateType =
	typeof ReviewStateType[keyof typeof ReviewStateType];

export const ReviewResponseStatusType = {
	REVIEW_STATUS_FAIL: 'fail',
	REVIEW_STATUS_SUCCESS: 'success',
};

export type ReviewResponseStatusType =
	typeof ReviewResponseStatusType[keyof typeof ReviewResponseStatusType];
