import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

/** Log event type */
export type SimilarProductEvent = {
	event: 'gaProductsSimilar';
	cd_088: '[c_similar]Search for similar products';
	cd_089: `[c_similar]${MisumiOrVona}`;
	/** series code */
	cd_189?: string;
	/** part number */
	cd_190: string;
	/** inner code */
	cd_191: string;
	cm_140: 1;
	cm_200: 1;
};

/**
 * Send gaProductsSimilar event to GA
 */
export function similarProduct() {
	EventManager.submit(() => {
		const { misumiOrVona, seriesCode, partNumber, innerCode } =
			getProductAttributes();

		sendEvent<SimilarProductEvent>({
			event: 'gaProductsSimilar',
			cd_088: '[c_similar]Search for similar products',
			cd_089: `[c_similar]${misumiOrVona}`,
			cd_189: seriesCode,
			cd_190: partNumber ?? '',
			cd_191: innerCode ?? '',
			cm_140: 1,
			cm_200: 1,
		});
	});
}
