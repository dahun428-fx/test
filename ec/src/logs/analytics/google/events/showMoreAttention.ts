import { sendEvent } from './sendEvent';
import { EventManager } from '@/logs/analytics/google/EventManager';

/** Log event type */
export type ShowMoreAttentionEvent = {
	event: 'gaGeneralEvent';
	cd_079: 'cmn_attention_msg';
	cd_088: '[function]General CV';
	cm_126: 1;
};

/**
 * "Show more Attention" log
 */
export function showMoreAttention() {
	EventManager.submit(() => {
		sendEvent<ShowMoreAttentionEvent>({
			event: 'gaGeneralEvent',
			cd_079: 'cmn_attention_msg',
			cd_088: '[function]General CV',
			cm_126: 1,
		});
	});
}
