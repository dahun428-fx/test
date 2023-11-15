import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { getGeneralRecommend } from '@/api/services/cameleer/getGeneralRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { generalRecommendLogger } from '@/logs/cameleer/generalRecommend';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';
import { useSelector } from '@/store/hooks';
import {
	selectSeries,
	selectSeriesCurrency,
} from '@/store/modules/pages/productDetail';

const MAX_RECOMMEND_COUNT = 5;
const MIN_RECOMMEND_COUNT = 2;
export const RECOMMEND_ITEM_WIDTH = 198;
export const HEADER_WIDTH = 110;

function calculateOffset() {
	const width = window.innerWidth;
	for (let i = MAX_RECOMMEND_COUNT; i >= MIN_RECOMMEND_COUNT; i--) {
		if (RECOMMEND_ITEM_WIDTH * (i + 1) + HEADER_WIDTH + 1 < width) {
			return i;
		}
	}
	return MIN_RECOMMEND_COUNT;
}

/** customers who viewed this item also viewed hook */
export const useInterestRecommend = () => {
	const series = useSelector(selectSeries);
	const currencyCode = useSelector(selectSeriesCurrency);
	const [interestRecommendList, setInterestRecommendList] = useState<
		GeneralRecommendSeriesItem[]
	>([]);

	// index of first recommend item in current page
	const [cursor, setCursor] = useState<number>(0);
	// page size
	const [offset, setOffset] = useState<number>(5);

	// current page number (1 origin)
	const currentPage = Math.floor(cursor / offset);
	const totalPageCount = Math.ceil(interestRecommendList.length / offset);

	const recommendListPerPage = useMemo(
		() => interestRecommendList.slice(cursor, cursor + offset),
		[cursor, interestRecommendList, offset]
	);

	const changePage = useCallback(
		(prevOrNext: 'prev' | 'next') => {
			if (prevOrNext === 'prev') {
				const nextPage = (currentPage - 1 + totalPageCount) % totalPageCount;
				setCursor(offset * nextPage);
			} else {
				const nextPage = (currentPage + 1 + totalPageCount) % totalPageCount;
				setCursor(offset * nextPage);
			}
		},
		[currentPage, offset, totalPageCount]
	);

	const handleLoadImage = useCallback((item: GeneralRecommendSeriesItem) => {
		if (item.initialized) {
			return;
		}
		generalRecommendLogger.impressionLog({
			seriesCodeOrItemCd: item.seriesCode,
			position: item.position,
			recommendCd: 'rid3',
			dispPage: 'detail',
		});
		item.initialized = true;
	}, []);

	const handleClickItem = useCallback((item: GeneralRecommendSeriesItem) => {
		generalRecommendLogger.clickLog({
			seriesCodeOrItemCd: item.seriesCode,
			position: item.position,
			recommendCd: 'rid3',
			dispPage: 'detail',
		});
	}, []);

	const load = useCallback(async () => {
		const generalRecommendResponse = await getGeneralRecommend({
			recommendCd: 'rid3',
			seriesCodeOrItemCd: series.seriesCode,
		}).catch(() => null);
		setInterestRecommendList(
			(generalRecommendResponse as GeneralRecommendSeriesItem[]) ?? []
		);
	}, [series.seriesCode]);

	useOnMounted(load);

	useLayoutEffect(() => {
		const updateOffset = () => setOffset(calculateOffset());
		window.addEventListener('resize', updateOffset);
		return () => window.removeEventListener('resize', updateOffset);
	}, []);

	return {
		series,
		recommendListPerPage,
		totalPageCount,
		changePage,
		currencyCode,
		onLoadImage: handleLoadImage,
		onClickItem: handleClickItem,
	};
};
