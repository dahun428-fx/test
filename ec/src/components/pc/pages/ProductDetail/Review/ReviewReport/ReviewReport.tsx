import { Trans, useTranslation } from 'react-i18next';
import styles from './ReviewReport.module.scss';
import classNames from 'classnames';
import { Button } from '@/components/pc/ui/buttons';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import {
	REPORT_DIRECT_WRITE_CODE,
	REVIEW_REPORT_MAX,
	createReportParams,
} from '@/utils/domain/review';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { addReviewReport } from '@/api/services/review/review';
import {
	ReportDeclareDetail,
	SearchReviewResponse,
} from '@/models/api/review/SearchReviewResponse';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/store/modules/auth';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { assertNotNull } from '@/utils/assertions';
import { htmlEscape } from '@/utils/string';

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
	const ref = useRef<HTMLDivElement | null>(null);

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
		<div className={styles.container} ref={ref}>
			<div className={styles.header}>
				<h1>
					<span className={styles.misumiLogo}></span>
				</h1>
				<h2>
					<span>{t('pages.productDetail.review.reviewReport.title')}</span>
				</h2>
			</div>
			<div className={styles.main}>
				<div className={styles.top}>
					<div className={styles.dangerList}>
						<ul>
							<li>
								{t('pages.productDetail.review.reviewReport.dangerList.first')}
							</li>
							<li>
								{t('pages.productDetail.review.reviewReport.dangerList.second')}
							</li>
						</ul>
					</div>
				</div>
				<div className={styles.contentWrap}>
					<div className={styles.content}>
						<div className={styles.formWrap}>
							<dl className={styles.titBlock}>
								<dt>
									<Trans i18nKey="pages.productDetail.review.reviewReport.declareTitle">
										<span className={styles.tRed} />
									</Trans>
								</dt>
								<dd>
									<ul className={styles.declareList}>
										{declareData.length > 0 &&
											declareData.map(item => {
												return (
													<li key={item.code}>
														<label
															className={classNames(styles.radio, styles.t1)}
														>
															<input
																type="radio"
																value={item.code}
																name="radio_review_declare"
																checked={selectedDeclareCode === item.code}
																onChange={() => {
																	setSelectedDeclareCode(item.code);
																}}
															/>
															<span>{item.explain}</span>
														</label>
													</li>
												);
											})}
									</ul>
								</dd>
							</dl>
							<div className={classNames(styles.inp, styles.m)}>
								<p className={styles.textLength}>
									<strong>{declareText.length}</strong>
									{t(
										'pages.productDetail.review.reviewReport.declareTextLength'
									)}
								</p>
								<textarea
									cols={30}
									rows={10}
									maxLength={30}
									disabled={!declareTextAvailable}
									onChange={event => onChangeTextArea(event)}
									value={declareText}
								></textarea>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.footer}>
					<div className={styles.btnGroup}>
						<Button
							size="m"
							className={styles.noneTdeco}
							onClick={onClickReportExcuteHandler}
						>
							{t('pages.productDetail.review.reviewReport.report')}
						</Button>
						<Button
							size="m"
							className={styles.noneTdeco}
							onClick={() => {
								window.close();
							}}
						>
							{t('pages.productDetail.review.reviewReport.close')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

ReviewReport.displayName = 'ReviewReport';
