import { Rating } from '@/components/pc/ui/ratings';
import styles from './ReviewProductRating.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
	rate: number;
	seriesCode: string;
	totalReviews: number;
};

export const DETAIL_REVIEW_AREA_ID = `review`;

export const ReviewProductRating: React.VFC<Props> = ({
	rate,
	seriesCode,
	totalReviews,
}) => {
	const [t] = useTranslation();

	const hasReview = totalReviews > 0;
	return (
		<div>
			<div className={styles.rateWrapper}>
				<Rating
					rate={rate}
					suffix={
						hasReview ? (
							<a
								href={`#${DETAIL_REVIEW_AREA_ID}`}
								className={styles.ratingText}
							>
								{t(
									'pages.productDetail.review.reviewProductRating.detailReview',
									{ totalReviews }
								)}
							</a>
						) : null
					}
				/>
			</div>
		</div>
	);
};

ReviewProductRating.displayName = 'ReviewProductRating';
