import { useDispatch, useSelector } from 'react-redux';
import { Review as Presenter } from './Review';
import {
	actions,
	selectReviewResponse,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { getPageSize, isAvailaleReviewState } from '@/utils/domain/review';
import { useCallback, useEffect, useState } from 'react';
import { useBoolState } from '@/hooks/state/useBoolState';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { selectAuth } from '@/store/modules/auth';
import { ReviewSortType } from '@/models/api/review/SearchReviewResponse';
import {
	searchMyReviewCountInSeries,
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
			page_length: getPageSize(reviewResponse?.reviewConfig?.reviewState),
			page_no: page,
			reg_id: auth.userCode ?? '',
			series_code: seriesCode,
		});

	const [totalCount, setTotalCount] = useState<number>(
		reviewResponse?.reviewInfo?.reviewCnt ?? 0
	);

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
					actions.updateReview({
						reviewData: productReviewResponse.data,
						reviewInfo: first(reviewInfoResponse.data),
					})
				);
				setSearchReviewRequest(prev => ({
					...prev,
					page_no: page,
					...request,
				}));

				//myreview
				if (
					request.order_type === ReviewSortType.MY_REVIEW &&
					auth.authenticated &&
					auth.userCode
				) {
					const { data } = await searchMyReviewCountInSeries(
						auth.userCode,
						seriesCode
					);
					const { count } = first(data);
					setTotalCount(Number(count) ?? 0);
				} else if (request.order_type !== ReviewSortType.MY_REVIEW) {
					setTotalCount(reviewResponse?.reviewInfo?.reviewCnt ?? 0);
				}
			} catch (error) {
				//Noop
			} finally {
				hideLoading();
			}
		},
		[dispatch, hideLoading, page, searchReviewRequest, showLoading, auth]
	);

	if (!reviewResponse || !isAvailaleReviewState(reviewResponse?.reviewConfig)) {
		return null;
	}

	const rate = reviewResponse.reviewInfo?.score ?? 0;

	const reviewState = reviewResponse.reviewConfig?.reviewState ?? 0;

	const reviewDetails = reviewResponse.reviewData ?? [];

	return (
		<Presenter
			seriesCode={searchReviewRequest.series_code}
			loading={loading}
			authenticated={auth.authenticated}
			onReload={reload}
			page={searchReviewRequest.page_no ?? page}
			pageSize={searchReviewRequest.page_length ?? getPageSize(reviewState)}
			rate={rate}
			totalCount={totalCount ?? 0} //review total count for order_type : my_review or others
			reviewState={reviewState}
			reviewDetails={reviewDetails}
			reviewCount={reviewResponse.reviewInfo?.reviewCnt ?? 0} // show total review count from api data
		/>
	);
};

Review.displayName = 'Review';
