import { useState, VFC, useLayoutEffect, useCallback } from 'react';
import { SeriesListControl as Presenter } from './SeriesListControl';
import { HEADER_WRAPPER_ID } from '@/components/mobile/layouts/headers/Header';
import { CATEGORY_LIST_WRAPPER_ID } from '@/components/mobile/pages/KeywordSearch/CategoryList/CategoryList';
import { Option } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { useSelector, useStore } from '@/store/hooks';
import {
	selectCategoryResponse,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/keywordSearch';
import { getHeight } from '@/utils/dom';

export type Props = {
	displayType: Option;
	totalResult?: number;
	onChangeDisplayType: (value: Option) => void;
};

/** SeriesListControl container */
export const SeriesListControl: VFC<Props> = props => {
	const store = useStore();
	const categoryResponse = useSelector(selectCategoryResponse);
	const [categoryListHeight, setCategoryListHeight] = useState(0);
	const headerHeight = getHeight(`#${HEADER_WRAPPER_ID}`) ?? 0;

	const handleShowsFilterPanel = useCallback(() => {
		toggleShowsSpecPanel(store)();
	}, [store]);

	useLayoutEffect(() => {
		const categoryHeight = getHeight(`#${CATEGORY_LIST_WRAPPER_ID}`) ?? 0;
		setCategoryListHeight(categoryHeight);
	}, [categoryResponse]);

	return (
		<Presenter
			fixTop={headerHeight + categoryListHeight}
			onShowsFilterPanel={handleShowsFilterPanel}
			{...props}
		/>
	);
};
