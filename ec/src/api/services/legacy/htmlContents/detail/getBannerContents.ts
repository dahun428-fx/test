import { htmlContentsApi } from '@/api/clients';

/**
 * Get banner content
 * @param {string} bannerPath
 * @returns {Promise<string>} html contents
 */
export function getBannerContent(bannerPath: string): Promise<string> {
	return htmlContentsApi.get(`/common/include/bnr${bannerPath}`);
}
