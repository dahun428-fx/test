import React, { useMemo, useState } from 'react';
import { Tab, Tabs } from './Tabs';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { Catalog } from '@/components/pc/pages/ProductDetail/Catalog';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { ectLogger } from '@/logs/ectLogger';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import type { TabId } from '@/models/domain/series/tab';

export type Props = {
	series: Series;
	tabList: { id: TabId; html?: string }[];
	initialTabId?: TabId;
};

export const ProductDetailTabContents: React.VFC<Props> = ({
	series,
	tabList,
	// このように初期値を迂闊に与えると、このコンポーネントが unmount されずに再利用された時、
	// 問題が出る可能性がある。注意されたし。関連: https://tickets.tools.misumi.jp/jira/browse/NEW_FE-3770
	initialTabId = tabList[0]?.id ?? '',
}) => {
	const { translateTab } = useTabTranslation();
	const [selectedId, setSelectedId] = useState(initialTabId);

	const sendLog = (tabId: TabId) => {
		ectLogger.tab.change({
			brandCode: series.brandCode,
			seriesCode: series.seriesCode,
			tabId,
		});
	};

	const handleChange = (value: string) => {
		// NOTE: Using "as" is not recommended. ここでは value が TabId であると保証できるため使用しています。
		const tabId = value as TabId;
		setSelectedId(tabId);
		sendLog(tabId);
	};

	const handleClickLink = (value: string) => {
		// NOTE: Using "as" is not recommended. ここでは value が TabId であると保証できるため使用しています。
		sendLog(value as TabId);
	};

	const tabContentList: Tab[] = useMemo(
		() =>
			tabList.map(tab => {
				const panel =
					tab.id === 'catalog' ? (
						<Catalog
							displayHeader={false}
							fullWidthView={true}
							stickyBottomBoundary="#catalog-tabPanelContents"
							preferredViewerSize="small"
						/>
					) : tab.html ? (
						<LegacyStyledHtml html={tab.html} isDetail isWysiwyg />
					) : undefined;

				const href =
					tab.id === 'technicalInformation'
						? series.technicalInfoUrl
						: `?Tab=${tab.id}`;

				return {
					value: tab.id,
					type: tab.id === 'technicalInformation' ? 'link' : 'normal',
					href,
					tab: translateTab(tab.id),
					panel,
				};
			}),
		[series.technicalInfoUrl, tabList, translateTab]
	);

	return (
		<Tabs
			tabList={tabContentList}
			value={selectedId}
			onChange={handleChange}
			onClickLink={handleClickLink}
		/>
	);
};
ProductDetailTabContents.displayName = 'ProductDetailTabContents';
