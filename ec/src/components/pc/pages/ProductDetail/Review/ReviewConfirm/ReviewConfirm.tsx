import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import styles from './ReviewConfirm.module.scss';
import {
	ReviewDetail,
	ReviewResponseStatusType,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { first } from '@/utils/collection';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { url } from '@/utils/url';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ReviewStartSelect } from '../ReviewStartSelect';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import {
	REVIEW_CONTENT_MAX,
	REVIEW_CONTENT_MIN,
	REVIEW_USE_PURPOSE_MAX,
	createModifyParams,
} from '@/utils/domain/review';
import { Button } from '@/components/pc/ui/buttons';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { assertNotNull } from '@/utils/assertions';
import { modifyReview } from '@/api/services/review/review';
import { htmlDecode, htmlEscape } from '@/utils/string';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	review: ReviewDetail;
	type: ReviewStateType;
};

export const ReviewConfirm: React.VFC<Props> = ({
	seriesResponse,
	review,
	type,
}) => {
	const series = first(seriesResponse.seriesList);
	const auth = useSelector(selectAuth);

	const productImageUrl =
		first(series?.productImageList)?.url ?? url.noImagePath;
	const isOriginalType = type === ReviewStateType.REVIEW_ORIGIN_TYPE;

	const [t] = useTranslation();
	const { showMessage } = useMessageModal();
	const showLoginModal = useLoginModal();

	const [usePurpose, setUsePurpose] = useState(htmlDecode(review.usePurpose));
	const [content, setContent] = useState(htmlDecode(review.content));
	const [score, setScore] = useState<number>(review.score ?? 0);

	const ref = useRef<HTMLDivElement | null>(null);

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
		console.log('onClickModifyHandler');
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
		}
	}, [usePurpose, content, score, auth, series, showMessage, t]);

	const windowResizePopup = useCallback(() => {
		if (ref.current && window) {
			let orgWidth = ref.current.offsetWidth;
			let nowWidth = window.innerWidth || document.body.clientWidth;
			let gapedit = 120;
			let strWidth = orgWidth + (window.outerWidth - window.innerWidth);

			if (orgWidth - nowWidth < gapedit) {
				gapedit = orgWidth - nowWidth;
			} else if (orgWidth - nowWidth > 300) {
				gapedit = 10;
			}

			if (nowWidth < orgWidth) {
				strWidth = strWidth - nowWidth - gapedit;
				window.resizeBy(strWidth, 0);
			}
		}
	}, [ref]);

	useOnMounted(() => {
		windowResizePopup();
	});

	return (
		<div
			className={classNames(styles.container, isOriginalType && styles.origin)}
			ref={ref}
		>
			<div className={styles.header}>
				<h1>
					<span className={styles.misumiLogo}></span>
				</h1>
				<h2>
					<span>{t('pages.productDetail.review.reviewConfirm.title')}</span>
				</h2>
			</div>
			<div className={styles.main}>
				<div className={styles.top}>
					<div className={styles.productReview}>
						<div className={styles.prdImg}>
							<p>
								<ProductImage
									imageUrl={productImageUrl}
									size={75}
									comment={series?.seriesName}
									preset="product_main"
								/>
							</p>
						</div>
						<div className={styles.prdInfo}>
							<h3>{series?.seriesName}</h3>
							<div className={styles.starBox}>
								<p>
									{t('pages.productDetail.review.reviewConfirm.starbox')}
									<span>
										{isOriginalType
											? t('pages.productDetail.review.reviewConfirm.choose')
											: t(
													'pages.productDetail.review.reviewConfirm.chooseStar'
											  )}
									</span>
								</p>
								<div className={classNames(styles.reviewStar, styles.writer)}>
									<ReviewStartSelect score={score} setScore={setScore} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.contentWrap}>
					<div className={styles.content}>
						{isOriginalType && (
							<>
								<div className={styles.formWrap}>
									<dl className={styles.titBlock}>
										<dt>
											<Trans i18nKey="pages.productDetail.review.reviewConfirm.usePurpose">
												<span />
											</Trans>
										</dt>
										<dd>
											<div className={classNames(styles.inp, styles.s)}>
												<p className={styles.textLength}>
													<strong>{usePurpose.length}</strong>
													{t(
														'pages.productDetail.review.reviewConfirm.usePurposeTextLength'
													)}
												</p>
												<textarea
													cols={30}
													rows={10}
													maxLength={30}
													value={usePurpose}
													onChange={event => onChangeUsePurpose(event)}
												></textarea>
											</div>
										</dd>
									</dl>
									<dl className={styles.titBlock}>
										<dt>
											<Trans i18nKey="pages.productDetail.review.reviewConfirm.content">
												<span className={styles.tRed} />
											</Trans>
										</dt>
										<dd>
											<div className={classNames(styles.inp, styles.m)}>
												<p className={styles.textLength}>
													<strong>{content.length}</strong>
													{t(
														'pages.productDetail.review.reviewConfirm.contentTextLength'
													)}
												</p>
												<textarea
													cols={30}
													rows={10}
													maxLength={1000}
													value={content}
													onChange={event => onChangeContent(event)}
												></textarea>
											</div>
										</dd>
									</dl>
								</div>
								<div className={styles.infoList}>
									<ul>
										<li>
											{t(
												'pages.productDetail.review.reviewConfirm.infoList.first'
											)}
										</li>
										<li>
											{t(
												'pages.productDetail.review.reviewConfirm.infoList.second'
											)}
										</li>
										<li>
											{t(
												'pages.productDetail.review.reviewConfirm.infoList.third'
											)}
										</li>
									</ul>
								</div>
							</>
						)}
					</div>
				</div>
				<div className={styles.footer}>
					<div className={styles.btnGroup}>
						<Button
							size="m"
							onClick={onClickModifyHandler}
							className={isOriginalType ? styles.normal : styles.noneTdeco}
						>
							{t('pages.productDetail.review.reviewConfirm.modfiy')}
						</Button>
						<Button
							size="m"
							onClick={() => {
								window.close();
							}}
							className={isOriginalType ? styles.normal : styles.noneTdeco}
						>
							{t('pages.productDetail.review.reviewConfirm.close')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

ReviewConfirm.displayName = 'ReviewConfirm';
