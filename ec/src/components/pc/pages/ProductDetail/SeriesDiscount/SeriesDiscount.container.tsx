import { VFC } from 'react';
import { useSelector } from 'react-redux';
import { SeriesDiscount as Presenter } from '@/components/pc/domain/series/SeriesDiscount';
import { Flag } from '@/models/api/Flag';
import { selectSeries } from '@/store/modules/pages/productDetail';

/** Series discount container */
export const SeriesDiscount: VFC = () => {
	const { pictList, cValueFlag } = useSelector(selectSeries);

	if (Flag.isFalse(cValueFlag)) {
		return null;
	}

	return <Presenter pictList={pictList} />;
};
SeriesDiscount.displayName = 'SeriesDiscount';
