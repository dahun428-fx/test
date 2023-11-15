import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchCategoryRequest } from '@/models/api/msm/ect/category/SearchCategoryRequest';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';

/**
 * Search categories.
 * @param {SearchCategoryRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchCategoryResponse>} search result
 */
export function searchCategory(
	request: SearchCategoryRequest = {},
	cancelToken?: CancelToken
): Promise<SearchCategoryResponse> {
	return ectApi.get(
		'/api/v1/category/search',
		// NOTE: ブランドモードは日本で廃止された機能であり、インドネシアでも廃止方向へ。
		//       ブランドモードは、キーワードにブランド名が含まれた場合に、ブランドに絞ったカテゴリ検索が行われる機能のこと。
		//       上記機能により、検索したいカテゴリが表示されないなどの不都合がある。
		{ ...request, brandModeFlag: '0' },
		{ cancelToken }
	);
}

type ErrorResponse = {
	status: number;
	errorList: [
		{
			errorCode: string;
			errorMessage: string;
			/**
			 * Example: [["fs_processing", "T0600000000"]]
			 */
			errorParameterList: [string[]];
		}
	];
};

/**
 * Search categories (including status code).
 * @param {SearchCategoryRequest} request - request parameters
 * @param {CancelToken} [cancelToken] - request cancel token
 * @returns {Promise<SearchCategoryResponse | ErrorResponse>} search result
 */
export function searchCategory$suppressResponseCode(
	request: SearchCategoryRequest,
	cancelToken?: CancelToken
): Promise<SearchCategoryResponse | ErrorResponse> {
	return ectApi.get(
		'/api/v1/category/search',
		// NOTE: ブランドモードは日本で廃止された機能であり、インドネシアでも廃止方向へ。
		//       ブランドモードは、キーワードにブランド名が含まれた場合に、ブランドに絞ったカテゴリ検索が行われる機能のこと。
		//       上記機能により、検索したいカテゴリが表示されないなどの不都合がある。
		{ ...request, brandModeFlag: '0', suppressResponseCode: true },
		{ cancelToken }
	);
}

export function isErrorResponse(
	response: SearchCategoryResponse | ErrorResponse
): response is ErrorResponse {
	return 'errorList' in response;
}
