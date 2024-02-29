import {
	ReviewDetail,
	ReviewResponse,
} from '@/models/api/review/SearchReviewResponse';
import styles from './Review.module.scss';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Rating } from '@/components/pc/ui/ratings';
import { totalCount } from '@/utils/domain/review';
import { ReviewOrder } from './ReviewOrder';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { scrollToElement } from '@/utils/scrollIntoView';
import { DETAIL_REVIEW_AREA_ID } from './ReviewProductRating/ReviewProductRating';
import { ReviewList } from './ReviewList';

type Props = {
	authenticated: boolean;
	loading: boolean;
	reviewResponse: ReviewResponse;
	onReload: (
		request: Omit<SearchReviewRequest, 'series_code'>
	) => Promise<void>;
};

export const Review: React.VFC<Props> = ({
	reviewResponse,
	authenticated,
	loading,
	onReload,
}) => {
	const [t] = useTranslation();

	const rate = useMemo(() => {
		return reviewResponse.reviewInfo?.score;
	}, [reviewResponse]);

	const reviewCount = useMemo(() => {
		return totalCount(reviewResponse.reviewInfo);
	}, [reviewResponse]);

	const reviewState = useMemo(() => {
		return reviewResponse.reviewConfig?.reviewState ?? 0;
	}, [reviewResponse]);

	const reviewDetails = useMemo(() => {
		return reviewResponse.reviewData;
	}, [reviewResponse]);

	const handleReload = useCallback(
		async request => {
			await scrollToElement('review');
			await onReload(request);
		},
		[onReload]
	);

	return (
		<section id={DETAIL_REVIEW_AREA_ID}>
			<div className={styles.headerWrap}>
				<hgroup>
					<h2 className={styles.title}>
						{t('pages.productDetail.review.title')}
					</h2>
					<Rating
						rate={rate}
						size="l"
						className={styles.rating}
						suffix={
							<>
								<span className={styles.totalCountRating}>{rate}</span>
								<span className={styles.ratingText}>
									{t('pages.productDetail.review.reviewCount', {
										reviewCount,
									})}
								</span>
							</>
						}
					/>
					<ReviewOrder
						loading={loading}
						authenticated={authenticated}
						onReload={handleReload}
						reviewState={reviewState}
					/>
				</hgroup>
			</div>
			<ReviewList loading={loading} reviewDetails={reviewDetails ?? []} />
		</section>
	);
};

Review.displayName = 'Review';
