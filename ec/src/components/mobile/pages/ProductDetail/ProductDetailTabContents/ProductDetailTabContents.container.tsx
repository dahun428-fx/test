import React, { useMemo } from 'react';
import { ProductDetailTabContents as Presenter } from './ProductDetailTabContents';
import { Tab } from './Tabs/types';
import { useSelector } from '@/store/hooks';
import { selectSeries } from '@/store/modules/pages/productDetail';

type Props = {
	tabList: Tab[];
	tab?: string;
};

export const ProductDetailTabContents: React.VFC<Props> = ({
	tabList,
	tab: rawTab,
}) => {
	const tabId = useMemo(() => {
		// クエリパラメータにタブパラメータが存在した際のチェック
		if (rawTab && rawTab === 'catalog') {
			return 'catalog';
		} else {
			return undefined;
		}
	}, [rawTab]);
	const series = useSelector(selectSeries);

	return <Presenter series={series} tabList={tabList} initialTabId={tabId} />;
};
ProductDetailTabContents.displayName = 'ProductDetailTabContents';
