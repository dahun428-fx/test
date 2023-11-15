import { useCallback, useEffect, useState } from 'react';
import { PurchaseSeriesRepeatRecommend as Presenter } from './PurchaseSeriesRepeatRecommend';
import { getPurchaseSeriesRepeatRecommend } from '@/api/services/cameleer/getPurchaseSeriesRepeatRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import { GetPurchaseSeriesRepeatRecommendResponse } from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendResponse';
import { RecommendItem as CameleerRecommendItem } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';

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

	const handleClickItem = useCallback(
		(item: CameleerRecommendItem) => {
			ga.ecommerce.selectItem({
				seriesCode: item.itemCd,
				itemListName: ItemListName.PURCHASE_SERIES_REPEAT_RECOMMEND,
			});

			if (purchaseSeriesRepeatRecommend) {
				cameleer
					.trackClick({
						...purchaseSeriesRepeatRecommend,
						item,
					})
					.then();
			}
		},
		[purchaseSeriesRepeatRecommend]
	);

	const handleLoadImage = useCallback(
		(item: CameleerRecommendItem) => {
			if (purchaseSeriesRepeatRecommend) {
				cameleer
					.trackImpression({
						...purchaseSeriesRepeatRecommend,
						item,
					})
					.then();
			}
		},
		[purchaseSeriesRepeatRecommend]
	);

	useEffect(() => {
		if (purchaseSeriesRepeatRecommend?.recommendItems.length) {
			ga.ecommerce.viewItemList(
				purchaseSeriesRepeatRecommend.recommendItems.map(recommend => ({
					seriesCode: recommend.itemCd,
					itemListName: ItemListName.PURCHASE_SERIES_REPEAT_RECOMMEND,
				}))
			);
		}
	}, [purchaseSeriesRepeatRecommend]);

	useOnMounted(load);

	if (
		!purchaseSeriesRepeatRecommend ||
		purchaseSeriesRepeatRecommend.recommendItems.length === 0
	) {
		return null;
	}

	return (
		<Presenter
			purchaseSeriesRepeatRecommend={purchaseSeriesRepeatRecommend}
			onClickItem={handleClickItem}
			onLoadImage={handleLoadImage}
		/>
	);
};
