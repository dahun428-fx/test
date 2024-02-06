import { Compare, CompareItem } from '@/models/localStorage/Compare';
import { assertNotNull } from '@/utils/assertions';
import { EitherRequired } from '@/utils/type';

const STORAGE_KEY = 'compare';
const COMPARE_HEAD_MAX_LENGTH = 3;
const COMPARE_CONTENT_MAX_LENGTH = 5;

export const initalCompare: Compare = {
	items: [],
	show: false,
};

export function updateCompareItem(updateItem: CompareItem) {
	const compare = getCompare();

	const foundIndex = compare.items.findIndex(
		item =>
			item.seriesCode === updateItem.seriesCode &&
			item.partNumber === updateItem.partNumber
	);
	if (foundIndex < 0) return;

	const found = compare.items[foundIndex];
	assertNotNull(found);
	compare.items[foundIndex] = { ...found, ...updateItem };

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			...compare,
		})
	);
}

export function updateCheckedItemIfNeeded(selectedItems: CompareItem[]) {
	const compare = localStorage.getItem(STORAGE_KEY);

	if (!compare) {
		return;
	}
	let compareJson: Compare = JSON.parse(compare) || initalCompare;

	const chkeckedItems = compareJson.items.map(item => {
		const foundIndex = selectedItems.findIndex(selectItem => {
			if (
				item.seriesCode === selectItem.seriesCode &&
				item.partNumber === selectItem.partNumber
			) {
				return item;
			}
		});
		if (foundIndex === -1) {
			return { ...item, chk: false };
		} else {
			return { ...item, chk: true };
		}
	});
	compareJson = {
		...compareJson,
		items: chkeckedItems,
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(compareJson));
}

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
		active: validItems.length > 0 ? compareJson.active : '',
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

	const hasSameHead = compare.items.some(
		item => item.categoryCode === addItem.categoryCode
	);
	const headLength = compare.items
		.map(item => item.categoryCode)
		.reduce<string[]>(
			(previous, current) =>
				previous.includes(current) ? previous : [current, ...previous],
			[]
		).length;

	const contentLength = compare.items.filter(
		item => item.categoryCode === addItem.categoryCode
	).length;

	if (
		(headLength >= COMPARE_HEAD_MAX_LENGTH && !hasSameHead) ||
		contentLength >= COMPARE_CONTENT_MAX_LENGTH
	) {
		return;
	}

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			items: [...compare.items, addItem],
			show: true,
			active: addItem.categoryCode,
		})
	);
}

export function removeCompareItem(seriesCode: string, partNumber: string) {
	const compare = getCompare();
	const foundIndex = compare.items.findIndex(item => {
		if (item.seriesCode === seriesCode && item.partNumber === partNumber) {
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
