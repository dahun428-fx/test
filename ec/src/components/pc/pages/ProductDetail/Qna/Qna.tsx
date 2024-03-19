import { SearchQnaRequest } from '@/models/api/qna/SearchQnaRequest';
import styles from './Qna.module.scss';
import { DETAIL_QNA_AREA_ID } from './QnaProductTop/QnaProductTop';
import { QnaDetail } from '@/models/api/qna/SearchQnaResponse';
import { useTranslation } from 'react-i18next';
import { QnaOrder } from './QnaOrder';
import { QnaList } from './QnaList';
import { useCallback } from 'react';
import { scrollToElement } from '@/utils/scrollIntoView';

type Props = {
	seriesCode: string;
	loading: boolean;
	authenticated: boolean;
	onReload: (request: Omit<SearchQnaRequest, 'series_code'>) => Promise<void>;
	page: number;
	pageSize: number;
	totalCount: number;
	qnaState: number;
	qnaDetails: QnaDetail[];
	qnaCount: number;
};

export const Qna: React.VFC<Props> = ({
	seriesCode,
	loading,
	authenticated,
	onReload,
	page,
	pageSize,
	totalCount,
	qnaState,
	qnaDetails,
	qnaCount,
}) => {
	const [t] = useTranslation();

	const handleReload = useCallback(
		async request => {
			await scrollToElement(DETAIL_QNA_AREA_ID);
			await onReload(request);
		},
		[onReload]
	);

	return (
		<section id={DETAIL_QNA_AREA_ID}>
			<div className={styles.headerWrap}>
				<hgroup>
					<h2 className={styles.title}>{t('pages.productDetail.qna.title')}</h2>
					<span className={styles.count}>
						{t('pages.productDetail.qna.qnaCount', { qnaCount })}
					</span>
					<QnaOrder
						authenticated={authenticated}
						loading={loading}
						onReload={handleReload}
						qnaState={qnaState}
						seriesCode={seriesCode}
					/>
					<div></div>
				</hgroup>
			</div>
			<div className={styles.alertBox}>
				<ul>
					<li>{t('pages.productDetail.qna.alert.first')}</li>
					<li>{t('pages.productDetail.qna.alert.second')}</li>
					<li>{t('pages.productDetail.qna.alert.third')}</li>
					<li>{t('pages.productDetail.qna.alert.fourth')}</li>
				</ul>
			</div>
			<QnaList
				loading={loading}
				onReload={handleReload}
				page={page}
				pageSize={pageSize}
				qnaDetails={qnaDetails}
				qnaState={qnaState}
				seriesCode={seriesCode}
				totalCount={totalCount}
			/>
		</section>
	);
};

Qna.displayName = 'Qna';
