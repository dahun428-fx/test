import { TabId as ComplexTabId } from '@/models/domain/series/complexTab';
import { TabId } from '@/models/domain/series/tab';

export function tabClick(tabId: TabId | ComplexTabId) {
	try {
		switch (tabId) {
			// 外形図系
			case 'drawing':
			case 'drawingAndSpecifications':
				window.sc_tab_click_log?.('1');
				break;
			// 技術情報
			case 'technicalInformation':
				window.sc_tab_click_log?.('2');
				break;
			//  カタログ
			case 'catalog':
				window.sc_tab_click_log?.('3');
				break;
			// 型番リスト
			case 'codeList':
				window.sc_tab_click_log?.('5');
				break;
			// 規格表、納期、価格系
			case 'specifications':
			case 'specificationsAndDelivery':
			case 'specificationsAndPrice':
			case 'price':
			case 'deliveryAndPrice':
				window.sc_tab_click_log?.('6');
				break;
			// 概要・仕様
			case 'overviewAndSpecifications':
				window.sc_tab_click_log?.('7');
				break;
			// 商品説明
			case 'productInformation':
				window.sc_tab_click_log?.('8');
				break;
			// 商品仕様
			case 'productSpecifications':
				window.sc_tab_click_log?.('9');
				break;
			// 使用方法、特徴・使用例
			case 'example':
			case 'featuresAndExample':
				window.sc_tab_click_log?.('10');
				break;
			// 追加工系
			case 'alterations':
			case 'alterationsAndCoating':
				window.sc_tab_click_log?.('11');
				break;
			// 共通仕様
			case 'standardSpecifications':
				window.sc_tab_click_log?.('12');
				break;
			// 3Dプレビュー系
			case 'cadPreview':
				window.sc_tab_click_log?.('16u');
				window.sc_tab_click_log?.('16f');
				break;
		}
	} catch {
		// Do nothing
	}
}
