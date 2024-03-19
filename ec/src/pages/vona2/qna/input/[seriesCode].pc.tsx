import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { Popup } from '@/layouts/pc/popup';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { QnaStateType } from '@/models/api/qna/SearchQnaResponse';
import { NextPageWithLayout } from '@/pages/types';
import { getOneParams } from '@/utils/query';
import { log, logError } from '@/utils/server';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: QnaStateType;
};

const QnaInput = dynamic<Props>(
	() =>
		import('@/components/pc/pages/ProductDetail/Qna/QnaInput').then(
			modules => modules.QnaInput
		),
	{ ssr: false }
);

const QnaInputPage: NextPageWithLayout<Props> = ({ seriesResponse, type }) => {
	return <QnaInput seriesResponse={seriesResponse} type={type} />;
};

QnaInputPage.displayName = 'QnaInputPage';
QnaInputPage.getLayout = Popup;

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
		log('Qna Input Page', resolvedUrl);

		const seriesResponse = await searchSeries$detail({ seriesCode });

		if (
			!seriesResponse.seriesList.length ||
			!TYPE ||
			Number(TYPE) === QnaStateType.QNA_NOT_AVAILABLE
		) {
			return { notFound: true };
		}

		return {
			props: {
				seriesResponse,
				type: QnaStateType.QNA_ORIGIN_TYPE,
			},
		};
	} catch (error) {
		logError('Qna Input Page', resolvedUrl, error);
		throw error;
	}
};

export default QnaInputPage;
