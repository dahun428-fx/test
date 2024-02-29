import { useDispatch, useSelector } from 'react-redux';
import { Review as Presenter } from './Review';
import {
	actions,
	selectReviewResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { isAvailaleReviewState } from '@/utils/domain/review';
import { useCallback, useMemo, useState } from 'react';
import { useBoolState } from '@/hooks/state/useBoolState';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { selectAuth, selectUser } from '@/store/modules/auth';
import { ReviewSortType } from '@/models/api/review/SearchReviewResponse';
import { searchProductReviews } from '@/api/services/review/review';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { scrollToElement } from '@/utils/scrollIntoView';
import { DETAIL_REVIEW_AREA_ID } from './ReviewProductRating/ReviewProductRating';

type Props = {
	page?: number;
};

export const Review: React.VFC<Props> = ({ page = 1 }) => {
	const dispatch = useDispatch();
	const auth = useSelector(selectAuth);
	const reviewResponse = useSelector(selectReviewResponse);
	const { seriesCode } = useSelector(selectSeries);

	const showLoginModal = useLoginModal();

	const [searchReviewRequest, setSearchReviewRequest] =
		useState<SearchReviewRequest>({
			order_type: ReviewSortType.ORDER_BY_RATE,
			page_length:
				reviewResponse?.reviewConfig &&
				reviewResponse?.reviewConfig?.reviewState > 1
					? 3
					: 9,
			page_no: 1,
			reg_id: auth.userCode ?? '',
			series_code: seriesCode,
		});

	const {
		bool: loading,
		setTrue: showLoading,
		setFalse: hideLoading,
	} = useBoolState();

	if (!reviewResponse || !isAvailaleReviewState(reviewResponse?.reviewConfig)) {
		return null;
	}

	const reload = useCallback(
		async (request: Omit<SearchReviewRequest, 'series_code'>) => {
			try {
				showLoading();

				const response = await searchProductReviews({
					...searchReviewRequest,
					...request,
					page_no: page,
				});

				dispatch(actions.updateReview({ reviewData: response.data }));
				setSearchReviewRequest(prev => ({
					...prev,
					...request,
					page_no: page,
				}));
			} catch (error) {
				//Noop
			} finally {
				hideLoading();
			}
		},
		[dispatch, hideLoading, page, searchReviewRequest, showLoading]
	);

	return (
		<Presenter
			loading={loading}
			authenticated={auth.authenticated}
			onReload={reload}
			reviewResponse={reviewResponse}
		/>
	);
};

Review.displayName = 'Review';
