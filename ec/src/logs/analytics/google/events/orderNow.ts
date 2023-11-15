import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

/** Logger payload */
export type OrderNowPayload = {
	partNumberCount?: number;
	partNumber: string;
	innerCode?: string;
	index?: number;
};

/** Log event type */
export type OrderNowEvent = {
	event: 'gaProductsImmediatelyOrder';
	cd_088: '[c_ordernow]Order Now';
	cd_089: `[c_ordernow]${MisumiOrVona}`;
	cd_094: `[c_ordernow]Order Now::${string}`;
	cd_081?: number;
	cd_189?: string;
	cd_190: string;
	cd_191: string;
	cm_113: 1;
	cm_200?: 1;
};

/**
 * "Order now" log
 */
export function orderNow({
	partNumberCount,
	partNumber,
	innerCode,
	index = 0,
}: OrderNowPayload) {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode } = getProductAttributes();

		sendEvent<OrderNowEvent>({
			event: 'gaProductsImmediatelyOrder',
			cd_088: '[c_ordernow]Order Now',
			cd_089: `[c_ordernow]${misumiOrVona}`,
			cd_094: `[c_ordernow]Order Now::${departmentCode}`,
			cd_081: partNumberCount,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode ?? '',
			cm_113: 1,
			cm_200: index === 0 ? 1 : undefined,
		});
	});
}
