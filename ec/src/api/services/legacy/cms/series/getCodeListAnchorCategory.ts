import { cmsApi } from '@/api/clients';
import { CodeListAnchorCategoryResponse } from '@/models/api/cms/series/CodeListAnchorCategoryResponse';
import { temp_category_data } from './temp_category_data';
// /**
//  * Get code list anchor category data
//  * @returns {Promise<CodeListAnchorCategoryResponse} response
//  */
// export async function getCodeListAnchorCategory(): Promise<CodeListAnchorCategoryResponse> {
// 	return cmsApi.get('/operation/detail/codelist_anchor/category_data.json');
// }
/**
 * Get code list anchor category data
 * @returns {Promise<CodeListAnchorCategoryResponse} response
 */
export async function getCodeListAnchorCategory(): Promise<CodeListAnchorCategoryResponse> {
	return temp_category_data;
}
