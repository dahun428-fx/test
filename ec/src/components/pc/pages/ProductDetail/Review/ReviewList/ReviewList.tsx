import { ReviewDetail } from '@/models/api/review/SearchReviewResponse';
import styles from './ReviewList.module.scss';
import { Rating } from '@/components/pc/ui/ratings';
import { ReviewItem } from '../ReviewItem';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Pagination } from '@/components/pc/ui/paginations';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';

type Props = {
	loading: boolean;
	reviewDetails: ReviewDetail[];
	page: number;
	pageSize: number;
	totalCount: number;
	onReload: (
		request: Omit<SearchReviewRequest, 'series_code'>
	) => Promise<void>;
};

export const ReviewList: React.VFC<Props> = ({
	reviewDetails,
	onReload,
	loading,
	page,
	pageSize,
	totalCount,
}) => {
	if (reviewDetails.length < 1) {
		return null;
	}

	const [t] = useTranslation();

	const pagination = useCallback(
		() => (
			<div className={styles.pagination}>
				<Pagination
					page={page}
					pageSize={pageSize}
					totalCount={totalCount}
					onChange={page => onReload({ page_no: page })}
				/>
			</div>
		),
		[onReload, page, pageSize, totalCount]
	);

	return (
		<div className={styles.container}>
			<div>
				{!loading && (
					<ul>
						{reviewDetails ? (
							reviewDetails.map(item => {
								return (
									<li key={item.reviewId} className={styles.reviewItemWrap}>
										<ReviewItem review={item} />
									</li>
								);
							})
						) : (
							<p className={styles.noList}>
								{t('pages.productDetail.review.reviewItem.noReview')}
							</p>
						)}
					</ul>
				)}
			</div>
			{reviewDetails && pagination()}
		</div>
	);
};

ReviewList.displayName = 'ReviewList';
