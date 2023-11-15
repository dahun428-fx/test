import { sendEcommerce } from './sendEcommerce';
import { ItemListName } from './types/ItemListName';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { ECommerce } from '@/logs/analytics/google/ecommerce/types/ECommerce';
import { getUserAttributes } from '@/logs/analytics/google/helpers';

export type SelectItemEvent = ECommerce<'select_item'>;

type SelectedSeries = {
	seriesCode: string;
	itemListName: ItemListName;
};

/**
 * Send event selected product item.
 * When click product link belongs to the list sent "view_item_list" log, call this function.
 */
export function selectItem(series: SelectedSeries) {
	EventManager.submit(() => {
		const { userCode, customerCode } = getUserAttributes();

		sendEcommerce<SelectItemEvent>({
			event: 'select_item',
			ucd: userCode ?? '',
			cust: customerCode ?? '',
			u_language: 'en',
			ecommerce: {
				items: [
					{
						item_id: series.seriesCode,
						item_list_name: series.itemListName,
					},
				],
			},
		});
	});
}
