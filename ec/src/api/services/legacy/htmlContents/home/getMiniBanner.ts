import { htmlContentsApi } from '@/api/clients';

/**
 * Get mini banner html
 * @returns {Promise<string>} html contents
 */
export function getMiniBanner(purchaseLink: boolean): Promise<string> {
	const path = purchaseLink
		? '/operation/top/include/bnr_mini_procurement.html'
		: '/operation/top/include/bnr_mini.html';
	return htmlContentsApi.get(path);
}
