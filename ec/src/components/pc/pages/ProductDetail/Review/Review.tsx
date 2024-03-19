import {
	ReviewDetail,
	ReviewResponse,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import styles from './Review.module.scss';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Rating } from '@/components/pc/ui/ratings';
import { ReviewOrder } from './ReviewOrder';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { scrollToElement } from '@/utils/scrollIntoView';
import { DETAIL_REVIEW_AREA_ID } from './ReviewProductRating/ReviewProductRating';
import { ReviewList } from './ReviewList';

type Props = {
	authenticated: boolean;
	seriesCode: string;
	loading: boolean;
	page: number;
	pageSize: number;
	rate: number;
	totalCount: number;
	reviewState: ReviewStateType;
	reviewDetails: ReviewDetail[];
	reviewCount: number;
	onReload: (
		request: Omit<SearchReviewRequest, 'series_code'>
	) => Promise<void>;
};

export const Review: React.VFC<Props> = ({
	seriesCode,
	authenticated,
	loading,
	page,
	pageSize,
	rate,
	totalCount,
	reviewState,
	reviewDetails,
	reviewCount,
	onReload,
}) => {
	const [t] = useTranslation();

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
						seriesCode={seriesCode}
						loading={loading}
						authenticated={authenticated}
						onReload={handleReload}
						reviewState={reviewState}
					/>
				</hgroup>
			</div>
			<ReviewList
				page={page}
				pageSize={pageSize}
				loading={loading}
				totalCount={totalCount}
				seriesCode={seriesCode}
				reviewState={reviewState}
				onReload={handleReload}
				reviewDetails={reviewDetails ?? []}
			/>
		</section>
	);
};

Review.displayName = 'Review';
