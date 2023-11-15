import React, { useCallback } from 'react';
import { SeriesFilterPanel as Presenter } from './SeriesFilterPanel';
import { SpecCode, SpecValues } from './types';
import { useSelector, useStore } from '@/store/hooks';
import {
	clearSearchSeriesFilter,
	selectBrandIndexList,
	selectPreviousSearchSeriesCondition,
	selectSeriesResponse,
	selectShowsSpecPanel,
	toggleShowsSpecPanel,
} from '@/store/modules/pages/keywordSearch';
import { notHidden, validateFilter } from '@/utils/domain/spec';

type Props = {
	keyword: string;
	onChange: (spec: Record<SpecCode, SpecValues>, isClear?: boolean) => void;
};

/**
 * Series filter panel component.
 */
export const SeriesFilterPanel: React.VFC<Props> = ({ keyword, onChange }) => {
	const store = useStore();
	const seriesResponse = useSelector(selectSeriesResponse);
	const brandIndexList = useSelector(selectBrandIndexList);
	const showsSpecPanel = useSelector(selectShowsSpecPanel);

	const handleClearFilter = useCallback(() => {
		const prevCondition = selectPreviousSearchSeriesCondition(store.getState());
		const isValid = validateFilter(prevCondition);
		if (!isValid) {
			return;
		}

		clearSearchSeriesFilter(store)(keyword);
	}, [keyword, store]);

	const handleCloseSpecFilter = useCallback(() => {
		toggleShowsSpecPanel(store)();
	}, [store]);

	if (
		!showsSpecPanel ||
		seriesResponse == null ||
		seriesResponse.seriesList.length === 0
	) {
		return null;
	}

	const {
		totalCount,
		cadTypeList,
		categoryList,
		daysToShipList,
		brandList,
		cValue,
	} = seriesResponse;

	// If all spec lists are hidden, do not render.
	if (
		!categoryList.some(notHidden) &&
		!brandList.some(notHidden) &&
		!daysToShipList.some(notHidden) &&
		!cadTypeList.some(notHidden)
	) {
		return null;
	}

	return (
		<Presenter
			totalCount={totalCount}
			cadTypeList={cadTypeList}
			categoryList={categoryList}
			daysToShipList={daysToShipList}
			brandList={brandList}
			brandIndexList={brandIndexList}
			cValue={cValue}
			onClearFilter={handleClearFilter}
			onChange={onChange}
			showsSpecFilter={showsSpecPanel}
			onClose={handleCloseSpecFilter}
		/>
	);
};

SeriesFilterPanel.displayName = 'SeriesFilterPanel';
