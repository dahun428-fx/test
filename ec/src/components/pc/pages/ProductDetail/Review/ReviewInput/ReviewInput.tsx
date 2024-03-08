import { SearchSeriesResponse$detail } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import styles from './ReviewInput.module.scss';
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import { first } from '@/utils/collection';
import { url } from '@/utils/url';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import classNames from 'classnames';
import { Anchor } from '@/components/pc/ui/links';
import { Button } from '@/components/pc/ui/buttons';
import { Checkbox } from '@/components/pc/ui/controls/checkboxes';
import { ReviewStartSelect } from '../ReviewStartSelect';
import {
	ReviewResponseStatusType,
	ReviewStateType,
} from '@/models/api/review/SearchReviewResponse';
import { Trans, useTranslation } from 'react-i18next';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import {
	REVIEW_CONTENT_MAX,
	REVIEW_CONTENT_MIN,
	REVIEW_USE_PURPOSE_MAX,
	createAddParams,
} from '@/utils/domain/review';
import { assertNotNull } from '@/utils/assertions';
import { addReview } from '@/api/services/review/review';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { htmlEscape } from '@/utils/string';

type Props = {
	seriesResponse: SearchSeriesResponse$detail;
	type: ReviewStateType;
};

export const ReviewInput: React.VFC<Props> = ({ seriesResponse, type }) => {
	const series = first(seriesResponse.seriesList);
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
			console.log(error);
		}
	}, [usePurpose, content, termsCheck, score, auth, series, showMessage, t]);

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
					<span>{t('pages.productDetail.review.reviewInput.title')}</span>
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
									{t('pages.productDetail.review.reviewInput.starbox')}
									<span>
										{isOriginalType
											? t('pages.productDetail.review.reviewInput.choose')
											: t('pages.productDetail.review.reviewInput.chooseStar')}
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
											<Trans i18nKey="pages.productDetail.review.reviewInput.usePurpose">
												<span />
											</Trans>
										</dt>
										<dd>
											<div className={classNames(styles.inp, styles.s)}>
												<p className={styles.textLength}>
													<strong>{usePurpose.length}</strong>
													{t(
														'pages.productDetail.review.reviewInput.usePurposeTextLength'
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
											<Trans i18nKey="pages.productDetail.review.reviewInput.content">
												<span className={styles.tRed} />
											</Trans>
										</dt>
										<dd>
											<div className={classNames(styles.inp, styles.m)}>
												<p className={styles.textLength}>
													<strong>{content.length}</strong>
													{t(
														'pages.productDetail.review.reviewInput.contentTextLength'
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
												'pages.productDetail.review.reviewInput.infoList.first'
											)}
										</li>
										<li>
											{t(
												'pages.productDetail.review.reviewInput.infoList.second'
											)}
										</li>
										<li>
											{t(
												'pages.productDetail.review.reviewInput.infoList.third'
											)}
										</li>
									</ul>
								</div>
							</>
						)}
						<div className={styles.termsBox}>
							<Checkbox
								className={styles.reviewTermsChk}
								checked={termsCheck}
								onChange={() => {
									setTermsCheck(prev => !prev);
								}}
							>
								{t('pages.productDetail.review.reviewInput.termsArgree')}
							</Checkbox>

							<Anchor
								href={url.terms}
								target="_blank"
								className={styles.reviewTerms}
							>
								<strong>
									{t('pages.productDetail.review.reviewInput.terms')}
								</strong>
							</Anchor>
						</div>
					</div>
				</div>
				<div className={styles.footer}>
					<div className={styles.btnGroup}>
						<Button
							size="m"
							onClick={onClickAddHandler}
							className={isOriginalType ? styles.normal : styles.noneTdeco}
						>
							{t('pages.productDetail.review.reviewInput.add')}
						</Button>
						<Button
							size="m"
							onClick={() => {
								window.close();
							}}
							className={isOriginalType ? styles.normal : styles.noneTdeco}
						>
							{t('pages.productDetail.review.reviewInput.close')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

ReviewInput.displayName = 'ReviewInput';
