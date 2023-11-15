import { useRouter } from 'next/router';
import React, { useCallback, useState, VFC } from 'react';
import { RecentlyViewedAndRecommend as Presenter } from './RecentlyViewedAndRecommend';
import { getGeneralRecommend } from '@/api/services/cameleer/getGeneralRecommend';
import { getViewHistorySimulPurchase } from '@/api/services/cameleer/getViewHistorySimulPurchase';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { generalRecommendLogger } from '@/logs/cameleer/generalRecommend';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';
import { ViewHistoryItem } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { trimUrlDomain } from '@/utils/cameleer';
import { last } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';

export type HistoryItem = ViewHistoryItem & {
	initialized: boolean;
};

/** Recently viewed & Recommendations container */
export const RecentlyViewedAndRecommend: VFC = () => {
	const [historyItem, setHistoryItem] = useState<HistoryItem | null>();
	const [recommendedItems, setRecommendedItems] = useState<
		GeneralRecommendSeriesItem[] | null
	>();

	const router = useRouter();

	const load = useCallback(async () => {
		try {
			const history = getCookie(Cookie.SERIES_VIEW_HISTORY);
			// 最新履歴１件を使用
			const seriesCode = history && last(history.split('|'));
			if (!seriesCode) {
				return;
			}

			// 最近見たアイテムのみ旧APIで取得する
			const historyResponse = await getViewHistorySimulPurchase({
				subsidiary: config.subsidiaryCode,
				x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
				x2: seriesCode,
				dispPage: 'ctop',
				dispPattern: '0001',
			});
			if (historyResponse?.viewHistoryItem) {
				setHistoryItem({
					...historyResponse.viewHistoryItem,
					initialized: false,
				});
			}

			const response = await getGeneralRecommend({
				recommendCd: 'c10-0001',
				seriesCodeOrItemCd: seriesCode,
			});

			setRecommendedItems(response as GeneralRecommendSeriesItem[]);
		} catch (error) {
			// Noop
		}
	}, []);

	const onLoadItem = useCallback(
		(item: GeneralRecommendSeriesItem | HistoryItem) => {
			if (item.initialized) {
				return;
			}
			generalRecommendLogger.impressionLog({
				seriesCodeOrItemCd:
					(item as HistoryItem).itemCd ??
					(item as GeneralRecommendSeriesItem).seriesCode,
				position: item.position,
				recommendCd: 'c10-0001',
				dispPage: 'ctop',
			});
			item.initialized = true;
		},
		[]
	);

	const generateItemPath = useCallback(
		(item: GeneralRecommendSeriesItem | HistoryItem) => {
			const isHistoryItem =
				(item as HistoryItem).itemCd !== null &&
				(item as HistoryItem).itemCd !== undefined;
			const seriesCodeOrItemCd = isHistoryItem
				? (item as HistoryItem).itemCd
				: (item as GeneralRecommendSeriesItem).seriesCode;

			//　最近見たアイテムの場合は返却データそのままのURLに遷移させる
			const path = isHistoryItem
				? trimUrlDomain(item.linkUrl)
				: `${item.linkUrl}?rid=c10-0001_ctop_${item.position}_${seriesCodeOrItemCd}`;
			return path;
		},
		[]
	);

	const onClickItem = useCallback(
		(item: GeneralRecommendSeriesItem | HistoryItem) => {
			const isHistoryItem =
				(item as HistoryItem).itemCd !== null &&
				(item as HistoryItem).itemCd !== undefined;
			const seriesCodeOrItemCd = isHistoryItem
				? (item as HistoryItem).itemCd
				: (item as GeneralRecommendSeriesItem).seriesCode;

			generalRecommendLogger.clickLog({
				seriesCodeOrItemCd,
				position: item.position,
				recommendCd: 'c10-0001',
				dispPage: 'ctop',
			});

			//　最近見たアイテムの場合は返却データそのままのURLに遷移させる
			const path = isHistoryItem
				? trimUrlDomain(item.linkUrl)
				: `${item.linkUrl}?rid=c10-0001_ctop_${item.position}_${seriesCodeOrItemCd}`;
			router.push(path);
		},
		[router]
	);

	useOnMounted(load);

	if (!historyItem || !recommendedItems?.length) {
		return null;
	}

	return (
		<Presenter
			historyItem={historyItem}
			recommendedItems={recommendedItems}
			onLoadItem={onLoadItem}
			onClickItem={onClickItem}
			generateItemPath={generateItemPath}
		/>
	);
};
RecentlyViewedAndRecommend.displayName = 'RecentlyViewedAndRecommend';
