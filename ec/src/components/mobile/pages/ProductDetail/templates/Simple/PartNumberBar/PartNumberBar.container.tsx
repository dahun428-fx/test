import React, { useCallback } from 'react';
import { PartNumberBar as Presenter } from './PartNumberBar';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectCurrentPartNumberList,
	selectCurrentPartNumberTotalCount,
	selectSoleProductAttributes,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/productDetail';
import { first } from '@/utils/collection';

/**
 * Part number bar container
 */
export const PartNumberBar: React.VFC = () => {
	const store = useStore();
	const partNumberList = useSelector(selectCurrentPartNumberList);
	const partNumberTotalCount = useSelector(selectCurrentPartNumberTotalCount);
	const { cautionList, noticeList } = useSelector(selectSoleProductAttributes);
	const partNumber = first(partNumberList)?.partNumber;

	// Handles the toggling of the spec panel's visibility.
	const handleToggleShowsSpecPanel = useCallback(() => {
		toggleShowsSpecPanel(store)();
	}, [store]);

	return (
		<Presenter
			partNumberTotalCount={partNumberTotalCount}
			partNumber={partNumber}
			cautionList={cautionList}
			noticeList={noticeList}
			onToggleShowsSpecPanel={handleToggleShowsSpecPanel}
		/>
	);
};
PartNumberBar.displayName = 'PartNumberBar';
