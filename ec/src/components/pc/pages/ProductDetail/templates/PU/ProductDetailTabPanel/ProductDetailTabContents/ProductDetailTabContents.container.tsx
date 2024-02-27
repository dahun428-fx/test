import React from 'react';
import { ProductDetailTabContents as Presenter } from './ProductDetailTabContents';
import type { TabId } from '@/models/domain/series/tab';
import { useSelector } from '@/store/hooks';
import {
	selectPUTabList,
	selectSeries,
} from '@/store/modules/pages/productDetail';

type Props = {
	tabId?: TabId;
};

export const ProductDetailTabContents: React.VFC<Props> = ({ tabId }) => {
	const { tabList } = useSelector(selectPUTabList);
	const series = useSelector(selectSeries);

	return <Presenter series={series} tabList={tabList} initialTabId={tabId} />;
};
ProductDetailTabContents.displayName = 'ProductDetailTabContents';
