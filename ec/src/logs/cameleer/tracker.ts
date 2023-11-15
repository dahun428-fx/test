import { sleep } from '@/utils/timer';

const DELAY_OF_RETRY = 500; // ms
const MAX_RETRY_COUNT = 15;

export type TrackPayload = {
	recoCd: string;
	cookieId: string;
	userCd: string;
	dispPage: string;
	item: {
		itemCd: string;
		position: number;
	};
};

/**
 * Send log for cameleer_click.
 */
export async function trackClick(payload: TrackPayload, retry?: number) {
	const retryCount = retry ?? 0;
	if (window.Cameleer?.click_tracker) {
		const { item, recoCd, cookieId, dispPage, userCd } = payload;
		const { itemCd, position } = item;
		try {
			window.Cameleer.click_tracker(
				itemCd,
				recoCd,
				cookieId,
				dispPage,
				position,
				userCd
			);
		} catch {
			// Give up tracking
		}
	} else if (retryCount < MAX_RETRY_COUNT) {
		// wait for Cameleer.js load
		await sleep(DELAY_OF_RETRY);
		await trackClick(payload, retryCount + 1);
	} else {
		// Give up tracking
	}
}

/**
 * Send log for cameleer_impression.
 */
export async function trackImpression(payload: TrackPayload, retry?: number) {
	const retryCount = retry ?? 0;
	if (window.Cameleer?.impression_tracker) {
		const { item, recoCd, cookieId, dispPage, userCd } = payload;
		const { itemCd, position } = item;
		try {
			window.Cameleer.impression_tracker(
				itemCd,
				recoCd,
				cookieId,
				dispPage,
				position,
				userCd
			);
		} catch {
			// Give up tracking
		}
	} else if (retryCount < MAX_RETRY_COUNT) {
		// wait for Cameleer.js load
		await sleep(DELAY_OF_RETRY);
		await trackImpression(payload, retryCount + 1);
	} else {
		// Give up tracking
	}
}
