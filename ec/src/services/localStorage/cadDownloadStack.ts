import {
	CadDownloadStack,
	CadDownloadStackItem,
	CadDownloadStatus,
} from '@/models/localStorage/CadDownloadStack';
import { assertNotNull } from '@/utils/assertions';
import { EitherRequired } from '@/utils/type';

const STORAGE_KEY = 'stack';

export const initialStack: CadDownloadStack = {
	items: [],
	len: 0,
	done: 0,
	show: false,
	shouldConfirm: false,
	tabDone: false,
};

/**
 * Remove item expiry in local storage if needed
 *
 * - ---*** new NOTE!! ***---
 * - get json data from local-storage "stack" and parse as "stackJson"
 * - filters stackJson to (done and non-expired) or not-error as "validItems"
 * - set local-storage "stack"
 * - ---*** new NOTE!! ***---
 * @returns {void}
 */
export function removeExpiryItemIfNeeded(): void {
	const stack = localStorage.getItem(STORAGE_KEY);

	if (!stack) {
		return;
	}

	// FIXME: stackJson is parsed (not JSON)
	let stackJson: CadDownloadStack = JSON.parse(stack) || initialStack;
	const now = new Date().getTime();
	const validItems = stackJson.items.filter(item => {
		return (
			(item.status === CadDownloadStatus.Done &&
				(!item.expiry || item.expiry > now)) ||
			item.status !== CadDownloadStatus.Error
		);
	});

	stackJson = {
		...stackJson,
		items: validItems,
		len: validItems.length,
		done: validItems.filter(item => item.status === CadDownloadStatus.Done)
			.length,
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(stackJson));
}
/**
 * Remove item expiry in local storage if needed
 *
 * - ---*** new NOTE!! ***---
 * - get json data from local-storage "stack" and parse as "stackJson"
 * - filters stackJson to non-expired as "validItems"
 * - set local-storage "stack"
 * - ---*** new NOTE!! ***---
 * @returns {void}
 */
export function removeExpiryItemOnlyIfNeeded(): void {
	const stack = localStorage.getItem(STORAGE_KEY);

	if (!stack) {
		return;
	}

	// FIXME: stackJson is parsed (not JSON)
	let stackJson: CadDownloadStack = JSON.parse(stack) || initialStack;
	const now = new Date().getTime();
	const validItems = stackJson.items.filter(item => {
		return !item.expiry || item.expiry > now;
	});

	stackJson = {
		...stackJson,
		items: validItems,
		len: validItems.length,
		done: validItems.filter(item => item.status === CadDownloadStatus.Done)
			.length,
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(stackJson));
}

/**
 * Remove item pending in local storage if needed
 * @returns {void}
 */
export function removePendingItemIfNeeded(): void {
	const stack = localStorage.getItem(STORAGE_KEY);

	if (!stack) {
		return;
	}

	let stackJson: CadDownloadStack = JSON.parse(stack) || initialStack;
	const validItems = stackJson.items.filter(item => {
		return item.status !== CadDownloadStatus.Pending;
	});
	stackJson = {
		...stackJson,
		items: validItems,
		len: validItems.length,
		done: validItems.filter(item => item.status === CadDownloadStatus.Done)
			.length,
	};

	localStorage.setItem(STORAGE_KEY, JSON.stringify(stackJson));
}

/**
 * Get CAD download stack.
 * - get json data from local-storage "stack" and parse as "stackItems"
 * - if each item's status is timeout then rewrite to "pending"
 * - no-error-item (status-not-error from stackItems) check
 * - valid-item (non-expired from no-error-item) as "items" and its count as "len"
 * - done-item (done from valid-item) count as "done"
 * - set "show" from stackItems
 * - set "shouldConfirm" from stackItems
 * - return conditioned "stack"
 */
export function getCadDownloadStack(): CadDownloadStack {
	const stack = localStorage.getItem(STORAGE_KEY);
	if (!stack) {
		return initialStack;
	}

	const stackJson: CadDownloadStack = JSON.parse(stack) || initialStack;
	const now = Date.now();

	const stackItems = stackJson.items.map(item => {
		if (item.status === CadDownloadStatus.Timeout) {
			return { ...item, status: CadDownloadStatus.Pending };
		}
		return item;
	});

	// const noErrorItems = stackItems.filter(
	// 	item => item.status !== CadDownloadStatus.Error
	// );

	const validItems = stackItems.filter(
		item => !item.expiry || item.expiry > now
	);

	const doneItems = validItems.filter(
		item => item.status === CadDownloadStatus.Done
	);

	return {
		len: validItems.length,
		done: doneItems.length,
		show: stackJson.show,
		shouldConfirm: stackJson.shouldConfirm,
		items: validItems,
		tabDone: stackJson.tabDone,
	};
}

/**
 * Get stack item.
 * @param id
 */
export function getStackItem(id: string): CadDownloadStackItem | null {
	const stack = localStorage.getItem(STORAGE_KEY);
	if (!stack) {
		return null;
	}

	try {
		const stackObj: CadDownloadStack = JSON.parse(stack);
		return stackObj.items.find(item => item.id === id) ?? null;
	} catch {
		return null;
	}
}

/**
 * Update CAD download stack item.
 * - non-expired and timeout rewriting stack
 * - found update target item
 * - rewrite founded item with argument parameter
 * - set local-storage "stack"
 */
export function updateCadDownloadStackItem(
	updateItem: EitherRequired<CadDownloadStackItem, 'id'>
) {
	const stack = getCadDownloadStack();
	const foundIndex = stack.items.findIndex(item => item.id === updateItem.id);
	if (foundIndex < 0) {
		return;
	}
	const found = stack.items[foundIndex];
	assertNotNull(found); // 直上で存在チェックしているためエラーになることはない
	stack.items[foundIndex] = { ...found, ...updateItem };

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			...stack,
			done: stack.items.filter(item => item.status === CadDownloadStatus.Done)
				.length,
		})
	);
}

export function removeCadDownloadStackItem(
	deleteItem: EitherRequired<CadDownloadStackItem, 'id'>
) {
	const stack = getCadDownloadStack();

	const foundIndex = stack.items.findIndex(item => item.id === deleteItem.id);
	if (foundIndex < 0) {
		return;
	}
	const found = stack.items[foundIndex];
	assertNotNull(found);
	stack.items.splice(foundIndex, 1);

	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			...stack,
			done: stack.items.filter(item => item.status === CadDownloadStatus.Done)
				.length,
			len: stack.len - 1,
		})
	);
}

/**
 * Initialize CAD download stack.
 */
export function initializeCadDownloadStack() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStack));
}

/**
 * Update stack.
 */
export function updateCadDownloadStack(
	updateStack: Partial<Omit<CadDownloadStack, 'items'>>
) {
	const stack = getCadDownloadStack();
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({ ...stack, ...updateStack })
	);
}

/**
 * Adding Cad download stack item
 */
export function addCadDownloadStackItem(item: CadDownloadStackItem) {
	const stack = getCadDownloadStack();
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			...stack,
			items: [item, ...stack.items],
			len: stack.len + 1,
			show: true,
		})
	);
}
