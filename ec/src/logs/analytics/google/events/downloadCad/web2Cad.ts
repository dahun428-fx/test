import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
import { MisumiOrVona } from '@/logs/analytics/google/types';

type DownloadWeb2CadEvent = {
	event: 'gaProductsCadDL';
	cd_088: '[c_cad_w2c]CAD（Web2CAD）';
	cd_089: `[c_cad_w2c]${MisumiOrVona}`;
	cd_094: `[c_cad_w2c]CAD（Web2CAD）::${string}`;
	cd_189?: string;
	cd_190?: string;
	cd_191?: string;
	cm_121: 1;
	cm_124: 1;
	cm_200: 1;
};

export function web2Cad() {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode, partNumber, innerCode } =
			getProductAttributes();

		sendEvent<DownloadWeb2CadEvent>({
			event: 'gaProductsCadDL',
			cd_088: '[c_cad_w2c]CAD（Web2CAD）',
			cd_089: `[c_cad_w2c]${misumiOrVona}`,
			cd_094: `[c_cad_w2c]CAD（Web2CAD）::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_121: 1,
			cm_124: 1,
			cm_200: 1,
		});
	});
}
