import { cmsApi } from '@/api/clients';
import { CodeListAnchorCategoryResponse } from '@/models/api/cms/series/CodeListAnchorCategoryResponse';

/**
 * Get code list anchor category data
 * @returns {Promise<CodeListAnchorCategoryResponse} response
 */
export async function getCodeListAnchorCategory(): Promise<CodeListAnchorCategoryResponse> {
	return cmsApi.get('/operation/detail/codelist_anchor/category_data.json');
}
