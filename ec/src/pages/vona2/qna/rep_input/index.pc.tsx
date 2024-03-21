import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchQnaReportData } from '@/api/services/qna/qna';
import { Popup } from '@/layouts/pc/popup';
import { SearchQnaResponse } from '@/models/api/qna/SearchQnaResponse';
import { NextPageWithLayout } from '@/pages/types';
import { assertNotNull } from '@/utils/assertions';
import { getOneParams } from '@/utils/query';
import { log, logError } from '@/utils/server';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';

type Props = {
	qnaId: number;
	reportResponse: SearchQnaResponse;
};

const QnaReport = dynamic<Props>(
	() =>
		import('@/components/pc/pages/ProductDetail/Qna/QnaReport').then(
			modules => modules.QnaReport
		),
	{
		ssr: false,
	}
);

const QnaReportPage: NextPageWithLayout<Props> = ({
	qnaId,
	reportResponse,
}) => {
	return <QnaReport qnaId={qnaId} reportResponse={reportResponse} />;
};

QnaReportPage.displayName = 'QnaReportPage';
QnaReportPage.getLayout = Popup;

export const getServerSideProps: GetServerSideProps<Props> = async ({
	res,
	req,
	query,
	resolvedUrl,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const { CODE } = getOneParams(query, 'CODE');
	const qnaId = Number(CODE);
	assertNotNull(qnaId);

	try {
		log('Qna Report Page', resolvedUrl);

		const reportResponse = await searchQnaReportData();

		return {
			props: { qnaId: qnaId, reportResponse },
		};
	} catch (error) {
		logError('Qna Report Page', resolvedUrl, error);
		throw error;
	}
};

export default QnaReportPage;
