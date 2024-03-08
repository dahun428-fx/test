import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { ReviewInput as Presenter } from './ReviewInput';
import {
	ReviewResponseStatusType,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { first } from '@/utils/collection';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { url } from '@/utils/url';
import { useTranslation } from 'react-i18next';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { ChangeEvent, useCallback, useState } from 'react';
import {
	REVIEW_CONTENT_MAX,
	REVIEW_CONTENT_MIN,
	REVIEW_USE_PURPOSE_MAX,
	createAddParams,
} from '@/utils/domain/review';
import { Button } from '@/components/pc/ui/buttons';
import { assertNotNull } from '@/utils/assertions';
import { htmlEscape } from '@/utils/string';
import { addReview } from '@/api/services/review/review';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: ReviewStateType;
};

export const ReviewInput: React.VFC<Props> = ({ seriesResponse, type }) => {
	const series = first(seriesResponse.seriesList);

	assertNotNull(series);

	const auth = useSelector(selectAuth);

	const productImageUrl =
		first(series?.productImageList)?.url ?? url.noImagePath;

	const isOriginalType = type === ReviewStateType.REVIEW_ORIGIN_TYPE;

	const [t] = useTranslation();
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();

	const [usePurpose, setUsePurpose] = useState('');
	const [content, setContent] = useState('');
	const [score, setScore] = useState<number>(0);
	const [termsCheck, setTermsCheck] = useState(false);

	const onChangeTermsCheck = (termsCheck: boolean) => {
		setTermsCheck(!termsCheck);
	};

	const onChangeUsePurpose = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;

		if (value.length > REVIEW_USE_PURPOSE_MAX) {
			setUsePurpose(value.substring(0, REVIEW_USE_PURPOSE_MAX));
		}
		setUsePurpose(value);
	};

	const onChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;

		if (value.length > REVIEW_CONTENT_MAX) {
			setContent(value.substring(0, REVIEW_CONTENT_MAX));
		}
		setContent(value);
	};

	const onClickAddHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (score === 0) {
			showMessage({
				message: t('pages.productDetail.review.reviewInput.message.scoreNeed'),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewInput.message.close')}
					</Button>
				),
			});
			return;
		}

		if (isOriginalType) {
			if (!content || content.length < 1) {
				showMessage({
					message: t(
						'pages.productDetail.review.reviewInput.message.contentNeed'
					),
					button: (
						<Button>
							{t('pages.productDetail.review.reviewInput.message.close')}
						</Button>
					),
				});
				return;
			}

			if (content.length < REVIEW_CONTENT_MIN) {
				showMessage({
					message: t(
						'pages.productDetail.review.reviewInput.message.contentLengthNotAvailable'
					),
					button: (
						<Button>
							{t('pages.productDetail.review.reviewInput.message.close')}
						</Button>
					),
				});
				return;
			}
		}

		if (!termsCheck) {
			showMessage({
				message: t('pages.productDetail.review.reviewInput.message.termsNeed'),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewInput.message.close')}
					</Button>
				),
			});
			return;
		}

		assertNotNull(series);
		assertNotNull(auth.user);

		const request = createAddParams(
			score,
			htmlEscape(usePurpose),
			htmlEscape(content),
			series,
			auth.user,
			auth.customer
		);

		try {
			const response = await addReview(request);
			if (response.status === ReviewResponseStatusType.REVIEW_STATUS_FAIL) {
				let slang = response.slang?.join(', ');
				showMessage({
					message: t('pages.productDetail.review.reviewInput.message.slang', {
						slang,
					}),
					button: (
						<Button>
							{t('pages.productDetail.review.reviewInput.message.close')}
						</Button>
					),
				});
				return;
			}

			if (opener && opener.window && opener.window.onReviewReload) {
				await opener.window.onReviewReload();
			}

			window.close();
		} catch (error) {
			showMessage({
				message: t(
					'pages.productDetail.review.reviewInput.message.systemError'
				),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewInput.message.close')}
					</Button>
				),
			});
			opener.window.console.log(error);
		}
	}, [usePurpose, content, termsCheck, score, auth, series, showMessage, t]);

	return (
		<Presenter
			{...{
				content,
				isOriginalType,
				onChangeContent,
				onChangeTermsCheck,
				onChangeUsePurpose,
				onClickAddHandler,
				productImageUrl,
				score,
				series,
				setScore,
				termsCheck,
				usePurpose,
			}}
		/>
	);
};

ReviewInput.displayName = 'ReviewInput';
