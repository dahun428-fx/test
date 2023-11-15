import { useEffect } from 'react';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { useSelector } from '@/store/hooks';
import {
	selectPurchaseRecommendResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';

/** Complementary products hook */
export const usePurchaseRecommend = () => {
	const response = useSelector(selectPurchaseRecommendResponse);

	useEffect(() => {
		if (response && response.purchaseRecommendList.length) {
			ga.ecommerce.viewItemList(
				response.purchaseRecommendList.map(({ seriesCode }) => ({
					seriesCode,
					itemListName: ItemListName.PURCHASE_RECOMMEND,
				}))
			);
		}
	}, [response]);

	return response;
};

export const useSeries = () => useSelector(selectSeries);
