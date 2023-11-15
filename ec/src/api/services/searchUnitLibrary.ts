import { ectApi } from '@/api/clients';
import { SearchUnitLibraryRequest } from '@/models/api/msm/ect/unitLibrary/SearchUnitLibraryRequest';
import { SearchUnitLibraryResponse } from '@/models/api/msm/ect/unitLibrary/SearchUnitLibraryResponse';

/**
 * Search unit library. (inCAD library)
 * @param {SearchUnitLibraryRequest} request - request parameters
 * @returns {Promise<SearchUnitLibraryResponse>} response
 */
export function searchUnitLibrary(
	request: SearchUnitLibraryRequest
): Promise<SearchUnitLibraryResponse> {
	return ectApi.get('/api/v1/unitLibrary/search', request);
}
