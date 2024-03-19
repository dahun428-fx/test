import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchQnaDetail } from '@/api/services/qna/qna';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { Popup } from '@/layouts/pc/popup';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { QnaDetail, QnaStateType } from '@/models/api/qna/SearchQnaResponse';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotNull } from '@/utils/assertions';
import { first } from '@/utils/collection';
import { getOneParams } from '@/utils/query';
import { logError } from '@/utils/server';
import { log } from 'console';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: QnaStateType;
	qna: QnaDetail;
};

const QnaConfirm = dynamic<Props>(
	() =>
		import('@/components/pc/pages/ProductDetail/Qna/QnaConfirm').then(
			modules => modules.QnaConfirm
		),
	{ ssr: false }
);

const QnaConfirmPage: NextPageWithLayout<Props> = ({
	qna,
	seriesResponse,
	type,
}) => {
	return <QnaConfirm qna={qna} seriesResponse={seriesResponse} type={type} />;
};

QnaConfirmPage.displayName = 'QnaConfirmPage';
QnaConfirmPage.getLayout = Popup;

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
		log('Qna Confirm Page', resolvedUrl);

		const seriesResponse = await searchSeries$detail({
			seriesCode,
		});

		assertNotNull(CODE);

		const qnaResponse = await searchQnaDetail(Number(CODE));
		const qna = first(qnaResponse.data);

		assertNotNull(qna);

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
				qna,
			},
		};
	} catch (error) {
		logError('Qna Confirm Page', resolvedUrl, error);
		throw error;
	}
};

export default QnaConfirmPage;
