import { toUrl } from './url';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { RecommendItem } from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendResponse';
import { notEmpty } from '@/utils/predicate';

/**
 * cameleer api が返却するかもしれない domain 付 link url から
 * domain を trim する
 * @param url
 * @returns
 */
export function trimUrlDomain(url?: string): string {
	if (!url) {
		return '';
	}

	const index = url.indexOf('/vona2');

	if (index < 0) {
		return url;
	}

	return url.substring(index);
}

/**
 * Assign list parameter to cameleer URLs, trim domain and return its path
 * @param url
 * @param listValue
 * @returns
 */
export function assignListParam(url = '', listValue: ItemListName): string {
	return trimUrlDomain(toUrl(url, { list: listValue }, { addProtocol: true }));
}

export function hasLinkUrl(
	item: RecommendItem
): item is RecommendItem & { linkUrl: string } {
	return notEmpty(item.linkUrl);
}
