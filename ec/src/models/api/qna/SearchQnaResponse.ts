import { QnaApiResponse } from './QnaApiResponse';

export interface SearchQnaResponse extends QnaApiResponse {
	status?: number;
	data?: any[];
	message?: string;
}

export interface QnaResponse {
	qnaConfig?: QnaConfig;
	qnaData?: QnaDetail[];
	qnaInfo?: QnaInfo;
}

export interface QnaConfig {
	maxQnaRecCnt: number;
	qnaState: QnaStateType;
	blindApproveMode: number;
}

export interface QnaInfo {
	seriesCode: string;
	seriesName: string;
	categoryCode: string;
	categoryName: string;
	brandCode: string;
	brandName: string;
	reportCnt: number;
	qnaCnt: number;
	score?: number;
	totalScore?: number;
	recommendCnt: number;
	maxQnaRecCnt: number;
	qnaState: QnaStateType;
	blindApproveMode: number;
}

export interface QnaDetail {
	qnaId: number;
	usePurpose: string;
	content: string;
	regDate: string;
	regId: string;
	regCode: string;
	regTel: string;
	regCompany: string;
	regName: string;
	partNo: string;
	seriesCode: string;
	seriesName: string;
	categoryCode: string;
	categoryName: string;
	brandCode: string;
	brandName: string;
	misumiComment?: string;
	misumiCommentDate?: string | null;
	misumiCommentFlag: QnaFlag;
	contactName: string;
	qnaState?: number; //공개 : 1, 보류 : 2, 비공개: 3, 삭제 : 11
	recommendCnt: number;
	reportCnt: number;
	procDate?: string | null;
	userBlindFlag: QnaFlag;
}

export const QnaFlag = {
	TRUE: 'Y',
	FALSE: 'N',
};

export type QnaFlag = typeof QnaFlag[keyof typeof QnaFlag];

export const QnaResponseStatusType = {
	QNA_STATUS_FAIL: 'fail',
	QNA_STATUS_SUCCESS: 'success',
};

export type QnaResponseStatusType =
	typeof QnaResponseStatusType[keyof typeof QnaResponseStatusType];

/**
 * Qna state type
 * default : 1,
 * 0 => Not use
 * 1 => available
 */
export const QnaStateType = {
	QNA_ORIGIN_TYPE: 1,
	QNA_NOT_AVAILABLE: 0,
};

export type QnaStateType = typeof QnaStateType[keyof typeof QnaStateType];


/**
 * 상품 문의 신고 사유 리스트
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
 * Sort Type
 * default : 1,
 * 1 => show all qna
 * 0 => My Qna show
 */
export const QnaSortType = {
	ORDER_BY_DEFAULT: 1,
	MY_QNA: 0,
};

export type QnaSortType = typeof QnaSortType[keyof typeof QnaSortType];
