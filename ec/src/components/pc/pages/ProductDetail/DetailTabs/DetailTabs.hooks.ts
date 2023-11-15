import error from 'next/error';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCodeListAnchorCategory } from '@/api/services/legacy/cms/series/getCodeListAnchorCategory';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Logger } from '@/logs/datadog';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TabType } from '@/models/api/msm/ect/series/shared';
import {
	wysiwygTabConfig,
	WysiwygTab,
	HtmlName,
	TabId,
	Tab,
} from '@/models/domain/series/complexTab';
import {
	selectCategoryCodeList,
	selectSeries,
} from '@/store/modules/pages/productDetail';
import { isIntersect } from '@/utils/collection';
import { notNull } from '@/utils/predicate';

type TabHtml = { name: string; html?: string };
type TabContent = {
	tabId: TabId;
	showsOnDetail: boolean;
	htmlList?: TabHtml[];
};
type TabInfo = Record<string, TabContent>;

/**
 * Get tab html list
 * @param series
 * @param tabHtmlList
 * @returns
 */
const getTabHtmlList = (series: Series, tabHtmlList?: Readonly<HtmlName[]>) => {
	const tabHtmlListMap: HtmlName[] = [
		'productDescriptionHtml',
		'specificationsHtml',
		'priceListHtml',
		'daysToShipHtml',
		'alterationHtml',
		'overviewHtml',
		'exampleHtml',
		'generalHtml',
		'standardSpecHtml',
	];
	const result: TabHtml[] = [];

	if (!tabHtmlList) {
		return result;
	}

	tabHtmlList.forEach(tabHtml => {
		const seriesTabHtml = series[tabHtml];

		if (tabHtmlListMap.includes(tabHtml) && seriesTabHtml) {
			result.push({ name: tabHtml, html: seriesTabHtml });
		}
	});

	return result;
};

/**
 * Check if a tabId (without HTML content) can be displayed as a tab or not
 * @param series
 * @param tabId
 * @returns
 */
const isTabView = (series: Series, tabId: TabId) => {
	switch (tabId) {
		case 'codeList':
			return true;
		case 'catalog':
			if (series.digitalBookList?.length || series.externalPdfUrl) {
				return true;
			}
	}

	return false;
};

/**
 * Get tab
 * @param series
 * @param tabTypeInfo
 * @example
 * tabTypeInfo = {
 * 	tabId: 'drawing'
 * 	htmlNameList: ['productDescriptionHtml']
 * }
 */
const getTab = (series: Series, tabTypeInfo: WysiwygTab) => {
	const tabHtmlList = getTabHtmlList(series, tabTypeInfo.htmlNameList);

	if (tabHtmlList.length === 0 && !isTabView(series, tabTypeInfo.tabId)) {
		return null;
	}

	return tabHtmlList;
};

/**
 * Sorting tab
 * @param tabType
 * @param tabInfo
 * @returns
 */
const sortTab = (tabType: Readonly<WysiwygTab[]>, tabInfo: TabInfo) => {
	const firstTabType = tabType[0];

	// tabInfo に該当する tabType の規定の先頭 tabId がなく、且つ catalog データが存在する場合
	// catalog を先頭に配置する
	if (
		firstTabType &&
		!(firstTabType.tabId in tabInfo) &&
		'catalog' in tabInfo
	) {
		const catalogTab = tabInfo.catalog;
		delete tabInfo.catalog;
		return {
			catalog: catalogTab,
			...tabInfo,
		};
	}
	return tabInfo;
};

