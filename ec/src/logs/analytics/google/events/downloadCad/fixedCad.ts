import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
import { MisumiOrVona } from '@/logs/analytics/google/types';

type DownloadFixedCadEvent = {
	event: 'gaProductsCadDL';
	cd_088: '[c_cad_dxf]CAD DL（DXF）';
	cd_089: `[c_cad_dxf]${MisumiOrVona}`;
	cd_094: `[c_cad_dxf]CAD DL（DXF）::${string}`;
	cd_189?: string;
	cd_190?: string;
	cd_191?: string;
	cm_119: 1;
	cm_124: 1;
	cm_200: 1;
};

export function fixedCad() {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode, partNumber, innerCode } =
			getProductAttributes();

		sendEvent<DownloadFixedCadEvent>({
			event: 'gaProductsCadDL',
			cd_088: '[c_cad_dxf]CAD DL（DXF）',
			cd_089: `[c_cad_dxf]${misumiOrVona}`,
			cd_094: `[c_cad_dxf]CAD DL（DXF）::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber,
			cd_191: innerCode,
			cm_119: 1,
			cm_124: 1,
			cm_200: 1,
		});
	});
}
