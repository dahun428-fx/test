/**
 * Check if having global window or not
 */
export const hasWindow = (): boolean => {
	return typeof window !== `undefined`;
};

/**
 * Open sub window.
 * @param url
 * @param name
 * @param options
 */
export function openSubWindow(
	url: string,
	name: string,
	options?: { width?: number; height?: number }
) {
	const params = {
		toolbar: 'yes',
		location: 'yes',
		status: 'no',
		menubar: 'no',
		scrollbars: 'yes',
		resizable: 'yes',
		...options,
	};
	const newWindow = window.open(
		url,
		name,
		Object.entries(params)
			.map(([key, value]) => `${key}=${value}`)
			.join(',')
	);
	newWindow?.focus();
}

const WindowSize = {
	SMALL: 's',
	MEDIUM: 'm',
	LARGE: 'l',
} as const;
type WindowSize = typeof WindowSize[keyof typeof WindowSize];
export { WindowSize };

export function getWindowSize(): WindowSize | undefined {
	if (typeof document === 'undefined') {
		return;
	}

	// just media query
	const width = window.innerWidth;
	if (width >= 1400) {
		return WindowSize.LARGE;
	}

	if (width >= 1200) {
		return WindowSize.MEDIUM;
	}

	return WindowSize.SMALL;
}
