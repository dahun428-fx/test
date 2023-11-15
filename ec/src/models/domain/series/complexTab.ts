import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TabType } from '@/models/api/msm/ect/series/shared';

/** Html names in a Series */
export type HtmlName = keyof Pick<
	Series,
	| 'productDescriptionHtml'
	| 'specificationsHtml'
	| 'priceListHtml'
	| 'daysToShipHtml'
	| 'alterationHtml'
	| 'overviewHtml'
	| 'exampleHtml'
	| 'generalHtml'
	| 'standardSpecHtml'
>;

/** Tab Id */
export const tabIds = [
	'drawing',
	'drawingAndSpecifications',
	'productSpecifications',
	'specificationsAndDelivery',
	'productInformation',
	'specifications',
	'deliveryAndPrice',
	'overviewAndSpecifications',
	'catalog',
	'technicalInformation',
	'example',
	'standardSpecifications',
	'price',
	'alterations',
	'specificationsAndPrice',
	'featuresAndExample',
	'alterationsAndCoating',
	'detailInfo',
	'basicInfo',
	'codeList',
] as const;
export type TabId = typeof tabIds[number];

/** WYSIWYG tab */
export type WysiwygTab = {
	tabId: TabId;
	htmlNameList?: Readonly<HtmlName[]>;
};

/** Tab */
export type Tab = {
	tabId: TabId;
};

/** Tab config */
export type TabConfig = Record<
	TabType,
	Readonly<[WysiwygTab, ...WysiwygTab[]]> // 少なくとも length 1 以上という型定義
>;

export const wysiwygTabConfig: TabConfig = {
	[TabType.MECH_A]: [
		{
			tabId: 'drawing',
			htmlNameList: ['productDescriptionHtml'],
		},
		{
			tabId: 'specifications',
			htmlNameList: ['specificationsHtml', 'alterationHtml'],
		},
		{
			tabId: 'deliveryAndPrice',
			htmlNameList: ['priceListHtml', 'daysToShipHtml'],
		},
		{
			tabId: 'overviewAndSpecifications',
			htmlNameList: ['overviewHtml', 'exampleHtml', 'generalHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.MECH_B]: [
		{
			tabId: 'drawingAndSpecifications',
			htmlNameList: [
				'productDescriptionHtml',
				'specificationsHtml',
				'alterationHtml',
			],
		},
		{
			tabId: 'deliveryAndPrice',
			htmlNameList: ['priceListHtml', 'daysToShipHtml'],
		},
		{
			tabId: 'overviewAndSpecifications',
			htmlNameList: ['overviewHtml', 'exampleHtml', 'generalHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.ELE_A]: [
		{
			tabId: 'productSpecifications',
			htmlNameList: [
				'specificationsHtml',
				'daysToShipHtml',
				'overviewHtml',
				'generalHtml',
			],
		},
		{
			tabId: 'example',
			htmlNameList: ['exampleHtml'],
		},
		{
			tabId: 'drawing',
			htmlNameList: ['alterationHtml'],
		},
		{
			tabId: 'standardSpecifications',
			htmlNameList: ['standardSpecHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	// ELE_B config is same as ELE_A. ect-api document of /series/search says "ELE_B does not exist now".
	[TabType.ELE_B]: [
		{
			tabId: 'productSpecifications',
			htmlNameList: [
				'specificationsHtml',
				'daysToShipHtml',
				'overviewHtml',
				'generalHtml',
			],
		},
		{
			tabId: 'example',
			htmlNameList: ['exampleHtml'],
		},
		{
			tabId: 'drawing',
			htmlNameList: ['alterationHtml'],
		},
		{
			tabId: 'standardSpecifications',
			htmlNameList: ['standardSpecHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.PRESS_MOLD_A]: [
		{
			tabId: 'drawing',
			htmlNameList: ['productDescriptionHtml'],
		},
		{
			tabId: 'specificationsAndDelivery',
			htmlNameList: ['specificationsHtml', 'daysToShipHtml'],
		},
		{
			tabId: 'price',
			htmlNameList: ['priceListHtml'],
		},
		{
			tabId: 'overviewAndSpecifications',
			htmlNameList: ['overviewHtml', 'generalHtml', 'exampleHtml'],
		},
		{
			tabId: 'alterations',
			htmlNameList: ['alterationHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.PRESS_MOLD_B]: [
		{
			tabId: 'drawingAndSpecifications',
			htmlNameList: [
				'productDescriptionHtml',
				'specificationsHtml',
				'daysToShipHtml',
			],
		},
		{
			tabId: 'price',
			htmlNameList: ['priceListHtml'],
		},
		{
			tabId: 'overviewAndSpecifications',
			htmlNameList: ['overviewHtml', 'generalHtml', 'exampleHtml'],
		},
		{
			tabId: 'alterations',
			htmlNameList: ['alterationHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.TOOL_FS_A]: [
		{
			tabId: 'drawing',
			htmlNameList: ['productDescriptionHtml'],
		},
		{
			tabId: 'specificationsAndPrice',
			htmlNameList: ['specificationsHtml', 'daysToShipHtml'],
		},
		{
			tabId: 'featuresAndExample',
			htmlNameList: ['overviewHtml', 'generalHtml', 'exampleHtml'],
		},
		{
			tabId: 'alterationsAndCoating',
			htmlNameList: ['alterationHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.TOOL_FS_B]: [
		{
			tabId: 'specificationsAndDelivery',
			htmlNameList: [
				'productDescriptionHtml',
				'specificationsHtml',
				'daysToShipHtml',
			],
		},
		{
			tabId: 'featuresAndExample',
			htmlNameList: ['overviewHtml', 'generalHtml', 'exampleHtml'],
		},
		{
			tabId: 'alterationsAndCoating',
			htmlNameList: ['alterationHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
	[TabType.VONA]: [
		{
			tabId: 'productInformation',
			htmlNameList: ['productDescriptionHtml'],
		},
		{
			tabId: 'catalog',
		},
	],
} as const;
