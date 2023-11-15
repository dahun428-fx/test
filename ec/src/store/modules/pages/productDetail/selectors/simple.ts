import { createSelector } from '@reduxjs/toolkit';
import { selectPartNumberResponse, selectSeries } from './shared';
import { Flag } from '@/models/api/Flag';
import { SpecType } from '@/models/api/constants/SpecType';
import { TabType } from '@/models/api/msm/ect/series/shared';
import type { TabId } from '@/models/domain/series/tab';
import { tabConfig } from '@/models/domain/series/tab';
import { notNull } from '@/utils/predicate';

/** Max specs to display on part number list in simple series view */
const MAX_SPECS = 6;

/** Spec list of part number list on in simple series view */
export const selectSimplePartNumberSpecList = createSelector(
	[selectPartNumberResponse],
	response => {
		if (!response || !response.specList) {
			return [];
		}

		const { specList, partNumberSpecList } = response;

		// ect-web-my の getPartNumberSpecListSpecified を参照して実装しています。
		if (response.simpleProductSpecCodeList) {
			return response.simpleProductSpecCodeList
				.map(specCode => {
					const spec = specList.find(spec => spec.specCode === specCode);
					const partNumberSpec = partNumberSpecList.find(
						partNumberSpec => partNumberSpec.specCode === specCode
					);
					return spec &&
						partNumberSpec?.specValueList &&
						partNumberSpec.specValueList.length > 0
						? spec
						: null;
				})
				.filter(notNull)
				.slice(0, MAX_SPECS);
		}

		const remainedSpecList = partNumberSpecList
			.filter(partNumberSpec =>
				// いずれか表示するスペック値がある
				// NOTE: 画面設計書によると、もしかすると子スペックの非表示フラグも含めて見る必要があるのかもしれない。
				partNumberSpec.specValueList.some(spec => Flag.isFalse(spec.hiddenFlag))
			)
			.map(partNumberSpec =>
				specList.find(spec => partNumberSpec.specCode === spec.specCode)
			)
			// スペックリストにある
			.filter(notNull);

		// Amount of content spec list
		// 内容量スペックリスト
		const contentSpecList = remainedSpecList.filter(
			spec => spec.specType === SpecType.E999
		);

		// other spec list
		// 他のスペックリスト
		const otherSpecList = remainedSpecList.filter(
			spec => spec.specType !== SpecType.E999
		);

		return [...contentSpecList, ...otherSpecList].slice(0, MAX_SPECS);
	}
);

export const selectTabList = createSelector([selectSeries], series => {
	// if unknown tabType, draw with VONA pattern (ect-web-my's fallback logic on 2022/8/25)
	const tabList = tabConfig[series.tabType] ?? tabConfig[TabType.VONA];

	/** 結合したHTMLとタブIDのリスト */
	const tabHtmlList = tabList
		.map(tab => ({
			id: tab.tabId,
			html:
				'htmlNameList' in tab
					? tab.htmlNameList.map(htmlName => series[htmlName] ?? '').join('')
					: undefined,
		}))
		.filter(
			// カタログと技術情報以外は HTML 必須
			tab =>
				tab.id === 'catalog' || tab.id === 'technicalInformation' || tab.html
		)
		.filter(
			// 技術情報の場合は technicalInfoUrl 必須
			tab => tab.id !== 'technicalInformation' || series.technicalInfoUrl
		)
		.filter(
			// カタログの場合は digitalBookList[0] 必須
			tab =>
				tab.id !== 'catalog' ||
				(series.digitalBookList && series.digitalBookList.length > 0)
		);

	/** 左端に表示すると定義されているタブ */
	const firstTabId: TabId = tabList[0].tabId;
	if (
		tabHtmlList.every(tabHtml => tabHtml.id !== firstTabId) &&
		tabHtmlList.some(tabHtml => tabHtml.id === 'catalog')
	) {
		// 左端に表示すると定義されているタブのコンテンツHTMLが存在しない場合、
		// カタログタブを左端に移動する。
		return {
			tabList: [
				tabHtmlList.find(tabHtml => tabHtml.id === 'catalog'),
				...tabHtmlList.filter(tabHtml => tabHtml.id !== 'catalog'),
			].filter(notNull),
		};
	}

	return { tabList: tabHtmlList };
});
