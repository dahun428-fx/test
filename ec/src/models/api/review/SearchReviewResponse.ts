import { ReviewApiResponse } from '@/models/api/review/ReviewApiResponse';

export interface SearchReviewResponse extends ReviewApiResponse {
	status?: string;
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
	reviewState: number;
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
	reviewState: number;
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
	reviewState: number;
	deleteState: string; //"Y" | "N"
	deleteDate?: string | null;
	deleteUserId?: string | null;
	regName: string;
	imageCnt?: number;
	contactName?: string;
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
