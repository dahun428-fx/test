import { useCallback, useEffect, useState } from 'react';
import { ViewHistory as Presenter } from './ViewHistory';
import { getViewHistory } from '@/api/services/cameleer/getViewHistory';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import {
	GetViewHistoryResponse,
	RecommendItem,
} from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { Cookie, getCookie } from '@/utils/cookie';

/** Generate seriesCode to send to API */
function getSeriesCode(seriesViewHistory?: string) {
	if (!seriesViewHistory) {
		return;
	}
	return seriesViewHistory.split('|').reverse().slice(0, 14).join(',');
}

/** View history container */
export const ViewHistory: React.VFC = () => {
	const [viewHistory, setViewHistory] = useState<GetViewHistoryResponse | null>(
		null
	);

	const load = useCallback(async () => {
		const seriesCode = getSeriesCode(getCookie(Cookie.SERIES_VIEW_HISTORY));
		if (!seriesCode) {
			return;
		}

		try {
			const viewHistoryResponse = await getViewHistory({
				subsidiary: config.subsidiaryCode,
				x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
				x2: seriesCode,
				dispPage: 'ctg4',
			});
			setViewHistory(viewHistoryResponse);
		} catch (error) {
			// noop
		}
	}, []);

	const handleClickItem = useCallback(
		(item: RecommendItem) => {
			ga.ecommerce.selectItem({
				seriesCode: item.itemCd,
				itemListName: ItemListName.VIEW_HISTORY,
			});

			if (viewHistory) {
				cameleer
					.trackClick({
						...viewHistory,
						item,
					})
					.then();
			}
		},
		[viewHistory]
	);

	const handleLoadImage = useCallback(
		(item: RecommendItem) => {
			if (viewHistory) {
				cameleer
					.trackImpression({
						...viewHistory,
						item,
					})
					.then();
			}
		},
		[viewHistory]
	);

	useEffect(() => {
		if (viewHistory?.recommendItems.length) {
			ga.ecommerce.viewItemList(
				viewHistory.recommendItems.map(recommend => ({
					seriesCode: recommend.itemCd,
					itemListName: ItemListName.VIEW_HISTORY,
				}))
			);
		}
	}, [viewHistory]);

	useOnMounted(load);

	if (!viewHistory || !viewHistory.recommendItems.length) {
		return null;
	}

	return (
		<Presenter
			viewHistory={viewHistory}
			onClickItem={handleClickItem}
			onLoadImage={handleLoadImage}
		/>
	);
};
ViewHistory.displayName = 'ViewHistory';
