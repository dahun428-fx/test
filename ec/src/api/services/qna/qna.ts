import { qnaApi } from '@/api/clients/qnaApi';
import { AddQnaLikeRequest } from '@/models/api/qna/AddQnaLikeRequest';
import { AddQnaLikeResponse } from '@/models/api/qna/AddQnaLikeResponse';
import { AddQnaReportResponse } from '@/models/api/qna/AddQnaReportResponse';
import { AddQnaRequest } from '@/models/api/qna/AddQnaRequest';
import { AddQnaResponse } from '@/models/api/qna/AddQnaResponse';
import { DeleteQnaRequest } from '@/models/api/qna/DeleteQnaRequest';
import { DeleteQnaResponse } from '@/models/api/qna/DeleteQnaResponse';
import { SearchQnaCountRequest } from '@/models/api/qna/SearchQnaCountRequest';
import { SearchQnaRequest } from '@/models/api/qna/SearchQnaRequest';
import { SearchQnaResponse } from '@/models/api/qna/SearchQnaResponse';
import { UpdateQnaRequest } from '@/models/api/qna/UpdateQnaRequest';
import { UpdateQnaResponse } from '@/models/api/qna/UpdateQnaResponse';
import { CancelToken } from 'axios';

const constants = {
	API_URL: 'https://qna-kr.misumi-ec.com/api',
	API_PATH: '/ec-qna',
	API_PATH_DATA: '/ec-qna-data',
	API_PATH_INFO: '/ec-qna-info',
	API_PATH_RECOMMEND: '/ec-qna-recommend',
	API_PATH_REPORT: '/ec-qna-report',
	API_PATH_COUNT: '/ec-qna-count',
	API_PATH_RT: '/ec-code',
	API_CONFIG: '/ec-config-data',
	API_PATH_DEL: '/ec-qna-del',
	API_PATH_HELPGUBUN: '/ec-qna-helpgubun',
};

/**
 * find qna list data ( data[0] -> qnaDetail[] )
 * @param request SearchQnaRequest
 * @param cancelToken
 * @returns SearchQnaResponse
 */
export function searchProductQnas(
	request: SearchQnaRequest,
	cancelToken?: CancelToken
): Promise<SearchQnaResponse> {
	return qnaApi.post(`/api/ec-qna-data`, request, { cancelToken });
}

/**
 * find qna configuration ( data[0] -> qnaConfig )
 * @param cancelToken CancelToken
 * @returns SearchQnaResponse
 */
export function searchQnaConfig(
	cancelToken?: CancelToken
): Promise<SearchQnaResponse> {
	return qnaApi.get(`/api/ec-config-data`, {}, { cancelToken });
}

/**
 * find qna info by seriesCode ( data[0] -> qnaInfo )
 * @param seriesCode Series.seriesCode
 * @param regId userCode
 * @param cancelToken CancelToken
 * @returns SearchQnaResponse
 */
export function searchQnaInfo(
	seriesCode: string,
	regId = '',
	cancelToken?: CancelToken
): Promise<SearchQnaResponse> {
	return qnaApi.post(
		`/api/ec-qna-info`,
		{ series_code: seriesCode, reg_id: regId },
		{ cancelToken }
	);
}

/**
 * find qna detail by qnaid ( data[0] -> qnaDetail )
 * @param qnaId qnaId
 * @param cancelToken CancelToken
 * @returns
 */
export function searchQnaDetail(
	qnaId: number,
	cancelToken?: CancelToken
): Promise<SearchQnaResponse> {
	return qnaApi.get(`/api/ec-qna/${qnaId}`, {}, { cancelToken });
}

/**
 * insert Qna
 * @param request AddQnaRequest
 * @param cancelToken CancelToken
 * @returns AddQnaResponse
 */
export function addQna(
	request: AddQnaRequest,
	cancelToken?: CancelToken
): Promise<AddQnaResponse> {
	return qnaApi.post(`/api/ec-qna`, request, { cancelToken });
}

/**
 * Update Qna
 * @param qnaId qnaId
 * @param request UpdateQnaRequest
 * @param cancelToken CancelToken
 * @returns UpdateQnaResponse
 */
export function modifyQna(
	qnaId: number,
	request: UpdateQnaRequest,
	cancelToken?: CancelToken
): Promise<UpdateQnaResponse> {
	return qnaApi.put(`/api/ec-qna/${qnaId}`, request, { cancelToken });
}

/**
 * Delete Qna
 * @param request DeleteQnaRequest
 * @param cancelToken CancelToken
 * @returns DeleteQnaResponse
 */
export function removeQna(
	request: DeleteQnaRequest,
	cancelToken?: CancelToken
): Promise<DeleteQnaResponse> {
	return qnaApi.post(`/api/ec-qna-del`, request, { cancelToken });
}

/**
 * Add QnaLike
 * @param request AddQnaLikeRequest
 * @param cancelToken CancelToken
 * @returns AddQnaLikeResponse
 */
export function addQnaLike(
	request: AddQnaLikeRequest,
	cancelToken?: CancelToken
): Promise<AddQnaLikeResponse> {
	return qnaApi.post(`/api/ec-qna-report`, request, { cancelToken });
}

/**
 * search My Qna Count
 * @param request SearchQnaCountRequest
 * @param cancelToken CancelToken
 * @returns SearchQnaResponse
 */
export function searchMyQnaCount(
	request: SearchQnaCountRequest,
	cancelToken?: CancelToken
): Promise<SearchQnaResponse> {
	return qnaApi.post(`/api/ec-qna-count`, request, { cancelToken });
}

/**
 * Add QnaReport
 * @param request AddQnaReportRequest
 * @param cancelToken CancelToken
 * @returns AddQnaReportResponse
 */
export function addQnaReport(
	request: AddQnaRequest,
	cancelToken?: CancelToken
): Promise<AddQnaReportResponse> {
	return qnaApi.post(`/api/ec-qna-report`, request, { cancelToken });
}
