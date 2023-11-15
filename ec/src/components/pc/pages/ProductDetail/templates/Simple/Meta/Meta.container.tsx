import React from 'react';
import { Meta as Presenter } from './Meta';
import { useSelector } from '@/store/hooks';
import {
	selectPartNumberResponse,
	selectSeries,
	selectTabList,
} from '@/store/modules/pages/productDetail';
import { assertNotNull } from '@/utils/assertions';

/**
 * Simple Meta container
 */
export const Meta: React.VFC = () => {
	const series = useSelector(selectSeries);
	const partNumberResponse = useSelector(selectPartNumberResponse);
	const { tabList } = useSelector(selectTabList);
	assertNotNull(partNumberResponse);

	return (
		<Presenter
			series={series}
			partNumberResponse={partNumberResponse}
			defaultTabId={tabList[0]?.id}
		/>
	);
};
Meta.displayName = 'Meta';
