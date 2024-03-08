import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { NextPageWithLayout } from '@/pages/types';
import { getOneParams } from '@/utils/query';
import { GetServerSideProps } from 'next';
import type { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { log, logError } from '@/utils/server';
import dynamic from 'next/dynamic';
import { Popup } from '@/layouts/pc/popup';
import { ReviewStateType } from '@/models/api/review/SearchReviewResponse';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: ReviewStateType;
};

const ReviewInput = dynamic<Props>(
	() =>
		import('@/components/pc/pages/ProductDetail/Review/ReviewInput').then(
			modules => modules.ReviewInput
		),
	{
		ssr: false,
	}
);

const ReviewInputPage: NextPageWithLayout<Props> = ({
	seriesResponse,
	type,
}) => {
	return <ReviewInput seriesResponse={seriesResponse} type={type} />;
};

ReviewInputPage.displayName = 'ReviewInputPage';
ReviewInputPage.getLayout = Popup;

export const getServerSideProps: GetServerSideProps<Props> = async ({
	res,
	req,
	query,
	resolvedUrl,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const { TYPE, seriesCode } = getOneParams(query, 'TYPE', 'seriesCode');

	try {
		log('Review Input Page', resolvedUrl);

		const seriesResponse = await searchSeries$detail({
			seriesCode,
		});

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
				seriesResponse,
				type: stateType,
			},
		};
	} catch (error) {
		logError('Review Input Page', resolvedUrl, error);
		throw error;
	}
};

export default ReviewInputPage;
