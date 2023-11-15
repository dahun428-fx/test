import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';

type ClickShowAlterationSpecsEvent = {
	event: 'gaGeneralEvent';
	cd_079: 'More Options';
	cd_088: '[function]General CV';
	cd_189?: string;
	cd_190?: string;
	cd_191?: string;
	cm_126: 1;
	cm_200: 1;
};

export function clickShowAlterationSpecs() {
	EventManager.submit(() => {
		const { seriesCode, innerCode, partNumber } = getProductAttributes();
		sendEvent<ClickShowAlterationSpecsEvent>({
			event: 'gaGeneralEvent',
			cd_079: 'More Options',
			cd_088: '[function]General CV',
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_126: 1,
			cm_200: 1,
		});
	});
}
