import { SearchQnaRequest } from '@/models/api/qna/SearchQnaRequest';
import { QnaDetail, QnaStateType } from '@/models/api/qna/SearchQnaResponse';
import styles from './QnaItem.module.scss';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { useCallback, useMemo, useState } from 'react';
import { htmlDecode } from '@/utils/string';
import { Button } from '@/components/pc/ui/buttons';
import { dateTime } from '@/utils/date';
import { config } from '@/config';
import { createLikeParams, modUserId } from '@/utils/domain/qna';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { useConfirmModal } from '@/components/pc/ui/modals/ConfirmModal';
import { assertNotNull } from '@/utils/assertions';
import { url } from '@/utils/url';
import { openSubWindow } from '@/utils/window';
import {
	addQnaLike,
	removeQna,
	searchMyQnaCount,
} from '@/api/services/qna/qna';
import { first } from '@/utils/collection';

type Props = {
	qna: QnaDetail;
	qnaState: QnaStateType;
	seriesCode: string;
	onReload: (request: Omit<SearchQnaRequest, 'series_code'>) => Promise<void>;
};

export const QnaItem: React.VFC<Props> = ({
	qna,
	qnaState,
	seriesCode,
	onReload,
}) => {
	const {
		misumiCommentFlag,
		misumiComment,
		misumiCommentDate,
		content,
		partNo,
		regDate,
		regId,
		regName,
		recommendCnt,
		qnaId,
	} = qna;
	const auth = useSelector(selectAuth);
	const showLoginModal = useLoginModal();
	const { showMessage } = useMessageModal();
	const { showConfirm } = useConfirmModal();

	const [recommendActionClick, setRecommendActionClick] = useState(false);
	const [recommendCount, setRecommendCount] = useState(recommendCnt);
	const [answerActionClik, setAnswerActionClick] = useState(false);
	const [t] = useTranslation();

	const isUserQna = useMemo(() => {
		return auth.userCode === qna.regId;
	}, [auth, qna]);

	const hasMisumiContent = useMemo(() => {
		return misumiCommentFlag === 'Y' && !misumiComment;
	}, [qna]);

	const onClickRecommendHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		try {
			assertNotNull(auth.user);

			const request = createLikeParams(qnaId, auth.user, auth.customer);

			const response = await addQnaLike(request);

			if (response.status === 'success') {
				setRecommendActionClick(true);
				setRecommendCount(recommendCount + 1);
			}
		} catch (error) {
			showMessage({
				message: t('pages.productDetail.qna.qnaItem.message.systemError'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaItem.message.close')}</Button>
				),
			});
			console.log(error);
		}
	}, [
		auth,
		recommendActionClick,
		recommendCount,
		showLoginModal,
		showMessage,
		t,
	]);

	const onClickReportHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}
		if (!auth.userCode) {
			return;
		}
		const response = await searchMyQnaCount({
			reg_id: auth.userCode,
			series_code: seriesCode,
			qna_id: qnaId,
		});
		if (response.data && response.data?.length > 0) {
			const reportCnt = first(response.data).reportCnt;
			if (reportCnt >= 1) {
				showMessage({
					message: t('pages.productDetail.qna.qnaItem.message.reported'),
					button: (
						<Button>
							{t('pages.productDetail.qna.qnaItem.message.close')}
						</Button>
					),
				});
				return;
			}

			let option = {
				width: 700,
				height: 600,
				scrollbars: 'yes',
			};
			openSubWindow(url.qnasReportInput(qnaId), 'qna_rep_input', option);
		}
	}, [showLoginModal, searchMyQnaCount, showMessage, t, auth]);

	const onClickModifyHandler = useCallback(async () => {
		if (!auth.authenticated) {
			const result = await showLoginModal();
			if (result !== 'LOGGED_IN') {
				return;
			}
		}

		if (!auth.userCode) {
			return;
		}

		let option = {
			width: 700,
			height: 600,
			scrollbars: 'yes',
		};

		openSubWindow(
			url.qnasConfirm(seriesCode, qnaState, qnaId),
			'qna_confirm',
			option
		);
		(window as any).onQnaReload = async () => await onReload({});
	}, [auth, seriesCode, qnaState, qnaId, onReload, openSubWindow]);

	const onClickDeleteHandler = useCallback(async () => {
		const confirm = await showConfirm({
			message: t('pages.productDetail.qna.qnaItem.confirm.delete'),
			confirmButton: t('pages.productDetail.qna.qnaItem.confirm.yes'),
			closeButton: t('pages.productDetail.qna.qnaItem.confirm.no'),
		});
		if (!confirm) return;

		try {
			await removeQna({ qna_id: qnaId, reg_id: regId, reg_nm: regName });
			await onReload({});
			showMessage({
				message: t('pages.productDetail.qna.qnaItem.message.delete.success'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaItem.message.close')}</Button>
				),
			});
		} catch (error) {
			showMessage({
				message: t('pages.productDetail.qna.qnaItem.message.systemError'),
				button: (
					<Button>{t('pages.productDetail.qna.qnaItem.message.close')}</Button>
				),
			});
			console.log(error);
		}
	}, [removeQna, onReload, qnaId, showMessage, showConfirm, t]);

	return (
		<>
			<div className={styles.qnaTop}>
				<div className={styles.qnaTopLeft}>
					<span className={styles.questionIcon}>
						{t('pages.productDetail.qna.qnaItem.question')}
					</span>
					<span className={styles.gText}>
						<span className={styles.id}>
							{modUserId(regId, regName, auth.userCode ?? '')}
						</span>
						<span>{dateTime(regDate, config.format.date)}</span>
					</span>
				</div>
				<div className={classNames(styles.qnaTopRight, styles.util)}>
					<span className={styles.recommendCount}>
						<Trans i18nKey="pages.productDetail.qna.qnaItem.recommendDisplay">
							<strong>{{ recommendCnt: recommendCount }}</strong>
						</Trans>
					</span>
					{!isUserQna && (
						<>
							{!recommendActionClick ? (
								<span
									className={styles.recommendActionButtonWrap}
									onClick={onClickRecommendHandler}
								>
									<span className={styles.like}>
										{t('pages.productDetail.qna.qnaItem.recommendAction')}
									</span>
								</span>
							) : (
								<span className={styles.recommendActionComplete}>
									{t('pages.productDetail.qna.qnaItem.recommendActionComplete')}
								</span>
							)}
							<span
								className={styles.reportActionButtonWrap}
								onClick={onClickReportHandler}
							>
								<span className={styles.report}>
									{t('pages.productDetail.qna.qnaItem.reportAction')}
								</span>
							</span>
						</>
					)}
				</div>
			</div>
			<div className={styles.qnaText}>
				<p className={styles.title}>{htmlDecode(partNo)}</p>
				<div className={styles.text}>
					<span>{htmlDecode(content)}</span>
				</div>
			</div>
			{isUserQna && (
				<div className={classNames(styles.btnGroup)}>
					<Button size="s" onClick={onClickModifyHandler}>
						{t('pages.productDetail.qna.qnaItem.modify')}
					</Button>
					<Button size="s" onClick={onClickDeleteHandler}>
						{t('pages.productDetail.qna.qnaItem.delete')}
					</Button>
				</div>
			)}
			{hasMisumiContent ? (
				<div className={styles.reply}>
					<span className={styles.misumiIcon}></span>
					<span className={styles.gText}>
						<span>{dateTime(misumiCommentDate ?? '', config.format.date)}</span>
					</span>
					<div className={styles.qnaText}>
						<div className={styles.txt}>{htmlDecode(misumiComment)}</div>
					</div>
					<section className={styles.srtAnswer}>
						<h2 className={styles.h3}>
							{t('pages.productDetail.qna.qnaItem.title')}
						</h2>
						{answerActionClik ? (
							<div className={styles.srtAnswerFinish}>
								<p>{t('pages.productDetail.qna.qnaItem.first')}</p>
								<p>{t('pages.productDetail.qna.qnaItem.second')}</p>
								<p>{t('pages.productDetail.qna.qnaItem.third')}</p>
							</div>
						) : (
							<div className={styles.btnGroup}>
								<Button size="s">
									{t('pages.productDetail.qna.qnaItem.confirm.yes')}
								</Button>
								<Button size="s">
									{t('pages.productDetail.qna.qnaItem.confirm.no')}
								</Button>
							</div>
						)}
					</section>
				</div>
			) : (
				<div className={styles.reply}>
					<div className={styles.qnaText}>
						<span className={styles.misumiIcon}></span>
						<div className={styles.text}>
							{t('pages.productDetail.qna.qnaItem.answer.announce')}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

QnaItem.displayName = 'QnaItem';
