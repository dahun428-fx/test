import React from 'react';
import { ProductDetailTabPanel as Presenter } from './ProductDetailTabPanel';
import type { TabId } from '@/models/domain/series/tab';
import { useSelector } from '@/store/hooks';
import { selectPUTabList } from '@/store/modules/pages/productDetail';

type Props = {
	tabId?: TabId;
	productSpecRef: React.RefObject<HTMLDivElement>;
};

export const ProductDetailTabPanel: React.FC<Props> = ({
	productSpecRef,
	children,
}) => {
	const { tabList } = useSelector(selectPUTabList);

	return (
		<Presenter shows={!!tabList.length} productSpecRef={productSpecRef}>
			{children}
		</Presenter>
	);
};
ProductDetailTabPanel.displayName = 'ProductDetailTabPanel';
