import { useSelector } from '@/store/hooks';
import { ReviewReport as Presenter } from './ReviewReport';
import { selectAuth } from '@/store/modules/auth';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import {
	ReportDeclareDetail,
	SearchReviewResponse,
} from '@/models/api/review/SearchReviewResponse';
import {
	REPORT_DIRECT_WRITE_CODE,
	REVIEW_REPORT_MAX,
	createReportParams,
} from '@/utils/domain/review';
import { Button } from '@/components/pc/ui/buttons';
import { assertNotNull } from '@/utils/assertions';
import { htmlEscape } from '@/utils/string';
import { addReviewReport } from '@/api/services/review/review';

type Props = {
	reviewId: number;
	reportResponse: SearchReviewResponse;
};

export const ReviewReport: React.VFC<Props> = ({
	reviewId,
	reportResponse,
}) => {
	const auth = useSelector(selectAuth);

	const [declareText, setDeclareText] = useState<string>('');
	const [selectedDeclareCode, setSelectedDeclareCode] = useState('');

	const [t] = useTranslation();
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();

	const declareData: ReportDeclareDetail[] = useMemo(() => {
		return reportResponse.data ?? [];
	}, [reportResponse, reviewId]);

	const onChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		if (value.length > REVIEW_REPORT_MAX) {
			setDeclareText(value.substring(0, REVIEW_REPORT_MAX));
		}
		setDeclareText(value);
	};

	const declareTextAvailable = useMemo(() => {
		if (
			selectedDeclareCode &&
			selectedDeclareCode === REPORT_DIRECT_WRITE_CODE
		) {
			return true;
		}
		return false;
	}, [selectedDeclareCode, setSelectedDeclareCode]);

	const content: string = useMemo(() => {
		if (selectedDeclareCode === REPORT_DIRECT_WRITE_CODE) {
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
				message: t(
					'pages.productDetail.review.reviewReport.message.notChecked'
				),
				button: (
					<Button>{t('pages.productDetail.review.reviewReport.close')}</Button>
				),
			});
			return;
		}

		if (!content || content.length < 1) {
			showMessage({
				message: t(
					'pages.productDetail.review.reviewReport.message.notContent'
				),
				button: (
					<Button>{t('pages.productDetail.review.reviewReport.close')}</Button>
				),
			});
			return;
		}

		assertNotNull(auth.user);

		const request = createReportParams(
			reviewId,
			selectedDeclareCode,
			htmlEscape(content),
			auth.user,
			auth.customer
		);

		try {
			await addReviewReport(request);
			window.close();
		} catch (error) {
			showMessage({
				message: t(
					'pages.productDetail.review.reviewReport.message.systemError'
				),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewReport.message.close')}
					</Button>
				),
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

ReviewReport.displayName = 'ReviewReport';
