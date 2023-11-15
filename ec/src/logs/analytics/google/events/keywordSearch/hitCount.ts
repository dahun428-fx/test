import { EventManager } from '@/logs/analytics/google/EventManager';
import { sendEvent } from '@/logs/analytics/google/events/sendEvent';
import { store } from '@/store';
import { selectEachHitCount } from '@/store/modules/pages/keywordSearch';

type Keyword = string;
type BrandCount = number;
type CategoryCount = number;
type SeriesCount = number;
type FullTextCount = number;
type TechFullTextCount = number;
type TypeCount = number;
type InCADLibraryCount = number;
type ComboCount = number;
type DiscontinuedCount = number;

/** Log event type */
export type HitCountEvent = {
	event: 'gaSearchResults';
	cd_071: `${Keyword}|${BrandCount}:${CategoryCount}:${SeriesCount}:${FullTextCount}:${DiscontinuedCount}:${TechFullTextCount}:${TypeCount}:${InCADLibraryCount}:0:${ComboCount}`;
};

export function hitCount(keyword?: string) {
	EventManager.submit(() => {
		const {
			brand,
			category,
			series,
			fullText,
			techInfo,
			type,
			inCADLibrary,
			combo,
			discontinued,
		} = selectEachHitCount(store.getState());
		sendEvent<HitCountEvent>({
			event: 'gaSearchResults',
			cd_071: `${keyword}|${brand}:${category}:${series}:${fullText}:${discontinued}:${techInfo}:${type}:${inCADLibrary}:0:${combo}`,
		});
	});
}
