import { useCallback, useState } from 'react';
import { PurchaseSeriesRepeatRecommend as Presenter } from './PurchaseSeriesRepeatRecommend';
import { getPurchaseSeriesRepeatRecommend } from '@/api/services/cameleer/getPurchaseSeriesRepeatRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetPurchaseSeriesRepeatRecommendResponse } from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendResponse';

export const PurchaseSeriesRepeatRecommend: React.VFC = () => {
	const [purchaseSeriesRepeatRecommend, setPurchaseSeriesRepeatRecommend] =
		useState<GetPurchaseSeriesRepeatRecommendResponse | null>();

	const load = useCallback(async () => {
		try {
			setPurchaseSeriesRepeatRecommend(
				await getPurchaseSeriesRepeatRecommend()
			);
		} catch (error) {
			// Noop
		}
	}, []);

	useOnMounted(load);

	if (
		!purchaseSeriesRepeatRecommend ||
		purchaseSeriesRepeatRecommend.recommendItems.length === 0
	) {
		return null;
	}

	return (
		<Presenter purchaseSeriesRepeatRecommend={purchaseSeriesRepeatRecommend} />
	);
};
