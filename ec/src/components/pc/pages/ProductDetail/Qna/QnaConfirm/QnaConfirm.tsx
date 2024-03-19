import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import classNames from 'classnames';
import { ChangeEvent, MouseEvent, useCallback, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './QnaConfirm.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { openSubWindow } from '@/utils/window';
import { Button } from '@/components/pc/ui/buttons';

type Props = {
	productImageUrl: string;
	series: Series;
	partNo: string;
	question: string;
	usePurpose: string;
	onChangePartNo: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onChangeQuestion: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onChangeUsePurpose: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onClickModifyHandler: () => void;
};

export const QnaConfirm: React.VFC<Props> = ({
	productImageUrl,
	series,
	partNo,
	question,
	usePurpose,
	onChangeQuestion,
	onChangePartNo,
	onChangeUsePurpose,
	onClickModifyHandler,
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

	const onClickHandler = (event: MouseEvent) => {
		event.preventDefault();
		return openSubWindow(
			'/guide/category/ecatalog/estimate.html?bid=bid_pdct_kr_ec_44944_27',
			'guide',
			{ width: 800, height: 600 }
		);
	};

	return (
		<div className={classNames(styles.container)} ref={ref}>
			<div className={styles.header}>
				<h1>
					<span className={styles.misumiLogo}></span>
				</h1>
				<h2>
					<span>{t('pages.productDetail.qna.qnaConfirm.title')}</span>
				</h2>
			</div>
			<div className={styles.main}>
				<div className={styles.top}>
					<div className={styles.productQna}>
						<div className={styles.prdImg}>
							<p>
								<ProductImage
									imageUrl={productImageUrl}
									size={75}
									comment={series.seriesName}
									preset="product_main"
								/>
							</p>
						</div>
						<div className={styles.prdInfo}>
							<h3>{series.seriesName}</h3>
							<div className={styles.yourThing}>
								<p>
									<Trans i18nKey="pages.productDetail.qna.qnaConfirm.assist">
										<br />
										<a
											href="/guide/category/ecatalog/estimate.html?bid=bid_pdct_kr_ec_44944_27"
											onClick={event => onClickHandler(event)}
										/>
									</Trans>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.contentWrap}>
					<div className={styles.content}>
						<div className={styles.formWrap}>
							<dl className={styles.titBlock} style={{ display: 'none' }}>
								<dt>
									<Trans i18nKey="pages.productDetail.qna.qnaConfirm.usePurpose">
										<span />
									</Trans>
								</dt>
								<dd>
									<div className={classNames(styles.inp, styles.s)}>
										<p className={styles.textLength}>
											<strong>{usePurpose.length}</strong>
											{t('pages.productDetail.qna.qnaConfirm.usePurposeLength')}
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
									<Trans i18nKey="pages.productDetail.qna.qnaConfirm.partNo">
										<span className={styles.tRed} />
									</Trans>
									<div className={styles.tRed}>
										{t('pages.productDetail.qna.qnaConfirm.partNoInfo')}
									</div>
								</dt>
								<dd>
									<div className={classNames(styles.inp, styles.s)}>
										<p className={styles.textLength}>
											<strong>{partNo.length}</strong>
											{t('pages.productDetail.qna.qnaConfirm.partNoLength')}
										</p>
										<textarea
											cols={30}
											rows={10}
											maxLength={100}
											value={partNo}
											onChange={event => onChangePartNo(event)}
										></textarea>
									</div>
								</dd>
							</dl>
							<dl className={styles.titBlock}>
								<dt>
									<Trans i18nKey="pages.productDetail.qna.qnaConfirm.question">
										<span className={styles.tRed} />
									</Trans>
								</dt>
								<dd>
									<div className={classNames(styles.inp, styles.m)}>
										<p className={styles.textLength}>
											<strong>{question.length}</strong>
											{t('pages.productDetail.qna.qnaConfirm.questionLength')}
										</p>
										<textarea
											cols={30}
											rows={10}
											maxLength={1000}
											value={question}
											onChange={event => onChangeQuestion(event)}
										></textarea>
									</div>
								</dd>
							</dl>
						</div>
						<div className={styles.infoList}>
							<ul>
								<li>{t('pages.productDetail.qna.qnaInput.infoList.first')}</li>
								<li>{t('pages.productDetail.qna.qnaInput.infoList.second')}</li>
								<li>{t('pages.productDetail.qna.qnaInput.infoList.third')}</li>
								<li>{t('pages.productDetail.qna.qnaInput.infoList.fourth')}</li>
							</ul>
						</div>
					</div>
				</div>
				<div className={styles.footer}>
					<div className={styles.btnGroup}>
						<Button size="m" onClick={onClickModifyHandler}>
							{t('pages.productDetail.qna.qnaConfirm.add')}
						</Button>
						<Button
							size="m"
							onClick={() => {
								window.close();
							}}
						>
							{t('pages.productDetail.qna.qnaConfirm.close')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

QnaConfirm.displayName = 'QnaConfirm';
