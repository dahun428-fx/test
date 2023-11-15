import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

/** Logger payload */
export type CheckoutPayload = {
	partNumberCount?: number;
	partNumber: string;
	innerCode?: string;
};

/** Log event type */
export type CheckoutEvent = {
	event: 'gaProductsCheckout';
	/** part number count */
	cd_081?: number;
	cd_088: '[c_checkout]Checkout';
	cd_089: `[c_ordernow]${MisumiOrVona}`;
	/** series code */
	cd_189?: string;
	/** part number */
	cd_190: string;
	/** inner code */
	cd_191?: string;
	cm_129: 1;
	cm_200: 1;
};

/**
 * "Checkout" log
 */
export function checkout({
	partNumberCount,
	partNumber,
	innerCode,
}: CheckoutPayload) {
	EventManager.submit(() => {
		const { misumiOrVona, seriesCode } = getProductAttributes();
		sendEvent<CheckoutEvent>({
			event: 'gaProductsCheckout',
			cd_081: partNumberCount,
			cd_088: '[c_checkout]Checkout',
			cd_089: `[c_ordernow]${misumiOrVona}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_129: 1,
			cm_200: 1,
		});
	});
}
