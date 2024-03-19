import { useSelector } from 'react-redux';
import styles from './QnaProductTop.module.scss';
import { selectQnaResponse } from '@/store/modules/pages/productDetail';
import { isAvailaleQnaState } from '@/utils/domain/qna';
import { useTranslation } from 'react-i18next';

export const DETAIL_QNA_AREA_ID = 'qna';

export const QnaProductTop: React.VFC = () => {
	const [t] = useTranslation();

	const qnaResponse = useSelector(selectQnaResponse);

	if (!qnaResponse || !isAvailaleQnaState(qnaResponse.qnaConfig)) {
		return null;
	}

	return (
		<div>
			<a href={`#${DETAIL_QNA_AREA_ID}`} className={styles.qnaTop}>
				{t('pages.productDetail.qna.qnaTop')}
			</a>
		</div>
	);
};

QnaProductTop.displayName = 'QnaProductTop';
