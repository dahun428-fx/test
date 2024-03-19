import {
	ReportDeclareDetail,
	SearchQnaResponse,
} from '@/models/api/qna/SearchQnaResponse';
import { QnaReport as Presenter } from './QnaReport';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import {
	QNA_REPORT_DIRECT_WRITE_CODE,
	QNA_REPORT_MAX,
	createReportParams,
} from '@/utils/domain/qna';
import { Button } from '@/components/pc/ui/buttons';
import { assertNotNull } from '@/utils/assertions';
import { htmlEscape } from '@/utils/string';
import { addQnaReport } from '@/api/services/qna/qna';

type Props = {
	qnaId: number;
	reportResponse: SearchQnaResponse;
};

export const QnaReport: React.VFC<Props> = ({ qnaId, reportResponse }) => {
	const auth = useSelector(selectAuth);

	const [declareText, setDeclareText] = useState<string>('');
	const [selectedDeclareCode, setSelectedDeclareCode] = useState('');

	const [t] = useTranslation();
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();

	const declareData: ReportDeclareDetail[] = useMemo(() => {
		return reportResponse.data ?? [];
	}, [reportResponse, qnaId]);

	const onChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		if (value.length > QNA_REPORT_MAX) {
			setDeclareText(value.substring(0, QNA_REPORT_MAX));
		}
		setDeclareText(value);
	};

	const declareTextAvailable = useMemo(() => {
		if (
			selectedDeclareCode &&
			selectedDeclareCode === QNA_REPORT_DIRECT_WRITE_CODE
		) {
			return true;
		}
		return false;
	}, [selectedDeclareCode, setSelectedDeclareCode]);

	const content: string = useMemo(() => {
		if (selectedDeclareCode === QNA_REPORT_DIRECT_WRITE_CODE) {
			return declareText;
		} else {
			const foundIndex = declareData.findIndex(
				item => item.code === selectedDeclareCode
			);
			return declareData[foundIndex]?.explain ?? '';
		}
	}, [selectedDeclareCode, declareData, declareText]);

	const onClickReportExcuteHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (!selectedDeclareCode) {
			showMessage({
				message: t('pages.productDetail.qna.qnaReport.message.notChecked'),
				button: <Button>{t('pages.productDetail.qna.qnaReport.close')}</Button>,
			});
			return;
		}

		if (!content || content.length < 1) {
			showMessage({
				message: t('pages.productDetail.qna.qnaReport.message.notContent'),
				button: <Button>{t('pages.productDetail.qna.qnaReport.close')}</Button>,
			});
			return;
		}

		assertNotNull(auth.user);

		const request = createReportParams(
			qnaId,
			selectedDeclareCode,
			htmlEscape(content),
			auth.user,
			auth.customer
		);

		try {
			await addQnaReport(request);
			window.close();
		} catch (error) {
			showMessage({
				message: t('pages.productDetail.qna.qnaReport.message.systemError'),
				button: <Button>{t('pages.productDetail.qna.qnaReport.close')}</Button>,
			});
			console.log(error);
		}
	}, [
		auth,
		content,
		declareData,
		selectedDeclareCode,
		setSelectedDeclareCode,
		showLoginModal,
		showMessage,
		t,
	]);

	return (
		<Presenter
			{...{
				declareData,
				declareText,
				declareTextAvailable,
				onChangeTextArea,
				onClickReportExcuteHandler,
				selectedDeclareCode,
				setSelectedDeclareCode,
			}}
		/>
	);
};

QnaReport.displayName = 'QnaReport';
