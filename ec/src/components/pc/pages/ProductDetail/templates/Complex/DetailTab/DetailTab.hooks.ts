import { useState, useLayoutEffect } from 'react';
import { ACTIONS_PANEL_SELECTOR } from '@/components/pc/pages/ProductDetail/constants';
import { getHeight } from '@/utils/dom';

/**
 * @description Sticky の top （高さ）の計算
 * DOM の高さを少数切り捨てにしないと、
 * Sticky の上に1px程度の隙間が空く
 */
export const useDetailTabStickyTop = () => {
	const NOTHING_DOM_HEIGHT = 0;
	const [stickyTop, setStickyTop] = useState<number>(NOTHING_DOM_HEIGHT);

	useLayoutEffect(() => {
		const updateStickyTop = (): void => {
			const actionsPanelHeight = getHeight(ACTIONS_PANEL_SELECTOR);
			const actionsPanelStickyTop = Math.floor(
				actionsPanelHeight ?? NOTHING_DOM_HEIGHT
			);
			setStickyTop(actionsPanelStickyTop);
		};

		window.addEventListener('resize', updateStickyTop);
		updateStickyTop();

		return () => window.removeEventListener('resize', updateStickyTop);
	}, []);

	return stickyTop;
};
