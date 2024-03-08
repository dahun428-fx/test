import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchReviewReportData } from '@/api/services/review/review';
import { Popup } from '@/layouts/pc/popup';
import { SearchReviewResponse } from '@/models/api/review/SearchReviewResponse';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotNull } from '@/utils/assertions';
import { getOneParams } from '@/utils/query';
import { log, logError } from '@/utils/server';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

type Props = {
	reviewId: number;
	reportResponse: SearchReviewResponse;
};

const ReviewReport = dynamic<Props>(
	() =>
		import('@/components/pc/pages/ProductDetail/Review/ReviewReport').then(
			modules => modules.ReviewReport
		),
	{
		ssr: false,
	}
);

const ReviewReportPage: NextPageWithLayout<Props> = ({
	reviewId,
	reportResponse,
}) => {
	return <ReviewReport reviewId={reviewId} reportResponse={reportResponse} />;
};

ReviewReportPage.displayName = 'ReviewReportPage';
ReviewReportPage.getLayout = Popup;

export const getServerSideProps: GetServerSideProps<Props> = async ({
	res,
	req,
	query,
	resolvedUrl,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const { CODE } = getOneParams(query, 'CODE');
	const reviewId = Number(CODE);
	assertNotNull(reviewId);

	try {
		log('Review Report Page', resolvedUrl);

		const reportResponse = await searchReviewReportData();

		return {
			props: { reviewId: reviewId, reportResponse },
		};
	} catch (error) {
		logError('Review Report Page', resolvedUrl, error);
		throw error;
	}
};

export default ReviewReportPage;
