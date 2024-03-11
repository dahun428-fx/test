import {
	ReviewDetail,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import styles from './ReviewList.module.scss';
import { ReviewItem } from '../ReviewItem';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { Pagination } from '@/components/pc/ui/paginations';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import classNames from 'classnames';

type Props = {
	loading: boolean;
	seriesCode: string;
	reviewState: ReviewStateType;
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
	reviewState,
	onReload,
	loading,
	seriesCode,
	page,
	pageSize,
	totalCount,
}) => {
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
			{!loading && (
				<div
					className={classNames(
						reviewState === ReviewStateType.REVIEW_ORIGIN_TYPE
							? styles.origin
							: styles.simple
					)}
				>
					<ul>
						{reviewDetails && reviewDetails.length > 0 ? (
							reviewDetails.map(item => {
								return (
									<li key={item.reviewId} className={styles.reviewItemWrap}>
										<ReviewItem
											review={item}
											reviewState={reviewState}
											seriesCode={seriesCode}
											onReload={onReload}
										/>
									</li>
								);
							})
						) : (
							<p className={styles.noList}>
								{t('pages.productDetail.review.reviewItem.noReview')}
							</p>
						)}
					</ul>
				</div>
			)}
			{reviewDetails && pagination()}
		</div>
	);
};

ReviewList.displayName = 'ReviewList';
