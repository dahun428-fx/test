import {
	CompareCookies,
	CompareCookiesItem,
} from '@/models/localStorage/CompareCookies';
import { assertNotNull } from '@/utils/assertions';

const STORAGE_KEY = 'compareCookies';

export const initalCompareCookies: CompareCookies = {
	items: [],
};

export function getCompareCookies(): CompareCookies {
	const compare = localStorage.getItem(STORAGE_KEY);
	if (!compare) {
		return initalCompareCookies;
	}
	const compareJson: CompareCookies =
		JSON.parse(compare) || initalCompareCookies;
	const now = Date.now();

	const compareItems = compareJson.items;

	const validItems = compareItems.filter(
		item => !item.expire || new Date(item.expire).getTime() > now
	);

	return {
		items: validItems,
	};
}

// export function getCompareCookiesCategoryList():string[] {
//     const compare = localStorage.getItem(STORAGE_KEY);
//     if (!compare) {
// 		return [];
// 	}
//     const compareJson: CompareCookies =
//     JSON.parse(compare) || initalCompareCookies;

//     const compareItems = compareJson.compareCookies;

//     const compareCategoryList = compareItems.map(item => item.categoryCode)
// }

export function addCompareItem(item: CompareCookiesItem) {
	const compare = getCompareCookies();

	const foundIndex = compare.items.findIndex(item => {
		if (
			item.categoryCode === item.categoryCode &&
			item.seriesCode === item.seriesCode &&
			item.partNumber === item.partNumber
		) {
			return item;
		}
	});
	if (foundIndex > 0) {
		return;
	}
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			items: [item, ...compare.items],
		})
	);
}

export function removeCompareCookieItem(deleteItem: CompareCookiesItem) {
	const compare = getCompareCookies();
	const foundIndex = compare.items.findIndex(item => {
		if (
			item.categoryCode === deleteItem.categoryCode &&
			item.seriesCode === deleteItem.seriesCode &&
			item.partNumber === deleteItem.partNumber
		) {
			return item;
		}
	});

	if (foundIndex < 0) {
		return;
	}

	const found = compare.items[foundIndex];
	assertNotNull(found);
	compare.items.splice(foundIndex, 1);
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			...compare,
		})
	);
}

export function removeCompareCookies(categoryCode: string) {
	const compare = getCompareCookies();

	const foundIndex = compare.items.findIndex(item => {
		if (item.categoryCode === item.categoryCode) {
			return item;
		}
	});

	if (foundIndex < 0) {
		return;
	}

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			items: compare.items.filter(item => item.categoryCode !== categoryCode),
		})
	);
}
