import { EventManager } from '@/logs/analytics/google/EventManager';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
import { MisumiOrVona } from '@/utils/domain/log';

type ProductsPUCatalogDLPayload = {
	seriesCode?: string;
	partNumber?: string;
	innerCode?: string;
	misumiOrVona?: MisumiOrVona;
};

type ProductsPUCatalogDLEvent = {
	event: 'gaProductspucatalogdl';
	cd_088: '[detail]型番専用カタログタウンロード';
	cd_089: `[detail]${MisumiOrVona}`;
	cd_189: string; // seriesCode
	cd_190: string; // partNumber
	cd_191: string; // innerCode
	cm_90: 1;
	cm_200: 1;
};

/**
 * "型番専用カタログDLイベント" log
 */
export function productsPUCatalogDL({
	seriesCode = '',
	partNumber = '',
	innerCode = '',
	misumiOrVona = 'vona',
}: ProductsPUCatalogDLPayload) {
	EventManager.submit(() => {
		sendEvent<ProductsPUCatalogDLEvent>({
			event: 'gaProductspucatalogdl',
			cd_088: '[detail]型番専用カタログタウンロード',
			cd_089: `[detail]${misumiOrVona}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_90: 1,
			cm_200: 1,
		});
	});
}
