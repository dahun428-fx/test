import { getActionsPanelHeight } from '@/components/pc/pages/ProductDetail/ProductDetail.utils';
import { TabId } from '@/models/domain/series/complexTab';
import { getHeight, getTop } from '@/utils/dom';

export function getTabHeight() {
	return getHeight('#detailTabs') ?? 0;
}

/**
 * Scroll to specified tab
 * @param tabId
 */
export function scrollToTab(tabId: TabId) {
	const contentsTop = getTop(`#${tabId}`);

	if (contentsTop) {
		const panelHeight = getActionsPanelHeight();
		const tabHeight = getTabHeight();

		window.scroll({
			behavior: 'smooth',
			top:
				contentsTop + // content top from viewport top
				(window.scrollY || window.pageYOffset) - // window scroll height. pageYOffest for IE.
				(panelHeight + tabHeight), // Ensure display area of panel and tab.
		});
	}
}
