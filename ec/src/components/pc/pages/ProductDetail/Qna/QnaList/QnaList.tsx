import { SearchQnaRequest } from '@/models/api/qna/SearchQnaRequest';
import styles from './QnaList.module.scss';
import { QnaDetail } from '@/models/api/qna/SearchQnaResponse';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { Pagination } from '@/components/pc/ui/paginations';
import classNames from 'classnames';
import { QnaItem } from '../QnaItem';
import { useSelector } from 'react-redux';
import { selectQnaResponse } from '@/store/modules/pages/productDetail';

type Props = {
	loading: boolean;
	seriesCode: string;
	qnaState: number;
	qnaDetails: QnaDetail[];
	page: number;
	pageSize: number;
	totalCount: number;
	onReload: (request: Omit<SearchQnaRequest, 'series_code'>) => Promise<void>;
};

export const QnaList: React.VFC<Props> = ({
	loading,
	onReload,
	qnaState,
	seriesCode,
	page,
	pageSize,
	qnaDetails,
	totalCount,
}) => {
	const [t] = useTranslation();

	const pagination = useCallback(
		() => (
			<div className={styles.pagination}>
				<Pagination
					page={page}
					pageSize={pageSize}
					totalCount={totalCount}
					onChange={page => onReload({ page_no: page })}
				/>
			</div>
		),
		[onReload, page, pageSize, totalCount]
	);

	return (
		<div className={styles.container}>
			{!loading && (
				<div className={styles.origin}>
					<ul>
						{qnaDetails && qnaDetails.length > 0 ? (
							qnaDetails.map(item => {
								return (
									<li key={item.qnaId} className={styles.qnaItemWrap}>
										<QnaItem
											onReload={onReload}
											qna={item}
											qnaState={qnaState}
											seriesCode={seriesCode}
										/>
									</li>
								);
							})
						) : (
							<p className={styles.noList}>
								{t('pages.productDetail.qna.qnaList.noQna')}
							</p>
						)}
					</ul>
				</div>
			)}
			{qnaDetails && qnaDetails.length > 0 && pagination()}
		</div>
	);
};

QnaList.displayName = 'QnaList';
