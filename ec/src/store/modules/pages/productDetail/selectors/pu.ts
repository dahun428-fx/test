import { createSelector } from '@reduxjs/toolkit';
import { selectSeries } from './shared';
import { TabType } from '@/models/api/msm/ect/series/shared';
import type { TabId } from '@/models/domain/series/tab';
import { tabConfig } from '@/models/domain/series/tab';
import { notNull } from '@/utils/predicate';

export const selectPUTabList = createSelector([selectSeries], series => {
	const tabList = tabConfig[series.tabType] ?? tabConfig[TabType.PU];
	/** 結合したHTMLとタブIDのリスト */
	const tabHtmlList = tabList
		.map(tab => ({
			id: tab.tabId,
			html:
				'htmlNameList' in tab
					? tab.htmlNameList.map(htmlName => series[htmlName] ?? '').join('')
					: undefined,
		}))
		.filter(tab => !!tab.html);

	// 3dPreviewタブを追加
	// TODO: 他テンプレートと共通化する場合は共通処理部分で3dPReview機能を実装（tabConfigやデータ連動まわりと確認）
	tabHtmlList.splice(0, 0, { id: 'cadPreview', html: undefined });

	/** 左端に表示すると定義されているタブ */
	const firstTabId: TabId = tabList[0].tabId;
	if (tabHtmlList.every(tabHtml => tabHtml.id !== firstTabId)) {
		// 左端に表示すると定義されているタブのコンテンツHTMLが存在しない場合、
		return {
			tabList: [...tabHtmlList].filter(notNull),
		};
	}

	return { tabList: tabHtmlList };
});
