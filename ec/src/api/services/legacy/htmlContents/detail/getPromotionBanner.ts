import { htmlContentsApi } from '@/api/clients';

/**
 * Get promotion banner
 * @param {string} code
 * @param {boolean} isBnrB
 * @returns {Promise<string>} html contents
 */
export function getPromotionBanner(
	code: string,
	isBnrB?: boolean
): Promise<string> {
	const htmlName = isBnrB ? `bnrB.html` : `bnr.html`;
	return htmlContentsApi.get(`/operation/detail/include/${code}/${htmlName}`);
}
