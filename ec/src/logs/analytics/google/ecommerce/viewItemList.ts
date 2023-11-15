import { sendEcommerce } from './sendEcommerce';
import { ECommerce } from './types/ECommerce';
import { ItemListName } from './types/ItemListName';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getUserAttributes } from '@/logs/analytics/google/helpers';

type ViewItemListEvent = ECommerce<'view_item_list'>;

type ViewedSeries = {
	seriesCode: string;
	itemListName: ItemListName;
};

/**
 * Send event viewed product item list.
 *
 * Call this function with attention to the following.
 * - Viewed product detail page link list.
 * - Send at the time the list is rendered, not when it is displayed in the viewport.
 * - If all series in the list are the same, you only need to send one.
 */
export function viewItemList(seriesList: ViewedSeries[]) {
	EventManager.submit(() => {
		const { userCode, customerCode } = getUserAttributes();

		sendEcommerce<ViewItemListEvent>({
			event: 'view_item_list',
			ucd: userCode ?? '',
			cust: customerCode ?? '',
			u_language: 'en',
			ecommerce: {
				items: seriesList.map(series => ({
					item_id: series.seriesCode,
					item_list_name: series.itemListName,
				})),
			},
		});
	});
}
