import { Translation } from '@/i18n/types';
import { reviewProductRating } from './ReviewProductRating/ReviewProductRating.i18n.ko';
import { reviewOrder } from './ReviewOrder/ReviewOrder.i18n.ko';
import { reviewItem } from './ReviewItem/ReviewItem.i18n.ko';
import { reviewList } from './ReviewList/ReviewList.i18n.ko';

export const review: Translation = {
	title: '상품리뷰',
	reviewCount: '| {{reviewCount}}건',
	reviewProductRating,
	reviewOrder,
	reviewItem,
	reviewList,
};
