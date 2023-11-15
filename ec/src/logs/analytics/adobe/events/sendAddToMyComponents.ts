import { AddToMyComponentsPayload } from './types/AddToMyComponentsEvents';

export function sendAddToMyComponents({
	partNumberCount,
}: AddToMyComponentsPayload = {}) {
	try {
		window.sc_f_products_mycompornents_save?.(partNumberCount);
	} catch {
		// Do nothing
	}
}
