import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
import { MisumiOrVona } from '@/logs/analytics/google/types';

type DownloadCadenasEvent = {
	event: 'gaProductsCadDL';
	cd_088: '[c_cad_cfg]CAD（config）';
	cd_089: `[c_cad_cfg]${MisumiOrVona}`;
	cd_094: `[c_cad_cfg]CAD（config）::${string}`;
	cd_189?: string;
	cd_190?: string;
	cd_191?: string;
	cm_120: 1;
	cm_124: 1;
	cm_200: 1;
};

export function cadenas() {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode, partNumber, innerCode } =
			getProductAttributes();

		sendEvent<DownloadCadenasEvent>({
			event: 'gaProductsCadDL',
			cd_088: '[c_cad_cfg]CAD（config）',
			cd_089: `[c_cad_cfg]${misumiOrVona}`,
			cd_094: `[c_cad_cfg]CAD（config）::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_120: 1,
			cm_124: 1,
			cm_200: 1,
		});
	});
}
