import { sendEcommerce } from './sendEcommerce';
import { ItemListName, AddToCartType } from './types';
import { ECommerce } from './types/ECommerce';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getItemListName } from '@/logs/analytics/google/ecommerce/helpers/getItemListName';
import { getUserAttributes } from '@/logs/analytics/google/helpers';

export type AddToCartEvent = ECommerce<
	'add_to_cart',
	{
		/** currency code */
		currency?: string;
		/** add to cart type */
		e_add_to_cart_type: string;
	},
	{
		/** inner code */
		item_variant: string;
		/** part number */
		item_name: string;
		/** quantity */
		quantity: number;
	}
>;

type AddedProduct = {
	seriesCode: string | undefined;
	innerCode?: string;
	partNumber: string;
	quantity: number;
	itemListName?: ItemListName;
};

type Payload = {
	type: AddToCartType;
	currencyCode?: string;
	products: AddedProduct[];
};

/**
 * Send event added product to cart.
 */
export function addToCart({ type, currencyCode, products }: Payload) {
	EventManager.submit(() => {
		const { userCode, customerCode } = getUserAttributes();
		const itemListName = getItemListName();

		sendEcommerce<AddToCartEvent>({
			event: 'add_to_cart',
			ucd: userCode ?? '',
			cust: customerCode ?? '',
			u_language: 'en',
			currency: currencyCode,
			e_add_to_cart_type: type,
			ecommerce: {
				items: products.map(product => ({
					item_id: product.seriesCode ?? '',
					item_list_name: product.itemListName ?? itemListName,
					item_variant: product.innerCode ?? '',
					item_name: product.partNumber,
					quantity: product.quantity,
				})),
			},
		});
	});
}
