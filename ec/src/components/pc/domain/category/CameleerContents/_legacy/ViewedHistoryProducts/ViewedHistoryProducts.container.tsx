import { useCallback, useState } from 'react';
import { ViewedHistoryProducts as Presenter } from './ViewedHistoryProducts';
import { getViewHistory } from '@/api/services/cameleer/getViewHistory';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetViewHistoryRequest } from '@/models/api/cameleer/getViewHistory/GetViewHistoryRequest';
import { GetViewHistoryResponse } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { Cookie, getCookie } from '@/utils/cookie';

/** Split series code */
function getSeriesCode(history?: string): string | undefined {
	if (!history) {
		return undefined;
	}
	return history.split('|').reverse().slice(0, 14).join(',');
}

/** Viewed history products container */
export const ViewedHistoryProducts: React.VFC = () => {
	const [viewHistory, setViewHistory] =
		useState<GetViewHistoryResponse | null>();

	const load = useCallback(async () => {
		try {
			const request: GetViewHistoryRequest = {
				subsidiary: config.subsidiaryCode,
				x: getCookie(Cookie.VONA_COMMON_LOG_KEY) ?? '',
				x2: getSeriesCode(getCookie(Cookie.SERIES_VIEW_HISTORY)) ?? '',
				dispPage: 'ctg4',
			};
			const viewHistoryResponse = await getViewHistory(request);
			setViewHistory(viewHistoryResponse);
		} catch (error) {
			// Noop
		}
	}, []);

	useOnMounted(() => {
		load();
	});

	if (!viewHistory || !viewHistory.recommendItems?.length) {
		return null;
	}

	return <Presenter viewHistory={viewHistory} />;
};
ViewedHistoryProducts.displayName = 'ViewedHistoryProducts';
