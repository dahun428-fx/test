import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { getProductAttributes } from '@/logs/analytics/google/events/helpers/getProductAttributes';
import { MisumiOrVona } from '@/logs/analytics/google/types';

/** Log event type */
export type DownloadPdfEvent = {
	event: 'gaProductsPdfDL';
	cd_088: '[c_pdf]PDF Click';
	cd_089: `[c_pdf]${MisumiOrVona}`;
	cd_094: `[c_pdf]PDF Click::${string}`;
	cd_189?: string;
	cd_190: string;
	cd_191?: string | undefined;
	cm_116: 1;
	cm_200: 1;
};

/**
 * "Download pdf" log
 */
export function downloadPdf() {
	EventManager.submit(() => {
		const { misumiOrVona, departmentCode, seriesCode, innerCode, partNumber } =
			getProductAttributes();

		sendEvent<DownloadPdfEvent>({
			event: 'gaProductsPdfDL',
			cd_088: '[c_pdf]PDF Click',
			cd_089: `[c_pdf]${misumiOrVona}`,
			cd_094: `[c_pdf]PDF Click::${departmentCode}`,
			cd_189: seriesCode,
			cd_190: partNumber ?? '',
			cd_191: innerCode,
			cm_116: 1,
			cm_200: 1,
		});
	});
}
