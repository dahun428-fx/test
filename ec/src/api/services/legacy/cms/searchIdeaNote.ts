import { cmsApi } from '@/api/clients';
import { SearchIdeaNoteResponse } from '@/models/api/cms/SearchIdeaNoteResponse';
import { isObject } from '@/utils/object';

/**
 * キーワードによる inCAD Library 事例検索
 */
export async function searchIdeaNote(
	keyword: string
): Promise<SearchIdeaNoteResponse> {
	return cmsApi
		.get(
			`/asia/EcSearchPanelIdeanoteList.html?kw=${encodeURIComponent(
				keyword
			)}&format=json`
		)
		.then(response => {
			if (isSearchIdeaNoteResponse(response)) {
				return response;
			}
			return { searchCount: 0, searchBeanList: [] };
		});
}

function isSearchIdeaNoteResponse(
	response: unknown
): response is SearchIdeaNoteResponse {
	if (response && isObject<SearchIdeaNoteResponse>(response)) {
		if (
			response.searchCount == null ||
			Number.isNaN(Number(response.searchCount))
		) {
			return false;
		}

		if (!Array.isArray(response.searchBeanList)) {
			return false;
		}
		return true;
	}
	return false;
}
