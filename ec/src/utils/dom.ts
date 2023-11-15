// WARNING: Before using this util, please first consider whether it is possible to implement it in ref.

import { RefObject } from 'react';
import { isObject } from '@/utils/object';

export function getRect(selector: string): DOMRect | undefined;
export function getRect(element: HTMLElement): DOMRect;
export function getRect<T extends HTMLElement>(
	elementRef: RefObject<T>
): DOMRect | undefined;
export function getRect(
	selectorOrElOrRef: string | HTMLElement | RefObject<HTMLElement>
) {
	if (typeof selectorOrElOrRef === 'string') {
		// selector
		return document.querySelector(selectorOrElOrRef)?.getBoundingClientRect();
	} else if (isObject(selectorOrElOrRef) && 'current' in selectorOrElOrRef) {
		// ref
		return selectorOrElOrRef.current?.getBoundingClientRect();
	}
	// element
	return selectorOrElOrRef.getBoundingClientRect();
}

export function getHeight(selector: string): number | undefined;
export function getHeight(element: HTMLElement): number;
export function getHeight<T extends HTMLElement>(
	elementRef: RefObject<T>
): number | undefined;
export function getHeight(
	selectorOrElOrRef: string | HTMLElement | RefObject<HTMLElement>
) {
	if (typeof selectorOrElOrRef === 'string') {
		return getRect(selectorOrElOrRef)?.height;
	} else if (isObject(selectorOrElOrRef) && 'current' in selectorOrElOrRef) {
		return getRect(selectorOrElOrRef)?.height;
	}
	return getRect(selectorOrElOrRef).height;
}

export function getWidth(selector: string): number | undefined;
export function getWidth(element: HTMLElement): number;
export function getWidth<T extends HTMLElement>(
	elementRef: RefObject<T>
): number | undefined;
export function getWidth(
	selectorOrElOrRef: string | HTMLElement | RefObject<HTMLElement>
) {
	if (typeof selectorOrElOrRef === 'string') {
		return getRect(selectorOrElOrRef)?.width;
	} else if (isObject(selectorOrElOrRef) && 'current' in selectorOrElOrRef) {
		return getRect(selectorOrElOrRef)?.width;
	}
	return getRect(selectorOrElOrRef).width;
}

export function getTop(selector: string): number | undefined;
export function getTop(element: HTMLElement): number;
export function getTop<T extends HTMLElement>(
	elementRef: RefObject<T>
): number | undefined;
export function getTop(
	selectorOrElOrRef: string | HTMLElement | RefObject<HTMLElement>
) {
	if (typeof selectorOrElOrRef === 'string') {
		return getRect(selectorOrElOrRef)?.top;
	} else if (isObject(selectorOrElOrRef) && 'current' in selectorOrElOrRef) {
		return getRect(selectorOrElOrRef)?.top;
	}
	return getRect(selectorOrElOrRef).top;
}

export function getChildren(element: HTMLElement): HTMLElement[] {
	return Array.from(element.children) as HTMLElement[];
}

export function getDocumentWidth() {
	return document.documentElement.clientWidth;
}

export function getDocumentHeight() {
	return document.documentElement.clientHeight;
}

/** Get height without padding */
export function getHeightWithoutPadding(element: Element) {
	const computed = getComputedStyle(element);
	const totalPadding =
		parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

	return element.clientHeight - totalPadding;
}

/** Calculates the width of the vertical scrollbar in the browser. */
export function getVerticalScrollbarWidth() {
	// Check if the viewport width is smaller than the document width, indicating the presence of a vertical scrollbar
	const hasVerticalScrollbar =
		window.innerWidth > document.documentElement.clientWidth;

	// If there is a vertical scrollbar, calculate its width
	if (hasVerticalScrollbar) {
		const outer = document.createElement('div');
		// NOTE: this trick create an element outside of the screen and activate scrollbar on that element
		// by using `overflow: scroll;` in order to calculate the scrollbar's width
		// The value 100px can be anything greater than the maximum possible scrollbar width
		outer.style.cssText =
			'visibility: hidden; width: 100px; overflow: scroll; position: absolute; top: -9999px;';
		document.body.appendChild(outer);
		const scrollbarWidth = outer.offsetWidth - outer.clientWidth;
		outer.remove();
		return scrollbarWidth;
	}

	// If there is no vertical scrollbar, return 0
	return 0;
}

/**
 * 子要素の位置まで親要素をスクロールします
 * https://stackoverflow.com/questions/45408920/plain-javascript-scrollintoview-inside-div/45411081#45411081
 */
export function scrollParentToChild(parent: Element, child: Element) {
	const parentRect = parent.getBoundingClientRect();
	const parentViewableArea = {
		height: parent.clientHeight,
		width: parent.clientWidth,
	};

	const childRect = child.getBoundingClientRect();
	// 親の要素の内側に子要素がいるかどうか判定
	const isChildViewable =
		childRect.top >= parentRect.top &&
		childRect.bottom <= parentRect.top + parentViewableArea.height;

	if (!isChildViewable) {
		const scrollTop = childRect.top - parentRect.top;
		const scrollBottom = childRect.bottom - parentRect.bottom;
		// TOP or Bottom で近い方にスクロールする
		if (Math.abs(scrollTop) < Math.abs(scrollBottom)) {
			parent.scrollTop += scrollTop;
		} else {
			parent.scrollTop += scrollBottom;
		}
	}
}
