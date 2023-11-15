import React, { useMemo } from 'react';
import { ProductDetailTabPanel as Presenter } from './ProductDetailTabPanel';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import type { TabId } from '@/models/domain/series/tab';
import { useSelector } from '@/store/hooks';
import { selectTabList } from '@/store/modules/pages/productDetail';

type Props = {
	tabId?: TabId;
	productSpecRef: React.RefObject<HTMLDivElement>;
};

export const ProductDetailTabPanel: React.FC<Props> = ({
	tabId,
	productSpecRef,
	children,
}) => {
	const { tabList } = useSelector(selectTabList);
	const { translateTab } = useTabTranslation();

	const initialTabName = useMemo(
		() =>
			tabId
				? translateTab(tabId)
				: tabList[0]?.id
				? translateTab(tabList[0]?.id)
				: undefined,
		[tabId, tabList, translateTab]
	);

	return (
		<Presenter
			tabName={initialTabName}
			shows={!!tabList.length}
			productSpecRef={productSpecRef}
		>
			{children}
		</Presenter>
	);
};
ProductDetailTabPanel.displayName = 'ProductDetailTabPanel';
