import Router from 'next/router';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { getOneParams } from '@/utils/query';

export function getItemListName() {
	const { list } = getOneParams(Router.query, 'list');

	// if (!isItemListName(list)) {
	// 	// eslint-disable-next-line no-console
	// 	console.error(`Incorrect list query param: ${list}`);
	// 	return ItemListName.PRODUCT_DETAIL;
	// }
	// WARN: Originally, I would like to type guard as above,
	//       but not because of the mix of current PHP applications.
	return list as ItemListName | undefined;
}

// function isItemListName(list: string): list is ItemListName {
// 	for (const prop of Object.values(ItemListName)) {
// 		if (prop === list) {
// 			return true;
// 		}
// 	}
// 	return false;
// }
