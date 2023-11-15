import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

/** Logger payload */
export type CheckPricePayload = {
	partNumberCount?: number;
	partNumber: string;
	innerCode?: string;
	index?: number;
};

/** Log event type */
export type CheckPriceEvent = {
	event: 'gaProductsPriceCheck';
	/** part number count */
	cd_081?: number;
	cd_088: '[c_pcheck]Price Check';
	cd_089: `[c_pcheck]${MisumiOrVona}`;
	cd_094: string;
	/** series code */
	cd_189?: string;
	/** part number */
	cd_190: string;
	/** inner code */
	cd_191?: string;
	cm_112: 1;
	cm_200?: 1;
};

/**
 * "Check Price" log
 */
export function checkPrice({
	partNumberCount,
	partNumber,
	innerCode,
	index = 0,
}: CheckPricePayload) {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode } = getProductAttributes();

		sendEvent<CheckPriceEvent>({
			event: 'gaProductsPriceCheck',
			cd_081: partNumberCount,
			cd_088: '[c_pcheck]Price Check',
			cd_089: `[c_pcheck]${misumiOrVona}`,
			cd_094: `[c_pcheck]Price Check::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_112: 1,
			cm_200: index === 0 ? 1 : undefined,
		});
	});
}
