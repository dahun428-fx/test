import { useEffect } from 'react';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { useSelector } from '@/store/hooks';
import { selectInterestRecommendResponse } from '@/store/modules/pages/productDetail';

/** customers who viewed this item also viewed hook */
export const useInterestRecommend = () => {
	const response = useSelector(selectInterestRecommendResponse);

	useEffect(() => {
		if (response && response.interestRecommendList.length) {
			ga.ecommerce.viewItemList(
				response.interestRecommendList.map(recommend => ({
					seriesCode: recommend.seriesCode,
					itemListName: ItemListName.INTEREST_RECOMMEND,
				}))
			);
		}
	}, [response]);

	return response;
};
