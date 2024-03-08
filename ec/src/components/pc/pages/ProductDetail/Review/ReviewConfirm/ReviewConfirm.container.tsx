import React, { ChangeEvent, useCallback, useState } from 'react';
import { ReviewConfirm as Presenter } from './ReviewConfirm';
import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import {
	ReviewDetail,
	ReviewResponseStatusType,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { first } from '@/utils/collection';
import { useSelector } from 'react-redux';
import { assertNotNull } from '@/utils/assertions';
import { url } from '@/utils/url';
import { useTranslation } from 'react-i18next';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { htmlDecode, htmlEscape } from '@/utils/string';
import {
	REVIEW_CONTENT_MAX,
	REVIEW_CONTENT_MIN,
	REVIEW_USE_PURPOSE_MAX,
	createModifyParams,
} from '@/utils/domain/review';
import { Button } from '@/components/pc/ui/buttons';
import { selectAuth } from '@/store/modules/auth';
import { modifyReview } from '@/api/services/review/review';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	review: ReviewDetail;
	type: ReviewStateType;
};

export const ReviewConfirm: React.VFC<Props> = ({
	review,
	seriesResponse,
	type,
}) => {
	const series = first(seriesResponse.seriesList);
	const auth = useSelector(selectAuth);

	assertNotNull(series);

	const productImageUrl =
		first(series?.productImageList)?.url ?? url.noImagePath;
	const isOriginalType = type === ReviewStateType.REVIEW_ORIGIN_TYPE;

	const [t] = useTranslation();
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();

	const [usePurpose, setUsePurpose] = useState(htmlDecode(review.usePurpose));
	const [content, setContent] = useState(htmlDecode(review.content));
	const [score, setScore] = useState<number>(review.score ?? 0);

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

	const onClickModifyHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (score === 0) {
			showMessage({
				message: t(
					'pages.productDetail.review.reviewConfirm.message.scoreNeed'
				),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewConfirm.message.close')}
					</Button>
				),
			});
			return;
		}

		if (isOriginalType) {
			if (!content || content.length < 1) {
				showMessage({
					message: t(
						'pages.productDetail.review.reviewConfirm.message.contentNeed'
					),
					button: (
						<Button>
							{t('pages.productDetail.review.reviewConfirm.message.close')}
						</Button>
					),
				});
				return;
			}

			if (content.length < REVIEW_CONTENT_MIN) {
				showMessage({
					message: t(
						'pages.productDetail.review.reviewConfirm.message.contentLengthNotAvailable'
					),
					button: (
						<Button>
							{t('pages.productDetail.review.reviewConfirm.message.close')}
						</Button>
					),
				});
				return;
			}
		}

		assertNotNull(series);
		assertNotNull(auth.user);

		const request = createModifyParams(
			score,
			htmlEscape(usePurpose),
			htmlEscape(content)
		);

		try {
			const response = await modifyReview(review.reviewId, request);
			if (response.status === ReviewResponseStatusType.REVIEW_STATUS_FAIL) {
				let slang = response.slang?.join(', ');
				showMessage({
					message: t('pages.productDetail.review.reviewConfirm.message.slang', {
						slang,
					}),
					button: (
						<Button>
							{t('pages.productDetail.review.reviewConfirm.message.close')}
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
					'pages.productDetail.review.reviewConfirm.message.systemError'
				),
				button: (
					<Button>
						{t('pages.productDetail.review.reviewConfirm.message.close')}
					</Button>
				),
			});
			opener.window.console.log(error);
		}
	}, [usePurpose, content, score, auth, series, showMessage, t]);

	return (
		<Presenter
			{...{
				content,
				isOriginalType,
				onChangeContent,
				onChangeUsePurpose,
				onClickModifyHandler,
				productImageUrl,
				score,
				series,
				setScore,
				usePurpose,
			}}
		/>
	);
};

ReviewConfirm.displayName = 'ReviewConfirm';
