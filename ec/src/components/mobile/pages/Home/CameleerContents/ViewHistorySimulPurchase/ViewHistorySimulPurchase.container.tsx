import React, { useCallback, useEffect, useState } from 'react';
import { ViewHistorySimulPurchase as Presenter } from './ViewHistorySimulPurchase';
import { getViewHistorySimulPurchase } from '@/api/services/cameleer/getViewHistorySimulPurchase';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import { RecommendItem } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { GetViewHistorySimulPurchaseResponse } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { last } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';

/** View history simul purchase container */
export const ViewHistorySimulPurchase: React.VFC = () => {
	const [viewHistorySimulPurchase, setViewHistorySimulPurchase] =
		useState<GetViewHistorySimulPurchaseResponse | null>(null);

	const load = useCallback(async () => {
		try {
			const seriesViewHistory = getCookie(Cookie.SERIES_VIEW_HISTORY);

			if (!seriesViewHistory) {
				return;
			}

			setViewHistorySimulPurchase(
				await getViewHistorySimulPurchase({
					subsidiary: config.subsidiaryCode,
					x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
					x2: last(seriesViewHistory.split('|')),
					dispPattern: 'A',
					dispPage: 'top',
				})
			);
		} catch (error) {
			// noop
		}
	}, []);

	const handleClickItem = useCallback(
		(item: RecommendItem) => {
			ga.ecommerce.selectItem({
				seriesCode: item.itemCd,
				itemListName: ItemListName.INTEREST_RECOMMEND,
			});

			if (viewHistorySimulPurchase) {
				cameleer
					.trackClick({
						...viewHistorySimulPurchase,
						item,
					})
					.then();
			}
		},
		[viewHistorySimulPurchase]
	);

	const onLoadImage = useCallback(
		(item: RecommendItem) => {
			if (viewHistorySimulPurchase) {
				cameleer
					.trackImpression({
						...viewHistorySimulPurchase,
						item,
					})
					.then();
			}
		},
		[viewHistorySimulPurchase]
	);

	useEffect(() => {
		if (viewHistorySimulPurchase?.recommendItems.length) {
			ga.ecommerce.viewItemList(
				viewHistorySimulPurchase.recommendItems.map(recommend => ({
					seriesCode: recommend.itemCd,
					itemListName: ItemListName.INTEREST_RECOMMEND,
				}))
			);
		}
	}, [viewHistorySimulPurchase]);

	useOnMounted(load);

	if (
		!viewHistorySimulPurchase ||
		viewHistorySimulPurchase.recommendItems.length === 0
	) {
		return null;
	}

	return (
		<Presenter
			viewHistorySimulPurchase={viewHistorySimulPurchase}
			onClickItem={handleClickItem}
			onLoadImage={onLoadImage}
		/>
	);
};
ViewHistorySimulPurchase.displayName = 'ViewHistorySimulPurchase';
