import { Rating } from '@/components/pc/ui/ratings';
import styles from './ReviewItem.module.scss';
import { ReviewDetail } from '@/models/api/review/SearchReviewResponse';
import { dateTime } from '@/utils/date';
import { config } from '@/config';
import { selectAuth } from '@/store/modules/auth';
import { useSelector } from '@/store/hooks';
import { modUserId } from '@/utils/domain/review';
import { Trans, useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { Button } from '@/components/pc/ui/buttons';

type Props = {
	review: ReviewDetail;
};

export const ReviewItem: React.VFC<Props> = ({ review }) => {
	const [t] = useTranslation();

	const auth = useSelector(selectAuth);
	const showLoginModal = useLoginModal();

	const [recommendActionClick, setRecommendActionClick] = useState(false);

	const {
		score,
		reviewId,
		regId,
		regDate,
		regName,
		recommendCnt,
		misumiComment,
	} = review;
	const formattedDate = dateTime(regDate, config.format.date);

	const isUserReview = useMemo(() => {
		return auth.userCode === regId;
	}, [auth, regId]);

	const onClickRecommendHandler = async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		//todo : api action
		setRecommendActionClick(true);
	};

	const onClickReportHandler = async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		//todo : open window
		console.log('reportClickHandler');
	};

	const onClickModifyHandler = () => {
		//todo : open window
		console.log('onClickModifyHandler');
	};

	const onClickDeleteHandler = () => {
		//todo : api action
		console.log('onClickDeleteHandler');
	};

	return (
		<>
			<div className={styles.reviewTop}>
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
					<span className={styles.recommendDisplay}>
						<Trans i18nKey="pages.productDetail.review.reviewItem.recommendDisplay">
							<strong>{{ recommendCnt }}</strong>
						</Trans>
					</span>
					{!isUserReview && (
						<>
							{!recommendActionClick ? (
								<span
									onClick={onClickRecommendHandler}
									className={styles.recommendActionButtonWrap}
								>
									<span className={styles.like}>
										{t('pages.productDetail.review.reviewItem.recommendAction')}
									</span>
								</span>
							) : (
								<span className={styles.recommendActionComplete}>
									{t(
										'pages.productDetail.review.reviewItem.recommendActionComplete'
									)}
								</span>
							)}
							<span
								className={styles.reportActionButtonWrap}
								onClick={onClickReportHandler}
							>
								<span className={styles.report}>
									{t('pages.productDetail.review.reviewItem.reportAction')}
								</span>
							</span>
						</>
					)}
				</div>
			</div>
			<div className={styles.reviewText}>
				<p className={styles.title}>{review.usePurpose}</p>
				<div className={styles.text}>
					<span>{review.content}</span>
					{isUserReview && (
						<div className={styles.btnGroup}>
							<Button size="s" onClick={onClickModifyHandler}>
								{t('pages.productDetail.review.reviewItem.modify')}
							</Button>
							<Button size="s" onClick={onClickDeleteHandler}>
								{t('pages.productDetail.review.reviewItem.delete')}
							</Button>
						</div>
					)}
				</div>
			</div>
			{misumiComment && (
				<div className={styles.reviewReply}>{misumiComment}</div>
			)}
		</>
	);
};

ReviewItem.displayName = 'ReviewItem';
