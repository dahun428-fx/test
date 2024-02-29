import { ReviewDetail } from '@/models/api/review/SearchReviewResponse';
import styles from './ReviewList.module.scss';
import { Rating } from '@/components/pc/ui/ratings';
import { ReviewItem } from '../ReviewItem';

type Props = {
	loading: boolean;
	reviewDetails: ReviewDetail[];
};

export const ReviewList: React.VFC<Props> = ({ reviewDetails, loading }) => {
	if (reviewDetails.length < 1) {
		return null;
	}

	return (
		<div className={styles.container}>
			{!loading && (
				<ul>
					{reviewDetails.map(item => {
						return (
							<li key={item.reviewId}>
								<ReviewItem review={item} />
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

ReviewList.displayName = 'ReviewList';
