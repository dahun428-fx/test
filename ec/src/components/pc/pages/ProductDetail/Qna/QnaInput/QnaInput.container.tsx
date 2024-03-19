import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { QnaInput as Presenter } from './QnaInput';
import {
	QnaResponseStatusType,
	QnaStateType,
} from '@/models/api/qna/SearchQnaResponse';
import { first } from '@/utils/collection';
import { assertNotNull } from '@/utils/assertions';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { url } from '@/utils/url';
import { ChangeEvent, useCallback, useState } from 'react';
import {
	QNA_PART_NO_MAX,
	QNA_QUESTION_MAX,
	QNA_QUESTION_MIN,
	QNA_USE_PURPOSE_MAX,
	createAddParams,
} from '@/utils/domain/qna';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/pc/ui/buttons';
import { htmlEscape, removeKor } from '@/utils/string';
import { addQna } from '@/api/services/qna/qna';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: QnaStateType;
};

export const QnaInput: React.VFC<Props> = ({ seriesResponse, type }) => {
	const series = first(seriesResponse.seriesList);

	assertNotNull(series);

	const [t] = useTranslation();

	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();

	const auth = useSelector(selectAuth);

	const productImageUrl =
		first(series?.productImageList)?.url ?? url.noImagePath;

	const [partNo, setPartNo] = useState<string>('');
	const [question, setQuestion] = useState<string>('');
	const [usePurpose, setUsePurpose] = useState<string>('');
	const [termsCheck, setTermsCheck] = useState(false);

	const onChangeUsePurpose = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		if (value.length > QNA_USE_PURPOSE_MAX) {
			setUsePurpose(value.substring(0, QNA_USE_PURPOSE_MAX));
		}
		setUsePurpose(value);
	};

	const onChangePartNo = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		if (value.length > QNA_PART_NO_MAX) {
			setPartNo(removeKor(value.substring(0, QNA_PART_NO_MAX)));
		}
		setPartNo(removeKor(value));
	};

	const onChangeQuestion = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		if (value.length > QNA_QUESTION_MAX) {
			setQuestion(value.substring(0, QNA_QUESTION_MAX));
		}
		setQuestion(value);
	};

	const onChangeTermsCheck = (termsCheck: boolean) => {
		setTermsCheck(!termsCheck);
	};

	const onClickAddHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		if (!partNo || partNo.length < 1) {
			showMessage({
				message: t('pages.productDetail.qna.qnaInput.message.partNoNeed'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaInput.message.close')}</Button>
				),
			});
			return;
		}

		if (!question || question.length < 1) {
			showMessage({
				message: t('pages.productDetail.qna.qnaInput.message.questionNeed'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaInput.message.close')}</Button>
				),
			});
			return;
		}

		if (question.length < QNA_QUESTION_MIN) {
			showMessage({
				message: t(
					'pages.productDetail.qna.qnaInput.message.questionLengthNotAvailable'
				),
				button: (
					<Button>{t('pages.productDetail.qna.qnaInput.message.close')}</Button>
				),
			});
			return;
		}

		if (!termsCheck) {
			showMessage({
				message: t('pages.productDetail.qna.qnaInput.message.termsNeed'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaInput.message.close')}</Button>
				),
			});
			return;
		}

		assertNotNull(series);
		assertNotNull(auth.user);

		const request = createAddParams(
			htmlEscape(question),
			htmlEscape(partNo),
			series,
			auth.user,
			auth.customer
		);

		try {
			const response = await addQna(request);
			if (response.status === QnaResponseStatusType.QNA_STATUS_FAIL) {
				let slang = response.slang?.join(', ');
				showMessage({
					message: t('pages.productDetail.qna.qnaInput.message.slang', {
						slang,
					}),
					button: (
						<Button>
							{t('pages.productDetail.qna.qnaInput.message.close')}
						</Button>
					),
				});
				return;
			}

			if (opener && opener.window && opener.window.onQnaReload) {
				await opener.window.onQnaReload();
			}

			window.close();
		} catch (error) {
			showMessage({
				message: t('pages.productDetail.qna.qnaInput.message.systemError'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaInput.message.close')}</Button>
				),
			});
			opener.window.console.log(error);
		}
	}, [auth, partNo, question, termsCheck, showLoginModal, showMessage, t]);

	return (
		<Presenter
			{...{
				productImageUrl,
				series,
				partNo,
				onChangePartNo,
				question,
				onChangeQuestion,
				termsCheck,
				onChangeTermsCheck,
				onClickAddHandler,
				usePurpose,
				onChangeUsePurpose,
			}}
		/>
	);
};

QnaInput.displayName = 'QnaInput';
