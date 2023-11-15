import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TabType } from '@/models/api/msm/ect/series/shared';
import { assertNotNull } from '@/utils/assertions';

/** Html names in a Series */
type HtmlName = keyof Pick<
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

/** WYSIWYG tab IDs */
export const wysiwygTabIds = [
	/** 外形図 Drawing */
	'drawing',
	/** 規格表 Specifications */
	'specifications',
	/** 規格・納期 Specifications (and Days to Ship) */
	'specificationsAndDelivery',
	/** 規格・価格 Specification and price */
	'specificationsAndPrice',
	/** 共通仕様 Standard Specifications */
	'standardSpecifications',
	/** 外形図・規格表 Drawing/Specifications */
	'drawingAndSpecifications',
	/** 商品仕様 Product Specifications */
	'productSpecifications',
	/** 商品情報 Product Specifications (information) */
	'productInformation',
	/** 価格 Price */
	'price',
	/** 納期・価格 Days to Ship (and price) */
	'deliveryAndPrice',
	/** 使用方法 Example */
	'example',
	/** 追加工 Alterations */
	'alterations',
	/** 追加工・追加コーティング Alterations and coating */
	'alterationsAndCoating',
	/** 概要・仕様 More Information */
	'overviewAndSpecifications',
	/** 特徴・使用例 Features and Example */
	'featuresAndExample',
] as const;
type WysiwygTabId = typeof wysiwygTabIds[number];

/** Tab IDs */
export const tabIds = [
	...wysiwygTabIds,
	/**
	 * 型番リスト Part Numbers
	 * - partNumberList と命名していたが旧システムの SEO 要件に引っ張られ codeList と命名…。
	 */
	'codeList',
	/** 技術情報 Technical Information */
	'technicalInformation',
	/** カタログ Catalog */
	'catalog',
	/** PDF (for pattern H?) */
	'pdf',
] as const;
export type TabId = typeof tabIds[number];

/** WYSIWYG tab */
type WysiwygTab = {
	tabId: WysiwygTabId;
	htmlNameList: Readonly<HtmlName[]>;
};

/** Tab */
type Tab = {
	tabId: TabId;
};

/** WYSIWYG tab config */
type WysiwygTabConfig = Record<TabType, Readonly<WysiwygTab[]>>;

/** Tab config */
type TabConfig = Record<
	TabType,
	Readonly<[Tab | WysiwygTab, ...(Tab | WysiwygTab)[]]> // 少なくとも length 1 以上という型定義
>;

/**
 * WYSIWYG tab config
 */
export const wysiwygTabConfig: WysiwygTabConfig = {
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
	],
	// ELE_B config is same as ELE_A. ect-api document of /series/serach says "ELE_B does not exist now".
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
	],
	[TabType.VONA]: [
		{
			tabId: 'productInformation',
			htmlNameList: ['productDescriptionHtml'],
		},
	],
} as const;

function getNotNull(tab?: WysiwygTab) {
	assertNotNull(tab);
	return tab;
}

/** Tab config */
export const tabConfig: TabConfig = {
	[TabType.MECH_A]: [
		getNotNull(wysiwygTabConfig[TabType.MECH_A][0]),
		getNotNull(wysiwygTabConfig[TabType.MECH_A][1]),
		getNotNull(wysiwygTabConfig[TabType.MECH_A][2]),
		getNotNull(wysiwygTabConfig[TabType.MECH_A][3]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.MECH_B]: [
		getNotNull(wysiwygTabConfig[TabType.MECH_B][0]),
		getNotNull(wysiwygTabConfig[TabType.MECH_B][1]),
		getNotNull(wysiwygTabConfig[TabType.MECH_B][2]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.ELE_A]: [
		getNotNull(wysiwygTabConfig[TabType.ELE_A][0]),
		getNotNull(wysiwygTabConfig[TabType.ELE_A][1]),
		getNotNull(wysiwygTabConfig[TabType.ELE_A][2]),
		getNotNull(wysiwygTabConfig[TabType.ELE_A][3]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	// ELE_B config is same as ELE_A. ect-api document of /series/serach says "ELE_B does not exist now".
	[TabType.ELE_B]: [
		getNotNull(wysiwygTabConfig[TabType.ELE_B][0]),
		getNotNull(wysiwygTabConfig[TabType.ELE_B][1]),
		getNotNull(wysiwygTabConfig[TabType.ELE_B][2]),
		getNotNull(wysiwygTabConfig[TabType.ELE_B][3]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.PRESS_MOLD_A]: [
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_A][0]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_A][1]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_A][2]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_A][3]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_A][4]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.PRESS_MOLD_B]: [
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_B][0]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_B][1]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_B][2]),
		getNotNull(wysiwygTabConfig[TabType.PRESS_MOLD_B][3]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.TOOL_FS_A]: [
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_A][0]),
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_A][1]),
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_A][2]),
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_A][3]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.TOOL_FS_B]: [
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_B][0]),
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_B][1]),
		getNotNull(wysiwygTabConfig[TabType.TOOL_FS_B][2]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
	[TabType.VONA]: [
		getNotNull(wysiwygTabConfig[TabType.VONA][0]),
		{ tabId: 'catalog' },
		{ tabId: 'technicalInformation' },
	],
} as const;
