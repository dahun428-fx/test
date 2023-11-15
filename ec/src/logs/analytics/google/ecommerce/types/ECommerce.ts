/* eslint-disable @typescript-eslint/ban-types */
import { ItemListName } from '@/logs/analytics/google/ecommerce/types/ItemListName';

export type ProductItem<T extends object = object> = {
	/** series code */
	item_id: string;
	item_list_name?: ItemListName;
} & T;

export type ECommerce<
	T extends string,
	E extends object = {},
	I extends object = {}
> =
	| ({
			/** event name */
			event: T;
			/** user code */
			ucd: string;
			/** customer code */
			cust: string;
			/** site language */
			u_language: string;

			ecommerce: {
				items: ProductItem<I>[];
			};
	  } & E)
	| {
			ecommerce: null;
	  };
