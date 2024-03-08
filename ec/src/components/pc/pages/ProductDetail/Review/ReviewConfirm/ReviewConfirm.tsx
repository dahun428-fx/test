import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import styles from './ReviewConfirm.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ReviewStartSelect } from '../ReviewStartSelect';
import { ChangeEvent, useCallback, useRef } from 'react';
import { Button } from '@/components/pc/ui/buttons';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';

type Props = {
	isOriginalType: boolean;
	productImageUrl: string;
	series: Series;
	score: number;
	setScore: (score: number) => void;
	usePurpose: string;
	content: string;
	onChangeUsePurpose: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onChangeContent: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onClickModifyHandler: () => void;
};

export const ReviewConfirm: React.VFC<Props> = ({
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
}) => {
	const [t] = useTranslation();

	const ref = useRef<HTMLDivElement | null>(null);

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
