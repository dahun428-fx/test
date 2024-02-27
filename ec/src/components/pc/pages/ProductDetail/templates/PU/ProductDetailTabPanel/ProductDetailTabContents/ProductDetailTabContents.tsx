import React, { useMemo, useState } from 'react';
import { Tab, Tabs } from './Tabs';
import { LegacyStyledHtml } from '@/components/pc/domain/LegacyStyledHtml';
import { CadPreview } from '@/components/pc/pages/ProductDetail/CadPreview';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { aa } from '@/logs/analytics/adobe';
import { ectLogger } from '@/logs/ectLogger';
import type { TabId } from '@/models/domain/series/tab';
import type { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';

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
		aa.events.tabClick(tabId);
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
					tab.id === 'cadPreview' ? (
						<CadPreview
							brandCode={series.brandCode}
							seriesCode={series.seriesCode}
							cadDownloadButtonType={series.cadDownloadButtonType}
							brandName={series.brandName}
							seriesName={series.seriesName}
						/>
					) : tab.html ? (
						<LegacyStyledHtml html={tab.html} isDetail isPu isWysiwyg />
					) : undefined;

				const href =
					tab.id === 'technicalInformation' ? series.technicalInfoUrl : ``;

				return {
					value: tab.id,
					type: tab.id === 'technicalInformation' ? 'link' : 'normal',
					href,
					tab: translateTab(tab.id),
					panel,
				};
			}),
		[
			series.brandCode,
			series.brandName,
			series.cadDownloadButtonType,
			series.seriesCode,
			series.seriesName,
			series.technicalInfoUrl,
			tabList,
			translateTab,
		]
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
