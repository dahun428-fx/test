import React, { useMemo } from 'react';
import { TabList } from './TabList';
import { Tab, TabContent } from './types';
import { Catalog } from '@/components/mobile/pages/ProductDetail/Catalog';
import { PartNumberList } from '@/components/mobile/pages/ProductDetail/PartNumberList';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';

type Props = {
	tabList: Tab[];
	selectedValue: string;
	onChange: (value: string) => void;
};

export const Tabs: React.VFC<Props> = ({
	tabList,
	selectedValue,
	onChange,
}) => {
	const { translateTab } = useTabTranslation();

	const tabContentList: TabContent[] = useMemo(
		() =>
			tabList.map(tab => {
				return {
					value: tab.tabId,
					tab: translateTab(tab.tabId),
					href: `?Tab=${tab.tabId}`,
				};
			}),
		[tabList, translateTab]
	);

	return (
		<>
			<TabList
				tabList={tabContentList}
				value={selectedValue}
				onChange={onChange}
			/>
			{selectedValue === 'codeList' && <PartNumberList />}
			{selectedValue === 'catalog' && <Catalog />}
		</>
	);
};
Tabs.displayName = 'Tabs';
