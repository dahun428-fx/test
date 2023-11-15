import { fromEntries } from '@/utils/object';

/** Send ga event */
export function sendEvent<T extends object>(event: T) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push(event);
	window.dataLayer.push(createClearEvent(event));
}

function createClearEvent<T extends object>(event: T) {
	return fromEntries(
		Object.keys(event)
			.filter(key => key !== 'event')
			.map(key => [key, undefined])
	);
}
