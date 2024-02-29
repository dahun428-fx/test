import { Rating } from '@/components/pc/ui/ratings';
import styles from './ReviewItem.module.scss';
import { ReviewDetail } from '@/models/api/review/SearchReviewResponse';
import { dateTime } from '@/utils/date';
import { config } from '@/config';
import { selectAuth } from '@/store/modules/auth';
import { useSelector } from '@/store/hooks';
import { modUserId } from '@/utils/domain/review';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';

type Props = {
	review: ReviewDetail;
};

export const ReviewItem: React.VFC<Props> = ({ review }) => {
	const [t] = useTranslation();

	const auth = useSelector(selectAuth);

	const [recommendActionClick, setRecommendActionClick] = useState(false);

	const { score, reviewId, regId, regDate, regName, recommendCnt } = review;
	const formattedDate = dateTime(regDate, config.format.date);

	const recommendClickHandler = () => {
		setRecommendActionClick(true);
	};

	return (
		<div>
			<Rating
				rate={score}
				size="m"
				className={styles.rating}
				suffix={
					<>
						<span className={styles.id} id={`uId_${reviewId}`}>
							{modUserId(regId, regName, auth.userCode ?? '')}
						</span>
						<span className={styles.time} id={`time_${reviewId}`}>
							{formattedDate}
						</span>
					</>
				}
			/>
			<div className={styles.util}>
				<span>
					<Trans i18nKey="pages.productDetail.review.reviewItem.recommendDisplay">
						<strong>{{ recommendCnt }}</strong>
					</Trans>
				</span>
				{auth.userCode !== regId && (
					<>
						{!recommendActionClick ? (
							<span onClick={recommendClickHandler}>
								{t('pages.productDetail.review.reviewItem.recommendAction')}
							</span>
						) : (
							<span>
								{t(
									'pages.productDetail.review.reviewItem.recommendActionComplete'
								)}
							</span>
						)}
						<span>
							{t('pages.productDetail.review.reviewItem.reportAction')}
						</span>
					</>
				)}
			</div>
		</div>
	);
};

ReviewItem.displayName = 'ReviewItem';
