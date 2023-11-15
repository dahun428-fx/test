import React, { useCallback } from 'react';
import { PartNumberListPanel as Presenter } from './PartNumberListPanel';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectShowsPartNumberListPanel,
	toggleShowsPartNumberListPanel,
} from '@/store/modules/pages/productDetail';

export const PartNumberListPanel: React.VFC = () => {
	const store = useStore();
	const showsPartNumberListPanel = useSelector(selectShowsPartNumberListPanel);

	const handleClose = useCallback(() => {
		toggleShowsPartNumberListPanel(store)();
	}, [store]);

	if (!showsPartNumberListPanel) {
		return null;
	}

	return <Presenter onClose={handleClose} />;
};
PartNumberListPanel.displayName = 'PartNumberListPanel';