/** Detail tab hook */
export const useDetailTab = (options: { ignoreTabs?: TabId[] } = {}) => {
	const [categoryList, setCategoryList] = useState<string[]>([]);
	const series = useSelector(selectSeries);
	const categoryCodeList = useSelector(selectCategoryCodeList);

	const tabType =
		series.tabType && wysiwygTabConfig[series.tabType]
			? wysiwygTabConfig[series.tabType]
			: wysiwygTabConfig[TabType.VONA];

	/**
	 * Get detail tab info list
	 */
	const defaultTabInfo = useMemo(() => {
		const tabInfo: TabInfo = {};
		for (const tabTypeInfo of tabType) {
			const tab = getTab(series, tabTypeInfo);
			if (tab) {
				tabInfo[tabTypeInfo.tabId] = {
					tabId: tabTypeInfo.tabId,
					showsOnDetail: true,
					htmlList: tab,
				};
			}
		}

		// NOTE: Following to [EC0803_WYSIWYG Area] doc, with tabType = 5 (PRESS_MOLD_A) or 6 (PRESS_MOLD_B),
		//       if there is no response matched with Drawing (5) or Drawing/Specifications (6),
		//       Catalog tab will be set to the first one.
		if (
			series.tabType === TabType.PRESS_MOLD_A ||
			series.tabType === TabType.PRESS_MOLD_B
		) {
			return sortTab(tabType, tabInfo);
		}

		return tabInfo;
	}, [series, tabType]);

	/**
	 * Check not code list default
	 */
	const isNotPartNumberListDefault: boolean = useMemo(() => {
		// NOTE: 型番リストタブを表示しない場合は、デフォルトであることはないので、常に true を返す
		if (options.ignoreTabs?.includes('codeList')) {
			return true;
		}

		const firstTabType = tabType[0];
		const hasFirstTabTypeTabId = firstTabType.tabId in defaultTabInfo;
		const hasCatalogTab = !!defaultTabInfo.catalog;

		return (
			!isIntersect(categoryCodeList, categoryList) &&
			(hasFirstTabTypeTabId || hasCatalogTab)
		);
	}, [
		categoryCodeList,
		categoryList,
		defaultTabInfo,
		options.ignoreTabs,
		tabType,
	]);

	/**
	 * Get ele wysiwyg html
	 */
	const eleWysiwygHtml =
		series.tabType === TabType.ELE_A || series.tabType === TabType.ELE_B
			? series.productDescriptionHtml
			: undefined;

	/**
	 * Check has tab detail info
	 */
	const checkedTabPositionInfo = useMemo(() => {
		const invisibleList: TabId[] = ['codeList', 'technicalInformation'];

		return Object.values(defaultTabInfo)
			.filter(notNull)
			.filter(tabInfo => !invisibleList.includes(tabInfo.tabId))
			.map((tab, index) => ({
				tabId: tab.tabId,
				showsOnDetail: !(isNotPartNumberListDefault && index === 0),
				htmlList: tab.htmlList,
			}));
	}, [defaultTabInfo, isNotPartNumberListDefault]);

	const showsBasicInfo =
		!!series.catchCopy ||
		(series.seriesInfoText && series.seriesInfoText.length > 0) ||
		!!series.technicalInfoUrl ||
		!!eleWysiwygHtml;

	// tabContent内の htmlList に、表示するHTMLがある => true
	const hasHtmlList = (tabContent: TabContent): boolean => {
		return (
			tabContent?.htmlList !== undefined && tabContent?.htmlList.length > 0
		);
	};

	// [Detailed information]
	// checkedTabPositionInfo の少なくとも1つの要素の htmlList に、表示するHTMLがある => true
	const hasCheckedTabPositionInfoHtmlList: boolean = useMemo(
		() => checkedTabPositionInfo?.some(hasHtmlList),
		[checkedTabPositionInfo]
	);

	const showsDetailInfo = showsBasicInfo || hasCheckedTabPositionInfoHtmlList;

	const tabList = useMemo(() => {
		const tabInfo: Tab[] = [];

		const firstTab = Object.values(checkedTabPositionInfo)[0];

		if (isNotPartNumberListDefault && firstTab) {
			tabInfo.push(firstTab);
		}

		tabInfo.push({ tabId: 'codeList' });

		if (showsDetailInfo) {
			tabInfo.push({ tabId: 'detailInfo' });
		}

		return tabInfo.filter(tab => !options.ignoreTabs?.includes(tab.tabId));
	}, [
		checkedTabPositionInfo,
		isNotPartNumberListDefault,
		options.ignoreTabs,
		showsDetailInfo,
	]);

	const tabContents = useMemo(() => {
		const contents: TabContent[] = [];

		if (showsBasicInfo) {
			contents.push({ tabId: 'basicInfo', showsOnDetail: true, htmlList: [] });
		}

		contents.push(...checkedTabPositionInfo);

		return contents;
	}, [checkedTabPositionInfo, showsBasicInfo]);

	useOnMounted(async () => {
		try {
			const response = await getCodeListAnchorCategory();
			if (!response.categoryCode) {
				Logger.warn(
					'NEW_FE-3968: /operation/detail/codelist_anchor/category_data.json has no categoryCode.'
				);
			}
			setCategoryList(response.categoryCode ?? []);
		} catch {
			Logger.warn('getCodeListAnchorCategory Error', error);
		}
	});

	return {
		series,
		isNotPartNumberListDefault,
		tabList,
		tabContents,
		showsDetailInfo,
		basicInfo: {
			eleWysiwygHtml,
			catchCopyHtml: series.catchCopy,
			seriesInfoText: series.seriesInfoText,
			technicalInfoUrl: series.technicalInfoUrl,
		},
	};
};
