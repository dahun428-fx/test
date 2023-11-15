import { SeriesSortType } from '@/models/pages/category';

export function sendSelectSortType(sortType: string) {
	let convertedSortType;

	switch (sortType) {
		case SeriesSortType.PRICE:
			convertedSortType = 'Price (Low - High)';
			break;
		case SeriesSortType.DAYS_TO_SHIP:
			convertedSortType = 'Delivery Date (Low - High)';
			break;
		case SeriesSortType.POPULARITY:
		default:
			convertedSortType = 'default(pv)';
			break;
	}

	try {
		window.sc_f_products_list_sort?.(convertedSortType);
	} catch {
		// Do nothing
	}
}
