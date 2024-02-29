import { useTranslation } from 'react-i18next';
import styles from './ReviewOrder.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { SearchReviewRequest } from '@/models/api/review/SearchReviewRequest';
import { ReviewSortType } from '@/models/api/review/SearchReviewResponse';
import { getPageSize } from '@/utils/domain/review';
import { useSelector } from '@/store/hooks';
import { selectAuth } from '@/store/modules/auth';
import { useLoginModal } from '@/components/pc/modals/LoginModal';

type Props = {
	loading: boolean;
	authenticated: boolean;
	reviewState: number;
	onReload: (
		request: Omit<SearchReviewRequest, 'series_code'>
	) => Promise<void>;
};

export const ReviewOrder: React.VFC<Props> = ({
	reviewState,
	authenticated,
	onReload,
	loading,
}) => {
	const auth = useSelector(selectAuth);
	const showLoginModal = useLoginModal();

	const [t] = useTranslation();

	if (reviewState < 1) {
		return null;
	}

	const onClickSort = async (sortType: ReviewSortType) => {
		if (loading) {
			return;
		}

		if (sortType === ReviewSortType.MY_REVIEW) {
			if (!authenticated) {
				const result = await showLoginModal();
				if (result !== 'LOGGED_IN') {
					return;
				}
			}
			if (!auth.userCode) {
				return;
			}
		}
		await onReload({
			order_type: sortType,
			reg_id: auth.userCode ?? '',
		});
	};

	return (
		<div className={styles.containerWrap}>
			<span className={styles.sort}>
				<span onClick={() => onClickSort(ReviewSortType.ORDER_BY_RATE)}>
					{t('pages.productDetail.review.reviewOrder.orderByRate')}
				</span>
				{reviewState !== 1 && (
					<span onClick={() => onClickSort(ReviewSortType.ORDER_BY_RECOMMEND)}>
						{t('pages.productDetail.review.reviewOrder.orderByRecommend')}
					</span>
				)}
				<span onClick={() => onClickSort(ReviewSortType.ORDER_BY_DATE)}>
					{t('pages.productDetail.review.reviewOrder.orderByDate')}
				</span>
				<span onClick={() => onClickSort(ReviewSortType.ORDER_BY_LOW_RATE)}>
					{t('pages.productDetail.review.reviewOrder.orderByLowRate')}
				</span>
				<span onClick={() => onClickSort(ReviewSortType.MY_REVIEW)}>
					{t('pages.productDetail.review.reviewOrder.myReview')}
				</span>
			</span>
			<Button
				size="m"
				theme="strong"
				className={styles.writeButton}
				icon="apply-sample"
			>
				{t('pages.productDetail.review.reviewOrder.writeReview')}
			</Button>
		</div>
	);
};

ReviewOrder.displayName = 'ReviewOrder';
