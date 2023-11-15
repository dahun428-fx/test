import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

/** Logger payload */
export type AddToMyComponentsPayload = {
	partNumberCount?: number;
	partNumber: string;
	innerCode?: string;
	index?: number;
};

/** Log event type */
export type AddToMyComponentsEvent = {
	event: 'gaProductsMypartslistSave';
	cd_088: '[c_parts]Save to My Component';
	cd_089: `[c_parts]${MisumiOrVona}`;
	cd_094: `[c_parts]Save to My Component::${string}`;
	cd_189?: string;
	cd_190: string;
	cd_191: string;
	cd_081?: number;
	cm_115: 1;
	cm_145: 1;
	cm_200?: 1;
};

/**
 * "Add to My components" log
 */
export function addToMyComponents({
	partNumberCount,
	partNumber,
	innerCode,
	index = 0,
}: AddToMyComponentsPayload) {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode } = getProductAttributes();

		sendEvent<AddToMyComponentsEvent>({
			event: 'gaProductsMypartslistSave',
			cd_088: '[c_parts]Save to My Component',
			cd_089: `[c_parts]${misumiOrVona}`,
			cd_094: `[c_parts]Save to My Component::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode ?? '',
			cd_081: partNumberCount,
			cm_115: 1,
			cm_145: 1,
			cm_200: index === 0 ? 1 : undefined,
		});
	});
}
