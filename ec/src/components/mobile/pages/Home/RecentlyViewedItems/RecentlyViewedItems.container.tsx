import { useCallback } from 'react';
import { Item, RecentlyViewedItems as Presenter } from './RecentlyViewedItems';
import { cameleer } from '@/logs/cameleer';
import { GetViewCategoryRepeatRecommendResponse } from '@/models/api/cameleer/category/GetViewCategoryRepeatRecommendResponse';

type Props = {
	title: string;
	items: Item[];
	cameleerCategoryRecommendResponse?: GetViewCategoryRepeatRecommendResponse;
};

/**
 * Recently viewed items container
 */
export const RecentlyViewedItems: React.VFC<Props> = ({
	title,
	items,
	cameleerCategoryRecommendResponse,
}) => {
	const handleClickItem = useCallback(
		(categoryCode: string, position?: number) => {
			if (cameleerCategoryRecommendResponse && position) {
				// NOTE: cameleer_click will be sent in case of having cameleer response only
				cameleer
					.trackClick({
						...cameleerCategoryRecommendResponse,
						item: {
							itemCd: categoryCode,
							position: position,
						},
					})
					.then();
			}
		},
		[cameleerCategoryRecommendResponse]
	);

	const handleLoadImage = useCallback(
		(categoryCode: string, position?: number) => {
			if (cameleerCategoryRecommendResponse && position) {
				// NOTE: cameleer_impression will be sent in case of having cameleer response only
				cameleer
					.trackImpression({
						...cameleerCategoryRecommendResponse,
						item: {
							itemCd: categoryCode,
							position: position,
						},
					})
					.then();
			}
		},
		[cameleerCategoryRecommendResponse]
	);

	return (
		<Presenter
			title={title}
			items={items}
			onClickItem={handleClickItem}
			onLoadImage={handleLoadImage}
		/>
	);
};
