/**
 * Returns the top position of popover
 */
export function getPopoverTop(payload: {
	frame: HTMLElement;
	popover: HTMLDivElement;
}): number {
	const { frame, popover } = payload;
	const { top: frameTop } = frame.getBoundingClientRect();
	const popoverHeight = popover.offsetHeight;
	const top = frameTop + frame.offsetHeight / 2 - popoverHeight / 2;
	const bottom = top + popoverHeight;
	/** screen height without scrollbar */
	const screenHeight = window.document.documentElement.clientHeight;

	if (popoverHeight < screenHeight && bottom > screenHeight) {
		return screenHeight - popoverHeight - 10;
	} else if (top < 10) {
		return 10;
	} else {
		return top;
	}
}
