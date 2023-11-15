import React from 'react';
import { Meta as Presenter } from './Meta';
import { useSelector } from '@/store/hooks';
import {
	selectPartNumberResponse,
	selectSeries,
	selectTabList,
} from '@/store/modules/pages/productDetail';
import { first } from '@/utils/collection';

/**
 * Simple meta container
 */
export const Meta: React.VFC = () => {
	const series = useSelector(selectSeries);
	const { tabList } = useSelector(selectTabList);
	const partNumberResponse = useSelector(selectPartNumberResponse);
	const defaultTabId = first(tabList)?.id;

	if (!partNumberResponse) {
		return null;
	}

	return (
		<Presenter
			series={series}
			partNumberResponse={partNumberResponse}
			defaultTabId={defaultTabId}
		/>
	);
};
Meta.displayName = 'Meta';
