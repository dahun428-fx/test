import { ApiResponse } from '@/models/api/ApiResponse';

/**
 * Code list anchor category response
 */
export interface CodeListAnchorCategoryResponse extends ApiResponse {
	categoryCode?: string[];
}
