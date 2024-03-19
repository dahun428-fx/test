import { useTranslation } from 'react-i18next';
import styles from './ReviewOrder.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import {
	ReviewSortType,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { openSubWindow } from '@/utils/window';
import { url } from '@/utils/url';
import { searchMyReviewCountInSeries } from '@/api/services/review/review';
import { first } from '@/utils/collection';
import { assertNotEmpty } from '@/utils/assertions';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';

type Props = {
	seriesCode: string;
	loading: boolean;
	authenticated: boolean;
	reviewState: number;
	onReload: (
		request: Omit<SearchReviewRequest, 'series_code'>
	) => Promise<void>;
};

export const ReviewOrder: React.VFC<Props> = ({
	seriesCode,
	reviewState,
	authenticated,
	onReload,
	loading,
}) => {
	const auth = useSelector(selectAuth);
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();
	const [sortActive, setSortActive] = useState<ReviewSortType>(
		ReviewSortType.ORDER_BY_RATE
	);

	const [t] = useTranslation();

	if (reviewState < 1) {
		return null;
	}

	const onClickSort = async (sortType: ReviewSortType) => {
		if (loading) {
			return;
		}

		if (sortType === ReviewSortType.MY_REVIEW) {
			if (!authenticated) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}
			if (!auth.userCode) {
				return;
			}
		}
		await onReload({
			order_type: sortType,
			reg_id: auth.userCode ?? '',
		});

		setSortActive(sortType);
	};

	const onClickReviewWriteHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (!auth.userCode) {
			return;
		}
		const { data } = await searchMyReviewCountInSeries(
			auth.userCode,
			seriesCode
		);

		assertNotEmpty(data);

		const { count, maxReviewRecCnt } = first(data);
		if (Number(count) >= Number(maxReviewRecCnt)) {
			showMessage({
				message: t(
					'pages.productDetail.review.reviewOrder.message.reviewMaxCount'
				),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewOrder.message.close')}
					</Button>
				),
			});
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
			url.reviewsInput(seriesCode, reviewState),
			'review_input',
			option
		);
		(window as any).onReviewReload = async () =>
			await onReload({
				order_type: ReviewSortType.ORDER_BY_RATE,
				page_no: 1,
			});
	}, [seriesCode, authenticated, auth, onReload, openSubWindow]);

	return (
		<div className={styles.containerWrap}>
			<span className={styles.sort}>
				<span
					onClick={() => onClickSort(ReviewSortType.ORDER_BY_RATE)}
					className={classNames(
						sortActive === ReviewSortType.ORDER_BY_RATE ? styles.active : ''
					)}
				>
					{t('pages.productDetail.review.reviewOrder.orderByRate')}
				</span>
				{reviewState !== 1 && (
					<span
						onClick={() => onClickSort(ReviewSortType.ORDER_BY_RECOMMEND)}
						className={classNames(
							sortActive === ReviewSortType.ORDER_BY_RECOMMEND
								? styles.active
								: ''
						)}
					>
						{t('pages.productDetail.review.reviewOrder.orderByRecommend')}
					</span>
				)}
				<span
					onClick={() => onClickSort(ReviewSortType.ORDER_BY_DATE)}
					className={classNames(
						sortActive === ReviewSortType.ORDER_BY_DATE ? styles.active : ''
					)}
				>
					{t('pages.productDetail.review.reviewOrder.orderByDate')}
				</span>
				<span
					onClick={() => onClickSort(ReviewSortType.ORDER_BY_LOW_RATE)}
					className={classNames(
						sortActive === ReviewSortType.ORDER_BY_LOW_RATE ? styles.active : ''
					)}
				>
					{t('pages.productDetail.review.reviewOrder.orderByLowRate')}
				</span>
				<span
					onClick={() => onClickSort(ReviewSortType.MY_REVIEW)}
					className={classNames(
						sortActive === ReviewSortType.MY_REVIEW ? styles.active : ''
					)}
				>
					{t('pages.productDetail.review.reviewOrder.myReview')}
				</span>
			</span>
			<Button
				size="m"
				theme="strong"
				className={styles.writeButton}
				icon="apply-sample"
				onClick={onClickReviewWriteHandler}
			>
				{t('pages.productDetail.review.reviewOrder.writeReview')}
			</Button>
		</div>
	);
};

ReviewOrder.displayName = 'ReviewOrder';
