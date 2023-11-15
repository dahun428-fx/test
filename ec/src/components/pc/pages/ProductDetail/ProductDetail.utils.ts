import { ACTIONS_PANEL_SELECTOR } from '@/components/pc/pages/ProductDetail/constants';
import { getHeight } from '@/utils/dom';

export function getActionsPanelHeight() {
	return getHeight(ACTIONS_PANEL_SELECTOR) ?? 0;
}
