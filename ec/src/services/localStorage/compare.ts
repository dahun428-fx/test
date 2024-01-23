import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { assertNotNull } from '@/utils/assertions';

const STORAGE_KEY = 'compareCookies';

export const initalCompare: Compare = {
	items: [],
	show: false,
};

export function updateCompare(updateCompare: Partial<Omit<Compare, 'items'>>) {
	const compare = getCompare();
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({ ...compare, ...updateCompare })
	);
}

export function getCompare(): Compare {
	const compare = localStorage.getItem(STORAGE_KEY);
	if (!compare) {
		return initalCompare;
	}
	const compareJson: Compare = JSON.parse(compare) || initalCompare;
	const now = Date.now();

	const compareItems = compareJson.items;
	const validItems = compareItems.filter(
		item => !item.expire || new Date(item.expire).getTime() >= now
	);
	return {
		items: validItems,
		show: compareJson.show,
		active: compareJson.active,
	};
}

export function addCompareItem(addItem: CompareItem) {
	const compare = getCompare();
	const foundIndex = compare.items.findIndex(item => {
		if (
			item.seriesCode === addItem.seriesCode &&
			item.partNumber === addItem.partNumber
		) {
			return item;
		}
	});

	if (foundIndex !== -1) {
		return;
	}
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			items: [addItem, ...compare.items],
			show: true,
			active: addItem.categoryCode,
		})
	);
}

export function removeCompareItem(deleteItem: CompareItem) {
	const compare = getCompare();
	const foundIndex = compare.items.findIndex(item => {
		if (
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
			active: '',
		})
	);
}

export function removeCompare(categoryCode: string) {
	const compare = getCompare();

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
			...compare,
			items: compare.items.filter(item => item.categoryCode !== categoryCode),
			active: '',
		})
	);
}
