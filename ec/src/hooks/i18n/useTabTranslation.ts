import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TabId as ComplexTabId } from '@/models/domain/series/complexTab';
import { tabIds as complexTabIds } from '@/models/domain/series/complexTab';
import type { TabId as SimpleTabId } from '@/models/domain/series/tab';
import { tabIds as simpleTabIds } from '@/models/domain/series/tab';

export const useTabTranslation = () => {
	const [t] = useTranslation();

	/**
	 * Translate tab message by tabId
	 * - NOTE: Experimental. This is for when you want to get a translation from a variable.
	 *         This has not been adequately discussed.
	 *         If you wish to imitate it, please consult an expert.
	 *         変数から翻訳を得たい場合の実験的な書き方です。
	 *         充分に議論されていないため、真似する場合は有識者に相談してください。
	 */
	const translateTab = useCallback(
		(tabId: SimpleTabId | ComplexTabId) => {
			// In accordance with development rules, i18n keys are not dynamically constructed.
			// The purpose is to speed up the identification of where the i18n key is used
			// during the maintenance phase.
			// 開発ルールに従い、i18n key を動的に構築していません。
			// 保守フェーズにおいて、i18n key の使用箇所の特定を迅速にすることが目的です。
			switch (tabId) {
				case 'drawing':
					return t('hooks.i18n.useTabTranslation.drawing');
				case 'specifications':
					return t('hooks.i18n.useTabTranslation.specifications');
				case 'specificationsAndDelivery':
					return t('hooks.i18n.useTabTranslation.specificationsAndDelivery');
				case 'specificationsAndPrice':
					return t('hooks.i18n.useTabTranslation.specificationsAndPrice');
				case 'standardSpecifications':
					return t('hooks.i18n.useTabTranslation.standardSpecifications');
				case 'drawingAndSpecifications':
					return t('hooks.i18n.useTabTranslation.drawingAndSpecifications');
				case 'productSpecifications':
					return t('hooks.i18n.useTabTranslation.productSpecifications');
				case 'productInformation':
					return t('hooks.i18n.useTabTranslation.productInformation');
				case 'price':
					return t('hooks.i18n.useTabTranslation.price');
				case 'deliveryAndPrice':
					return t('hooks.i18n.useTabTranslation.deliveryAndPrice');
				case 'example':
					return t('hooks.i18n.useTabTranslation.example');
				case 'alterations':
					return t('hooks.i18n.useTabTranslation.alterations');
				case 'alterationsAndCoating':
					return t('hooks.i18n.useTabTranslation.alterationsAndCoating');
				case 'overviewAndSpecifications':
					return t('hooks.i18n.useTabTranslation.overviewAndSpecifications');
				case 'featuresAndExample':
					return t('hooks.i18n.useTabTranslation.featuresAndExample');
				case 'technicalInformation':
					return t('hooks.i18n.useTabTranslation.technicalInformation');
				case 'catalog':
					return t('hooks.i18n.useTabTranslation.catalog');
				case 'detailInfo':
					return t('hooks.i18n.useTabTranslation.detailInfo');
				case 'basicInfo':
					return t('hooks.i18n.useTabTranslation.basicInfo');
				case 'codeList':
					return t('hooks.i18n.useTabTranslation.partNumberList');
				case 'pdf':
					return t('hooks.i18n.useTabTranslation.pdf');
			}
		},
		[t]
	);

	const translateTabQuery = useCallback(
		(tabId: string | string[]) => {
			const target = typeof tabId === 'string' ? tabId : tabId[0];
			if (target && isTabId(target)) {
				return translateTab(target);
			}
			return null;
		},
		[translateTab]
	);

	return { translateTab, translateTabQuery };
};

function isTabId(tabId: string): tabId is SimpleTabId | ComplexTabId {
	return Array.from<string>([...complexTabIds, ...simpleTabIds]).includes(
		tabId
	);
}
