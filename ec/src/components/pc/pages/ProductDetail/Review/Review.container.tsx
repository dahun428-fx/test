import { useDispatch, useSelector } from 'react-redux';
import { Review as Presenter } from './Review';
import {
	actions,
	selectReviewResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import {
	getReviewPageSize,
	isAvailaleReviewState,
} from '@/utils/domain/review';
import { useCallback, useMemo, useState } from 'react';
import { useBoolState } from '@/hooks/state/useBoolState';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { selectAuth } from '@/store/modules/auth';
import { ReviewSortType } from '@/models/api/review/SearchReviewResponse';
import {
	searchProductReviews,
	searchReviewInfo,
} from '@/api/services/review/review';
import { first } from '@/utils/collection';

type Props = {
	page?: number;
};

export const Review: React.VFC<Props> = ({ page = 1 }) => {
	const dispatch = useDispatch();
	const auth = useSelector(selectAuth);
	const reviewResponse = useSelector(selectReviewResponse);
	const { seriesCode } = useSelector(selectSeries);

	const [searchReviewRequest, setSearchReviewRequest] =
		useState<SearchReviewRequest>({
			order_type: ReviewSortType.ORDER_BY_RATE,
			page_length: getReviewPageSize(reviewResponse?.reviewConfig?.reviewState),
			page_no: page,
			reg_id: auth.userCode ?? '',
			series_code: seriesCode,
		});

	const {
		bool: loading,
		setTrue: showLoading,
		setFalse: hideLoading,
	} = useBoolState();

	const reload = useCallback(
		async (request: Omit<SearchReviewRequest, 'series_code'>) => {
			try {
				showLoading();

				const productReviewResponse = await searchProductReviews({
					...searchReviewRequest,
					page_no: page,
					...request,
				});

				const reviewInfoResponse = await searchReviewInfo(seriesCode);

				dispatch(
					actions.updateReview({ reviewData: productReviewResponse.data })
				);
				dispatch(
					actions.updateReview({ reviewInfo: first(reviewInfoResponse.data) })
				);
				setSearchReviewRequest(prev => ({
					...prev,
					page_no: page,
					...request,
				}));
			} catch (error) {
				//Noop
			} finally {
				hideLoading();
			}
		},
		[dispatch, hideLoading, page, searchReviewRequest, showLoading]
	);

	if (!reviewResponse || !isAvailaleReviewState(reviewResponse?.reviewConfig)) {
		return null;
	}

	const rate = reviewResponse.reviewInfo?.score ?? 0;

	const totalCount =
		searchReviewRequest.order_type === ReviewSortType.MY_REVIEW
			? reviewResponse.reviewData?.length
			: reviewResponse.reviewInfo?.reviewCnt;

	const reviewState = reviewResponse.reviewConfig?.reviewState ?? 0;

	const reviewDetails = reviewResponse.reviewData ?? [];

	return (
		<Presenter
			seriesCode={searchReviewRequest.series_code}
			loading={loading}
			authenticated={auth.authenticated}
			onReload={reload}
			page={searchReviewRequest.page_no ?? page}
			pageSize={
				searchReviewRequest.page_length ?? getReviewPageSize(reviewState)
			}
			rate={rate}
			totalCount={totalCount ?? 0} //info count --> total review count in seriesCode.
			reviewState={reviewState}
			reviewDetails={reviewDetails}
		/>
	);
};

Review.displayName = 'Review';
