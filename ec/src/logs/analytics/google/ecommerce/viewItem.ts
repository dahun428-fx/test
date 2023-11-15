import { getItemListName } from './helpers/getItemListName';
import { sendEcommerce } from './sendEcommerce';
import { ECommerce } from './types/ECommerce';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getUserAttributes } from '@/logs/analytics/google/helpers';

type ViewItemEvent = ECommerce<
	'view_item',
	{
		currency?: string;
	},
	{
		/** inner code */
		item_variant?: string;
		/** part number */
		item_name?: string;
	}
>;

type ViewedProduct = {
	seriesCode: string;
	innerCode?: string;
	partNumber?: string;
	currencyCode: string | undefined;
};

/**
 * Send event viewed product item page.
 */
export function viewItem(product: ViewedProduct) {
	EventManager.submit(() => {
		const { userCode, customerCode } = getUserAttributes();

		sendEcommerce<ViewItemEvent>({
			event: 'view_item',
			ucd: userCode ?? '',
			cust: customerCode ?? '',
			u_language: 'en',
			currency: product.currencyCode,
			ecommerce: {
				items: [
					{
						item_id: product.seriesCode,
						item_list_name: getItemListName(),
						item_variant: product.innerCode,
						item_name: product.partNumber,
					},
				],
			},
		});
	});
}
