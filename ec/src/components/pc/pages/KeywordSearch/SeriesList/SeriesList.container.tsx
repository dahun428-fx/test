import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpecCode, SpecValues } from './SeriesFilterPanel/types';
import { SeriesList as Presenter } from './SeriesList';
import { ectLogger } from '@/logs/ectLogger';
import { FilterSpecLogPayload } from '@/logs/ectLogger/searchResult';
import { Flag } from '@/models/api/Flag';
import { CadType } from '@/models/api/constants/CadType';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	clearSearchSeriesFilter,
	searchSeries,
	selectBrandIndexList,
	selectShouldCollapse,
	selectSeriesResponse,
} from '@/store/modules/pages/keywordSearch';
import { first, last } from '@/utils/collection';
import { Cookie, setCookie } from '@/utils/cookie';
import { getPageSize } from '@/utils/domain/series';
import { isEmpty } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

type Props = {
	keyword: string;
	seriesPage?: number;
	className?: string;
};

export const SeriesList: React.VFC<Props> = ({
	keyword,
	seriesPage,
	className,
}) => {
	const router = useRouter();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');
	const seriesResponse = useSelector(selectSeriesResponse);
	const brandIndexList = useSelector(selectBrandIndexList);
	const shouldCollapse = useSelector(selectShouldCollapse);

	const [page, setPage] = useState<number>(seriesPage ?? 1);
	const [pageSize, setPageSize] = useState<number>(getPageSize());

	const store = useStore();
	const [t] = useTranslation();
	const clearFilter = useCallback(() => {
		clearSearchSeriesFilter(store)(keyword);
	}, [keyword, store]);

	const handleAddLog = useCallback(
		(spec: Record<SpecCode, SpecValues>) => {
			const currentSpecKey = first(Object.keys(spec));
			const payload: FilterSpecLogPayload = {
				isReSearch,
				keyword: keyword,
				selectedKeyword: '',
				searchResultType: 'LinkRfnCtg',
			};

			switch (currentSpecKey) {
				case 'categoryCode': {
					const specCodes = spec[currentSpecKey] as string[];
					if (isEmpty(specCodes)) {
						return;
					}

					const currentSpecCode = last(specCodes);
					const currentCategory = seriesResponse?.categoryList.find(
						category => category.categoryCode === currentSpecCode
					);
					if (!currentCategory || Flag.isTrue(currentCategory.selectedFlag)) {
						return;
					}
					payload.selectedKeyword = currentCategory.categoryName;
					payload.searchResultType = 'LinkRfnCtg';
					break;
				}

				case 'daysToShip': {
					const shippingDays = spec[currentSpecKey] as number | undefined;
					payload.searchResultType = 'LinkRfnShip';
					payload.selectedKeyword = shippingDays
						? t('pages.keywordSearch.seriesList.daysToShip', {
								days: shippingDays,
						  })
						: t('pages.keywordSearch.seriesList.all');
					break;
				}
				case 'brandCode':
					const brandCodes = spec[currentSpecKey] as string[];
					if (isEmpty(brandCodes)) {
						return;
					}
					const cValue = spec['cValueFlag'] as Flag | undefined;
					payload.searchResultType = 'LinkRfnMaker';

					if (
						cValue &&
						Flag.isTrue(cValue) &&
						Flag.isFalse(seriesResponse?.cValue.selectedFlag)
					) {
						// NOTE: given parent category is not selected,
						// when we select cValue, both cValue and parent category will become selected -> 2 log events will be sent, one for cValue, one for parent category.
						payload.selectedKeyword = t(
							'pages.keywordSearch.seriesList.economy'
						);
						ectLogger.searchResult.filterSpec(payload);
					}

					const currentBrand = seriesResponse?.brandList.find(
						brand => brand.brandCode === last(brandCodes)
					);

					if (!currentBrand || Flag.isTrue(currentBrand.selectedFlag)) {
						return;
					}

					payload.selectedKeyword = currentBrand.brandName;
					break;
				case 'cadType':
					const cadsType = spec[currentSpecKey] as string[];

					if (isEmpty(cadsType)) {
						return;
					}

					const selectedCadType = last(cadsType);

					const currentCadType = seriesResponse?.cadTypeList.find(
						item => item.cadType === selectedCadType
					);

					if (!currentCadType || Flag.isTrue(currentCadType.selectedFlag)) {
						return;
					}

					payload.selectedKeyword =
						selectedCadType === CadType['2D'] ? '2D' : '3D';
					payload.searchResultType = 'LinkRfnCad';
					break;
				default:
					return;
			}

			ectLogger.searchResult.filterSpec(payload);
		},
		[
			isReSearch,
			keyword,
			seriesResponse?.brandList,
			seriesResponse?.cValue.selectedFlag,
			seriesResponse?.cadTypeList,
			seriesResponse?.categoryList,
			t,
		]
	);

	const load = useCallback(
		async (conditions: Partial<SearchSeriesRequest> = {}, isClear = false) => {
			await searchSeries(store)({
				keyword,
				pageSize,
				...conditions,
			});

			setPage(conditions.page ?? 1);

			if (conditions.pageSize) {
				setPageSize(conditions.pageSize);
				setCookie(Cookie.VONA_ITEM_RESULT_PER_PAGE, conditions.pageSize);
			}

			if (!isClear) {
				handleAddLog(conditions);
			}
		},
		[handleAddLog, keyword, pageSize, store]
	);

	if (seriesResponse == null || seriesResponse.seriesList.length === 0) {
		return null;
	}

	return (
		<Presenter
			isReSearch={isReSearch}
			keyword={keyword}
			page={page}
			pageSize={pageSize}
			seriesResponse={seriesResponse}
			brandIndexList={brandIndexList}
			defaultExpanded={!shouldCollapse}
			onChange={load}
			clearAll={clearFilter}
			className={className}
		/>
	);
};
SeriesList.displayName = 'SeriesList';
