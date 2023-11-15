import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';

/** Log event type */
export type ViewNoListedProductEvent = {
	event: 'gaNoneCatalogView';
	cd_088: '[function]PN Generate(Unpublished)';
	cd_091: 'No_classification';
	cd_094: '[function]PN Generate(Unpublished)::No_classification';
	cd_096: 'No_classification';
	cd_173: string;
	cd_174: 'No_classification';
	cd_175: 'No_classification';
	cd_176: 'No_classification';
	cd_177: 'No_classification';
	cd_178: 'No_classification';
	cd_189: 'No_classification';
	cd_190: string;
	cd_191: 'No_classification';
	cm_110: 1;
	cm_111: 1;
	cm_200: 1;
};

/** Log event type */
export type OrderNoListedProductEvent = {
	event: 'gaNoneCatalogOrderNow';
	cd_088: '[function]Order Now(Unpublished)';
	cd_091: 'No_classification';
	cd_094: '[function]Order Now(Unpublished)::No_classification';
	cd_096: 'No_classification';
	cd_173: string;
	cd_174: 'No_classification';
	cd_175: 'No_classification';
	cd_176: 'No_classification';
	cd_177: 'No_classification';
	cd_178: 'No_classification';
	cd_189: 'No_classification';
	cd_190: string;
	cd_191: 'No_classification';
	cm_113: 1;
	cm_131: 1;
	cm_200: 1;
};

/**
 * Send display no listed product modal event
 */
export function viewNoListedProduct({
	partNumber,
	brandCode,
	brandName,
}: PartNumber) {
	EventManager.submit(() => {
		sendEvent<ViewNoListedProductEvent>({
			event: 'gaNoneCatalogView',
			cd_088: '[function]PN Generate(Unpublished)',
			cd_091: 'No_classification',
			cd_094: '[function]PN Generate(Unpublished)::No_classification',
			cd_096: 'No_classification',
			cd_173: `[${brandCode}]${brandName}`,
			cd_174: 'No_classification',
			cd_175: 'No_classification',
			cd_176: 'No_classification',
			cd_177: 'No_classification',
			cd_178: 'No_classification',
			cd_189: 'No_classification',
			cd_190: partNumber,
			cd_191: 'No_classification',
			cm_110: 1,
			cm_111: 1,
			cm_200: 1,
		});
	});
}

type OrderNoListedProductPayload = {
	partNumber: string;
	brandCode: string;
	brandName: string;
};

/**
 * Send order no listed product event
 */
export function orderNoListedProduct({
	partNumber,
	brandCode,
	brandName,
}: OrderNoListedProductPayload) {
	sendEvent<OrderNoListedProductEvent>({
		event: 'gaNoneCatalogOrderNow',
		cd_088: '[function]Order Now(Unpublished)',
		cd_091: 'No_classification',
		cd_094: '[function]Order Now(Unpublished)::No_classification',
		cd_096: 'No_classification',
		cd_173: `[${brandCode}]${brandName}`,
		cd_174: 'No_classification',
		cd_175: 'No_classification',
		cd_176: 'No_classification',
		cd_177: 'No_classification',
		cd_178: 'No_classification',
		cd_189: 'No_classification',
		cd_190: partNumber,
		cd_191: 'No_classification',
		cm_113: 1,
		cm_131: 1,
		cm_200: 1,
	});
}
