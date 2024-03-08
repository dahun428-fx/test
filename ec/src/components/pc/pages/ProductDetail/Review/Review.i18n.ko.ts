import { Translation } from '@/i18n/types';
import { reviewProductRating } from './ReviewProductRating/ReviewProductRating.i18n.ko';
import { reviewOrder } from './ReviewOrder/ReviewOrder.i18n.ko';
import { reviewItem } from './ReviewItem/ReviewItem.i18n.ko';
import { reviewList } from './ReviewList/ReviewList.i18n.ko';
import { reviewInput } from './ReviewInput/ReviewInput.i18n.ko';
import { reviewConfirm } from './ReviewConfirm/ReviewConfirm.i18n.ko';
import { reviewReport } from './ReviewReport/ReviewReport.i18n.ko';

export const review: Translation = {
	title: '상품리뷰',
	totalCount: '| {{totalCount}}건',
	reviewProductRating,
	reviewOrder,
	reviewItem,
	reviewList,
	reviewInput,
	reviewConfirm,
	reviewReport,
};
