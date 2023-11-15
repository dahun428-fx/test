import React, { useState } from 'react';
import { Tabs } from './Tabs';
import { TabId, Tab } from './Tabs/types';
import { aa } from '@/logs/analytics/adobe';
import { ectLogger } from '@/logs/ectLogger';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

export type Props = {
	series: Series;
	tabList: Tab[];
	initialTabId?: TabId;
};

export const ProductDetailTabContents: React.VFC<Props> = ({
	series,
	tabList,
	initialTabId = tabList[0]?.tabId ?? '',
}) => {
	const [selectedId, setSelectedId] = useState(initialTabId);
	const handleChange = (value: string) => {
		// NOTE: Using "as" is not recommended. ここでは value が TabId であると保証できるため使用しています。
		const tabId = value as TabId;
		setSelectedId(tabId);
		if (tabId === 'catalog') {
			aa.events.sendCatalogTab();
		}
		ectLogger.tab.change({
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			tabId,
		});
	};

	return (
		<Tabs
			tabList={tabList}
			selectedValue={selectedId}
			onChange={handleChange}
		/>
	);
};
ProductDetailTabContents.displayName = 'ProductDetailTabContents';
