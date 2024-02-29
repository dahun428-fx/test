import { useSelector } from 'react-redux';
import { ReviewProductRating as Presenter } from './ReviewProductRating';
import {
	selectReviewResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { isAvailaleReviewState, totalCount } from '@/utils/domain/review';

export const ReviewProductRating: React.VFC = () => {
	const series = useSelector(selectSeries);
	const reviewResponse = useSelector(selectReviewResponse);

	if (!reviewResponse || !isAvailaleReviewState(reviewResponse.reviewConfig)) {
		return null;
	}

	return (
		<Presenter
			rate={reviewResponse.reviewInfo?.score ?? 0}
			seriesCode={series.seriesCode}
			totalReviews={totalCount(reviewResponse.reviewInfo)}
		/>
	);
};
ReviewProductRating.displayName = 'ReviewProductRating';
