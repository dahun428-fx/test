import { Rating } from '@/components/pc/ui/ratings';
import styles from './ReviewItem.module.scss';
import {
	ReviewDetail,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { dateTime } from '@/utils/date';
import { config } from '@/config';
import { selectAuth } from '@/store/modules/auth';
import { useSelector } from '@/store/hooks';
import { createLikeParams, modUserId } from '@/utils/domain/review';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { Button } from '@/components/pc/ui/buttons';
import { openSubWindow } from '@/utils/window';
import { url } from '@/utils/url';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { useConfirmModal } from '@/components/pc/ui/modals/ConfirmModal';
import { addReviewLike, removeReview } from '@/api/services/review/review';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { htmlDecode } from '@/utils/string';
import { assertNotNull } from '@/utils/assertions';
import { Anchor } from '@/components/pc/ui/links';
import classNames from 'classnames';

type Props = {
	review: ReviewDetail;
	reviewState: ReviewStateType;
	seriesCode: string;
	onReload: (
		request: Omit<SearchReviewRequest, 'series_code'>
	) => Promise<void>;
};

export const ReviewItem: React.VFC<Props> = ({
	review,
	reviewState,
	seriesCode,
	onReload,
}) => {
	const [t] = useTranslation();

	const auth = useSelector(selectAuth);
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();
	const { showConfirm } = useConfirmModal();

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

	const [recommendCount, setRecommendCount] = useState(recommendCnt);

	const formattedDate = dateTime(regDate, config.format.date);

	const isUserReview = useMemo(() => {
		return auth.userCode === regId;
	}, [auth, regId]);

	const isOriginType = useMemo(() => {
		return reviewState === ReviewStateType.REVIEW_ORIGIN_TYPE;
	}, [reviewState]);

	const onClickRecommendHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		try {
			assertNotNull(auth.user);

			const request = createLikeParams(reviewId, auth.user, auth.customer);

			const response = await addReviewLike(request);

			if (response.status === 'success') {
				setRecommendActionClick(true);
				setRecommendCount(recommendCount + 1);
			}
		} catch (error) {
			showMessage({
				message: t('pages.productDetail.review.reviewItem.message.systemError'),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewItem.message.close')}
					</Button>
				),
			});
			console.log(error);
		}

		//todo : api action
	}, [
		auth,
		addReviewLike,
		recommendActionClick,
		recommendCount,
		showLoginModal,
		showMessage,
		t,
	]);

	const onClickReportHandler = async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (!auth.userCode) {
			return;
		}
		let option = {
			width: 700,
			height: 600,
			scrollbars: 'yes',
		};
		openSubWindow(url.reviewsReportInput(reviewId), 'review_rep_input', option);
		//todo : open window
		console.log('reportClickHandler');
	};

	const onClickModifyHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (!auth.userCode) {
			return;
		}

		let option = {
			width: 700,
			height: 600,
			scrollbars: 'yes',
		};

		//review only display name and star
		if (reviewState === ReviewStateType.REVIEW_SKIP_TYPE) {
			option.height = 400;
		}
		openSubWindow(
			url.reviewsConfirm(seriesCode, reviewState, reviewId),
			'review_confirm',
			option
		);
		(window as any).onReviewReload = async () => await onReload({});
	}, [auth, seriesCode, reviewState, reviewId, onReload, openSubWindow]);

	const onClickDeleteHandler = useCallback(async () => {
		const confirm = await showConfirm({
			message: t('pages.productDetail.review.reviewItem.confirm.delete'),
			confirmButton: t('pages.productDetail.review.reviewItem.confirm.yes'),
			closeButton: t('pages.productDetail.review.reviewItem.confirm.no'),
		});
		if (!confirm) return;

		try {
			await removeReview(reviewId);
			await onReload({});
			showMessage({
				message: t(
					'pages.productDetail.review.reviewItem.message.delete.success'
				),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewItem.message.close')}
					</Button>
				),
			});
		} catch (error) {
			showMessage({
				message: t('pages.productDetail.review.reviewItem.message.systemError'),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewItem.message.close')}
					</Button>
				),
			});
			console.log(error);
		}
	}, [removeReview, onReload, reviewId, showMessage, showConfirm, t]);

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
				{isOriginType && (
					<div className={styles.util}>
						<span className={styles.recommendDisplay}>
							<Trans i18nKey="pages.productDetail.review.reviewItem.recommendDisplay">
								<strong>{{ recommendCnt: recommendCount }}</strong>
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
											{t(
												'pages.productDetail.review.reviewItem.recommendAction'
											)}
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
				)}
			</div>
			{isOriginType && (
				<div className={styles.reviewText}>
					<p className={styles.title}>{htmlDecode(review.usePurpose)}</p>
					<div className={styles.text}>
						<span>{htmlDecode(review.content)}</span>
					</div>
				</div>
			)}
			{isUserReview && (
				<div
					className={classNames(
						styles.btnGroup,
						!isOriginType && styles.simple
					)}
				>
					{isOriginType ? (
						<>
							<Button size="s" onClick={onClickModifyHandler}>
								{t('pages.productDetail.review.reviewItem.modify')}
							</Button>
							<Button size="s" onClick={onClickDeleteHandler}>
								{t('pages.productDetail.review.reviewItem.delete')}
							</Button>
						</>
					) : (
						<>
							<span className={styles.btn} onClick={onClickModifyHandler}>
								{t('pages.productDetail.review.reviewItem.modify')}
							</span>
							<span className={styles.btn} onClick={onClickDeleteHandler}>
								{t('pages.productDetail.review.reviewItem.delete')}
							</span>
						</>
					)}
				</div>
			)}
			{misumiComment && (
				<div className={styles.reviewReply}>{htmlDecode(misumiComment)}</div>
			)}
		</>
	);
};

ReviewItem.displayName = 'ReviewItem';
