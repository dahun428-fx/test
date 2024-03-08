import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchReviewDetail } from '@/api/services/review/review';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { Popup } from '@/layouts/pc/popup';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import {
	ReviewDetail,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotNull } from '@/utils/assertions';
import { first } from '@/utils/collection';
import { getOneParams } from '@/utils/query';
import { log, logError } from '@/utils/server';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: ReviewStateType;
	review: ReviewDetail;
};

const ReviewConfirm = dynamic<Props>(
	() =>
		import('@/components/pc/pages/ProductDetail/Review/ReviewConfirm').then(
			modules => modules.ReviewConfirm
		),
	{
		ssr: false,
	}
);

const ReviewConfirmPage: NextPageWithLayout<Props> = ({
	review,
	seriesResponse,
	type,
}) => {
	return (
		<ReviewConfirm
			review={review}
			seriesResponse={seriesResponse}
			type={type}
		/>
	);
};

ReviewConfirmPage.displayName = 'ReviewConfirmPage';
ReviewConfirmPage.getLayout = Popup;

export const getServerSideProps: GetServerSideProps<Props> = async ({
	res,
	req,
	query,
	resolvedUrl,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const { TYPE, seriesCode, CODE } = getOneParams(
		query,
		'TYPE',
		'seriesCode',
		'CODE'
	);

	try {
		log('Review Confirm Page', resolvedUrl);

		const seriesResponse = await searchSeries$detail({
			seriesCode,
		});
		assertNotNull(CODE);

		const reviewResponse = await searchReviewDetail(Number(CODE));
		const review = first(reviewResponse.data);

		assertNotNull(review);

		if (
			!seriesResponse.seriesList.length ||
			!TYPE ||
			Number(TYPE) === ReviewStateType.REVIEW_NOT_AVAILABLE
		) {
			return { notFound: true };
		}

		const stateType =
			Number(TYPE) === ReviewStateType.REVIEW_ORIGIN_TYPE
				? ReviewStateType.REVIEW_ORIGIN_TYPE
				: ReviewStateType.REVIEW_SKIP_TYPE;
		return {
			props: {
				review,
				seriesResponse,
				type: stateType,
			},
		};
	} catch (error) {
		logError('Review Confirm Page', resolvedUrl, error);
		throw error;
	}
};

export default ReviewConfirmPage;
