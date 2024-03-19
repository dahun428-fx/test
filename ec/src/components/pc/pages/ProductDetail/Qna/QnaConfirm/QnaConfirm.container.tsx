import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { QnaConfirm as Presenter } from './QnaConfirm';
import {
	QnaDetail,
	QnaResponseStatusType,
	QnaStateType,
} from '@/models/api/qna/SearchQnaResponse';
import { first } from '@/utils/collection';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/store/modules/auth';
import { assertNotNull } from '@/utils/assertions';
import { url } from '@/utils/url';
import { useTranslation } from 'react-i18next';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { ChangeEvent, useCallback, useState } from 'react';
import { htmlDecode, htmlEscape, removeKor } from '@/utils/string';
import {
	QNA_PART_NO_MAX,
	QNA_QUESTION_MAX,
	QNA_QUESTION_MIN,
	QNA_USE_PURPOSE_MAX,
	createModifyParams,
} from '@/utils/domain/qna';
import { Button } from '@/components/pc/ui/buttons';
import { modifyQna } from '@/api/services/qna/qna';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	qna: QnaDetail;
	type: QnaStateType;
};

export const QnaConfirm: React.VFC<Props> = ({ qna, seriesResponse, type }) => {
	const series = first(seriesResponse.seriesList);
	const auth = useSelector(selectAuth);

	assertNotNull(series);

	const productImageUrl =
		first(series?.productImageList)?.url ?? url.noImagePath;

	const [t] = useTranslation();
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();

	const [usePurpose, setUsePurpose] = useState(htmlDecode(qna.usePurpose));
	const [question, setQuestion] = useState(htmlDecode(qna.content));
	const [partNo, setPartNo] = useState(htmlDecode(qna.partNo));

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

	const onClickModifyHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		if (!partNo || partNo.length < 1) {
			showMessage({
				message: t('pages.productDetail.qna.qnaConfirm.message.partNoNeed'),
				button: (
					<Button>
						{t('pages.productDetail.qna.qnaConfirm.message.close')}
					</Button>
				),
			});
			return;
		}

		if (!question || question.length < 1) {
			showMessage({
				message: t('pages.productDetail.qna.qnaConfirm.message.questionNeed'),
				button: (
					<Button>
						{t('pages.productDetail.qna.qnaConfirm.message.close')}
					</Button>
				),
			});
			return;
		}

		if (question.length < QNA_QUESTION_MIN) {
			showMessage({
				message: t(
					'pages.productDetail.qna.qnaConfirm.message.questionLengthNotAvailable'
				),
				button: (
					<Button>
						{t('pages.productDetail.qna.qnaConfirm.message.close')}
					</Button>
				),
			});
			return;
		}

		assertNotNull(series);
		assertNotNull(auth.user);

		const request = createModifyParams(
			htmlEscape(partNo),
			htmlEscape(question)
		);

		console.log('request ===> ', request);

		const response = await modifyQna(qna.qnaId, request);
		try {
			if (response.status === QnaResponseStatusType.QNA_STATUS_FAIL) {
				let slang = response.slang?.join(', ');
				showMessage({
					message: t('pages.productDetail.review.qnaConfirm.message.slang', {
						slang,
					}),
					button: (
						<Button>
							{t('pages.productDetail.review.qnaConfirm.message.close')}
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
				message: t('pages.productDetail.review.qnaConfirm.message.systemError'),
				button: (
					<Button>
						{t('pages.productDetail.review.qnaConfirm.message.close')}
					</Button>
				),
			});
			opener.window.console.log(error);
		}
	}, [auth, partNo, question, showLoginModal, showMessage, t]);

	return (
		<Presenter
			{...{
				onChangePartNo,
				onChangeQuestion,
				onChangeUsePurpose,
				onClickModifyHandler,
				partNo,
				productImageUrl,
				question,
				series,
				usePurpose,
			}}
		/>
	);
};
QnaConfirm.displayName = 'QnaConfirm';

/**
 *
 */
