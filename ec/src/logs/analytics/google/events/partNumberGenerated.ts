import { Router } from 'next/router';
import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

// ========================================================= Experimental
// WARN: Experimental. This has not been adequately discussed.
//       If you wish to imitate it, please consult an expert.
let alreadySentOnSamePage = false;
Router.events.on('routeChangeStart', () => (alreadySentOnSamePage = false));

// ========================================================= Experimental

/** Logger payload */
export type PartNumberGeneratedPayload = {
	partNumber?: string;
	innerCode?: string;
	index?: number;
};

/** Log event type */
export type PartNumberGeneratedEvent = {
	event: 'gaProductsSkuGen';
	cd_088: '[c_partmk]PN Generate';
	cd_089: `[c_partmk]${MisumiOrVona}`;
	cd_094: `[c_partmk]PN Generate::${string}`;
	cd_189?: string;
	cd_190: string;
	cd_191?: string;
	cm_110?: 1 | undefined;
	cm_111: 1;
	cm_200?: 1;
};

/**
 * Send gaProductsSkuGen event to GA
 */
export function partNumberGenerated({
	partNumber,
	innerCode,
	index = 0,
}: PartNumberGeneratedPayload) {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode } = getProductAttributes();

		sendEvent<PartNumberGeneratedEvent>({
			event: 'gaProductsSkuGen',
			cd_088: '[c_partmk]PN Generate',
			cd_089: `[c_partmk]${misumiOrVona}`,
			cd_094: `[c_partmk]PN Generate::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber ?? '',
			cd_191: innerCode,
			cm_110: alreadySentOnSamePage ? undefined : 1,
			cm_111: 1,
			cm_200: index === 0 ? 1 : undefined,
		});
		alreadySentOnSamePage = true;
	});
}
