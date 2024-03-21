import { ChangeEvent, useCallback, useRef } from 'react';
import styles from './QnaReport.module.scss';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button } from '@/components/pc/ui/buttons';
import { ReportDeclareDetail } from '@/models/api/qna/SearchQnaResponse';

type Props = {
	declareData: ReportDeclareDetail[];
	selectedDeclareCode: string;
	setSelectedDeclareCode: (selectedDeclareCode: string) => void;
	declareText: string;
	declareTextAvailable: boolean;
	onChangeTextArea: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	onClickReportExcuteHandler: () => void;
};

export const QnaReport: React.VFC<Props> = ({
	declareData,
	declareText,
	declareTextAvailable,
	onChangeTextArea,
	onClickReportExcuteHandler,
	selectedDeclareCode,
	setSelectedDeclareCode,
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
		<div className={styles.container} ref={ref}>
			<div className={styles.header}>
				<h1>
					<span className={styles.misumiLogo}></span>
				</h1>
				<h2>
					<span>{t('pages.productDetail.qna.qnaReport.title')}</span>
				</h2>
			</div>
			<div className={styles.main}>
				<div className={styles.top}>
					<div className={styles.dangerList}>
						<ul>
							<li>{t('pages.productDetail.qna.qnaReport.dangerList.first')}</li>
							<li>
								{t('pages.productDetail.qna.qnaReport.dangerList.second')}
							</li>
						</ul>
					</div>
				</div>
				<div className={styles.contentWrap}>
					<div className={styles.content}>
						<div className={styles.formWrap}>
							<dl className={styles.titBlock}>
								<dt>
									<Trans i18nKey="pages.productDetail.qna.qnaReport.declareTitle">
										<span className={styles.tRed} />
									</Trans>
								</dt>
								<dd>
									<ul className={styles.declareList}>
										{declareData &&
											declareData.length > 0 &&
											declareData.map(item => {
												return (
													<li key={item.code}>
														<label
															className={classNames(styles.radio, styles.t1)}
														>
															<input
																type="radio"
																value={item.code}
																name="radio_qna_declare"
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
									{t('pages.productDetail.qna.qnaReport.declareTextLength')}
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
							{t('pages.productDetail.qna.qnaReport.report')}
						</Button>
						<Button
							size="m"
							className={styles.noneTdeco}
							onClick={() => {
								window.close();
							}}
						>
							{t('pages.productDetail.qna.qnaReport.close')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

QnaReport.displayName = 'QnaReport';