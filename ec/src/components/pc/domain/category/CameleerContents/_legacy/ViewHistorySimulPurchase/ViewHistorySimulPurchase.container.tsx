import React, { useCallback, useState, VFC } from 'react';
import { ViewHistorySimulPurchase as Presenter } from './ViewHistorySimulPurchase';
import { getViewHistorySimulPurchase } from '@/api/services/cameleer/getViewHistorySimulPurchase';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetViewHistorySimulPurchaseResponse } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { last } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';

/**
 * 旧View history simul purchase container
 * TODO： 不要化確定したらフォルダごと削除する
 * @deprecated
 */
export const ViewHistorySimulPurchase: VFC = () => {
	const [viewHistorySimulPurchase, setViewHistorySimulPurchase] =
		useState<GetViewHistorySimulPurchaseResponse | null>();

	const load = useCallback(async () => {
		try {
			const seriesViewHistory = getCookie(Cookie.SERIES_VIEW_HISTORY);

			if (seriesViewHistory) {
				setViewHistorySimulPurchase(
					await getViewHistorySimulPurchase({
						subsidiary: config.subsidiaryCode,
						x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
						x2: last(seriesViewHistory.split('|')),
						dispPattern: 'c10',
						dispPage: 'top',
					})
				);
			}
		} catch (error) {
			// Noop
		}
	}, []);

	useOnMounted(load);

	if (
		!viewHistorySimulPurchase ||
		!viewHistorySimulPurchase.recommendItems?.length
	) {
		return null;
	}

	return <Presenter viewHistorySimulPurchase={viewHistorySimulPurchase} />;
};
ViewHistorySimulPurchase.displayName = 'ViewHistorySimulPurchase';
