import { useRouter } from 'next/router';
import React, { useCallback, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { SpecCode, SpecValues } from './SeriesFilterPanel/types';
import { SeriesList as Presenter } from './SeriesList';
import { Option } from '@/components/mobile/ui/controls/select/DisplayTypeSwitch';
import { ectLogger } from '@/logs/ectLogger';
import { FilterSpecLogPayload } from '@/logs/ectLogger/searchResult';
import { Flag } from '@/models/api/Flag';
import { CadType } from '@/models/api/constants/CadType';
import { SearchSeriesRequest } from '@/models/api/msm/ect/series/SearchSeriesRequest';
import { useSelector, useStore } from '@/store/hooks';
import {
	searchSeries,
	selectSeriesResponse,
} from '@/store/modules/pages/keywordSearch';
import { first, last } from '@/utils/collection';
import { Cookie, setCookie } from '@/utils/cookie';
import { getPageSize } from '@/utils/domain/series';
import { isEmpty } from '@/utils/predicate';
import { getOneParams } from '@/utils/query';

type Props = {
	keyword: string;
	displayType: Option;
	seriesPage?: number;
};

/** Series list container */
export const SeriesList: VFC<Props> = ({
	keyword,
	displayType,
	seriesPage,
}) => {
	const seriesResponse = useSelector(selectSeriesResponse);
	const store = useStore();
	const router = useRouter();
	const [t] = useTranslation();
	const { isReSearch } = getOneParams(router.query, 'isReSearch');

	const [page, setPage] = useState(seriesPage);
	const [pageSize, setPageSize] = useState(getPageSize());

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
					if (!currentCategory) {
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

				case 'brandCode': {
					const brandCodes = spec[currentSpecKey] as string[];

					if (isEmpty(brandCodes)) {
						return;
					}

					const cValue = spec['cValueFlag'] as Flag | undefined;
					payload.searchResultType = 'LinkRfnMaker';

					if (cValue && Flag.isTrue(cValue)) {
						// NOTE: given parent category is not selected,
						// when we select cValue, both cValue and parent category will become selected
						// -> 2 log events will be sent, one for cValue, one for parent category.
						payload.selectedKeyword = t(
							'pages.keywordSearch.seriesList.economy'
						);
						ectLogger.searchResult.filterSpec(payload);
					}

					const currentBrand = seriesResponse?.brandList.find(
						brand => brand.brandCode === last(brandCodes)
					);

					if (
						!currentBrand ||
						(currentBrand && Flag.isTrue(currentBrand.selectedFlag)) ||
						!brandCodes.length
					) {
						return;
					}

					payload.selectedKeyword = currentBrand.brandName;
					break;
				}

				case 'cadType': {
					const cadsType = spec[currentSpecKey] as string[];

					if (isEmpty(cadsType)) {
						return;
					}

					payload.selectedKeyword =
						last(cadsType) === CadType['2D'] ? '2D' : '3D';
					payload.searchResultType = 'LinkRfnCad';

					break;
				}
				default:
					return;
			}

			ectLogger.searchResult.filterSpec(payload);
		},
		[
			isReSearch,
			keyword,
			seriesResponse?.brandList,
			seriesResponse?.categoryList,
			t,
		]
	);

	const load = useCallback(
		async (
			conditions: Partial<SearchSeriesRequest> = {},
			isClear?: boolean
		) => {
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
			pageSize={pageSize}
			keyword={keyword}
			displayType={displayType}
			page={page}
			onChange={load}
			seriesResponse={seriesResponse}
			isReSearch={isReSearch}
		/>
	);
};
SeriesList.displayName = 'SeriesList';
