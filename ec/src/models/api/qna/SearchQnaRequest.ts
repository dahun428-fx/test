import { QnaApiRequest } from '@/models/api/qna/QnaApiRequest';

export interface SearchQnaRequest extends QnaApiRequest {
	/**
	 * 시리즈코드
	 */
	series_code: string;
	/**
	 * 정렬타입
	 * default : 1
	 * 1 => 평점높은순,
	 * 2 => 평점낮은순,
	 * 3 => 추천 많은 순,
	 * 4 => 최신등록일 순,
	 * 0 => 내글보기
	 */
	order_type?: number;
	/**
	 * 페이지번호
	 * default : 1
	 */
	page_no?: number;
	/**
	 * 페이지 사이즈
	 * default : 3
	 */
	page_length?: number;
	/**
	 * userCode
	 * 로그인한 유저코드
	 */
	reg_id?: string;
}