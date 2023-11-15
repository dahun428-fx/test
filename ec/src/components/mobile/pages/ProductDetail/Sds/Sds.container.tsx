import { VFC } from 'react';
import { useSelector } from 'react-redux';
import { Sds as Presenter } from './Sds';
import { selectSeries } from '@/store/modules/pages/productDetail';

export const Sds: VFC = () => {
	const series = useSelector(selectSeries);

	if (!series.msdsList.length) {
		return null;
	}

	return <Presenter msdsList={series.msdsList} />;
};
