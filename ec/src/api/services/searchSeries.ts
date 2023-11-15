import type { CancelToken } from 'axios';
import { ectApi } from '@/api/clients';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { SearchSeriesResponse } from '@/models/api/msm/ect/series/SearchSeriesResponse';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';

/**
 * シリーズ検索
 */
export function searchSeries(
	request: SearchSeriesRequest,
	cancelToken?: CancelToken,
	options?: {
		fields?: string[];
	}
): Promise<SearchSeriesResponse> {
	return ectApi.get(
		'/api/v1/series/search',
		// NOTE: ブランドモードは日本で廃止された機能であり、インドネシアでも廃止方向へ。
		//       ブランドモードは、キーワードにブランド名が含まれた場合に、ブランドに絞った検索が行われる機能のこと。
		{ ...request, brandModeFlag: '0' },
		{
			params: { field: options?.fields?.join() },
			cancelToken,
		}
	);
}

/**
 * Search series with `field=@detail`
 * @param request {SearchSeriesRequest} - parameters
 * @param [cancelToken] {CancelToken} - cancel token
 * @returns {Promise<SearchSeriesResponse$detail>} - search result
 */
export function searchSeries$detail(
	request: SearchSeriesRequest,
	cancelToken?: CancelToken
): Promise<SearchSeriesResponse$detail> {
	return searchSeries(request, cancelToken, { fields: ['@detail'] });
}

/**
 * Search series with `field=@search`
 * Get the following items in addition to the @search items.
 * - seriesList.templateType
 * - seriesList.seriesInfoText
 * @param request {SearchSeriesRequest} - parameters
 * @param [cancelToken] {CancelToken} - cancel token
 * @returns {Promise<SearchSeriesResponse$search>} - search result
 */
export function searchSeries$search(
	request: SearchSeriesRequest,
	cancelToken?: CancelToken
): Promise<SearchSeriesResponse$search> {
	return ectApi.get(
		'/api/v1/series/search',
		// NOTE: ブランドモードは日本で廃止された機能であり、インドネシアでも廃止方向へ。
		//       ブランドモードは、キーワードにブランド名が含まれた場合に、ブランドに絞った検索が行われる機能のこと。
		{ ...request, brandModeFlag: '0' },
		{
			params: {
				field: [
					'@search',
					'seriesList.templateType',
					'seriesList.seriesInfoText',
				].join(),
			},
			cancelToken,
		}
	);
}
