export const AddToCartType = {
	PRODUCT_DETAIL: 'detail',
	NO_LISTED_IN_CATALOG: 'nonecatalog',
} as const;

export type AddToCartType = typeof AddToCartType[keyof typeof AddToCartType];
