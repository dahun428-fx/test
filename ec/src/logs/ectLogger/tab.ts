import { addLog } from '@/api/services/addLog';
import { LogType } from '@/models/api/msm/ect/log/AddLogParams';
import { TabName } from '@/models/api/msm/ect/log/message/DetailTabLogMessage';
import { TabId as ComplexTabId } from '@/models/domain/series/complexTab';
import type { TabId } from '@/models/domain/series/tab';
import { normalizeUrl } from '@/utils/url';

/** TabId -> TabName mapping */
const tabNames: Record<TabId | ComplexTabId, TabName> = {
	// WYSIWYG tabs
	drawing: '1',
	specifications: '6',
	specificationsAndDelivery: '6',
	specificationsAndPrice: '6',
	standardSpecifications: '12',
	drawingAndSpecifications: '1',
	productSpecifications: '9',
	productInformation: '21',
	price: '6',
	deliveryAndPrice: '6',
	example: '10',
	alterations: '11',
	alterationsAndCoating: '11',
	overviewAndSpecifications: '7',
	featuresAndExample: '10',

	// other tabs
	codeList: '5',
	technicalInformation: '2',
	catalog: '3',
	pdf: '21',
	detailInfo: '22',
	basicInfo: '23',
};

type ChangeTabPayload = {
	brandCode: string;
	seriesCode: string;
	tabId: TabId | ComplexTabId;
};

type Preview3DPayload = {
	brandCode: string;
	seriesCode: string;
};

export function changeTab(payload: ChangeTabPayload) {
	const tabName = tabNames[payload.tabId];
	addLog(LogType.DETAIL_TAB, {
		brandCode: payload.brandCode,
		seriesCode: payload.seriesCode,
		tabName,
		url: normalizeUrl(location.href),
	});
}

export function preview3D(payload: Preview3DPayload) {
	addLog(LogType.DETAIL_TAB, {
		brandCode: payload.brandCode,
		seriesCode: payload.seriesCode,
		// 流石に tab に 3D プレビューを登録するのは憚られたので別出ししています
		tabName: '16f',
		url: normalizeUrl(location.href),
	});
}
