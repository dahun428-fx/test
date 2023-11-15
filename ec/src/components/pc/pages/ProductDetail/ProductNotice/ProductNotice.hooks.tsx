import { useSelector } from 'react-redux';
import {
	selectCompletedPartNumber,
	selectSeries,
} from '@/store/modules/pages/productDetail';

export const useProductNotice = () => {
	// 型番が1件に絞り込まれ、型番確定している場合のみ型番の情報を返す。それ以外は null を返す。
	const completedPartNumber = useSelector(selectCompletedPartNumber);
	const series = useSelector(selectSeries);
	const { digitalBookList, seriesNoticeText, seriesName } = series;

	return { digitalBookList, seriesNoticeText, seriesName, completedPartNumber };
};
