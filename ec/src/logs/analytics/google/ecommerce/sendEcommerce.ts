import { ECommerce } from './types';

/** Send ga event */
export function sendEcommerce<T extends ECommerce<string>>(event: T) {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ ecommerce: null });
	window.dataLayer.push(event);
}
