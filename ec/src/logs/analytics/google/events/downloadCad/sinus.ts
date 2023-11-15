import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
import { MisumiOrVona } from '@/logs/analytics/google/types';

type DownloadSinusEvent = {
	event: 'gaProductsCadDL';
	cd_088: '[c_cad_pcad]CAD（SINUS）';
	cd_089: `[c_cad_pcad]${MisumiOrVona}`;
	cd_094: `[c_cad_pcad]CAD（SINUS）::${string}`;
	cd_189?: string;
	cd_190?: string;
	cd_191?: string;
	cm_134: 1;
	cm_124: 1;
	cm_200: 1;
};

export function sinus() {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode, partNumber, innerCode } =
			getProductAttributes();

		sendEvent<DownloadSinusEvent>({
			event: 'gaProductsCadDL',
			cd_088: '[c_cad_pcad]CAD（SINUS）',
			cd_089: `[c_cad_pcad]${misumiOrVona}`,
			cd_094: `[c_cad_pcad]CAD（SINUS）::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_134: 1,
			cm_124: 1,
			cm_200: 1,
		});
	});
}
