import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import {
	selectCategoryResponse,
	selectSeriesResponse,
} from '@/store/modules/pages/category';
import { first, last } from '@/utils/collection';
import {
	filterSpecFromQuery,
	getCategoryListFromRoot,
	getSpecFromQuery,
	stringifySpecValues,
} from '@/utils/domain/category';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import {
	getSeriesListPageSize,
	isNumericString,
	parseSpecValue,
} from '@/utils/domain/spec';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { url } from '@/utils/url';

type Props = {
	category: Category;
};

type Params = {
	CategorySpec?: string;
	Page?: number;
	DispMethod?: string;
};

/** Maker spec search meta component */
export const Meta: VFC<Props> = ({ category }) => {
	const router = useRouter();
	const params = getOneParams(
		router.query,
		'CategorySpec',
		'Page',
		'DispMethod'
	);
	const categorySpecQuery = params.CategorySpec;
	const currentPage = Number(params.Page ?? 1);
	const dispMethod = params.DispMethod;
	const parsedCategorySpecQuery = parseSpecValue(categorySpecQuery);

	const { categoryName, departmentCode, parentCategoryCodeList } = category;

	const { t } = useTranslation();

	const rootCategory = useSelector(selectCategoryResponse);
	const seriesResponse = useSelector(selectSeriesResponse);

	const titlePage = useMemo(() => {
		if (!currentPage || currentPage <= 1) {
			return '';
		}

		return t('pages.category.specSearch.meta.titlePage', {
			page: currentPage,
		});
	}, [currentPage, t]);

	const seoSpec = useMemo(
		() => getSpecFromQuery(seriesResponse, categorySpecQuery),
		[categorySpecQuery, seriesResponse]
	);

	const filteredSpecFromQuery = useMemo(() => {
		const spec = filterSpecFromQuery(seriesResponse, categorySpecQuery);

		if (!spec) {
			return '';
		}

		return stringifySpecValues(spec);
	}, [categorySpecQuery, seriesResponse]);

	const titleSpec = useMemo(() => {
		if (!seoSpec) {
			return '';
		}

		return `${seoSpec.specValue.specValueDisp} | `;
	}, [seoSpec]);

	const titleSpecName = useMemo(() => {
		if (!seoSpec) {
			return '';
		}

		return ` | ${seoSpec.seriesSpec.specName}`;
	}, [seoSpec]);

	const categoryRouteForKeywords = useMemo(() => {
		if (!rootCategory || !rootCategory.categoryList.length) {
			return '';
		}

		const lastCategory = last(rootCategory.categoryList);
		const lastParentCode = last(parentCategoryCodeList);
		if (!lastCategory || !lastParentCode) {
			return '';
		}

		const categoryTree = getCategoryListFromRoot(lastCategory, lastParentCode);
		return categoryTree
			.slice(1)
			.map(category => category.categoryName)
			.join(',');
	}, [parentCategoryCodeList, rootCategory]);

	// Description
	const categorySpecForDescription = seoSpec
		? t('pages.category.specSearch.meta.categorySpecForDescription', {
				specName: seoSpec.seriesSpec.specName,
				specValueDisp: seoSpec.specValue.specValueDisp,
		  })
		: '';

	const categorySpecForKeyword = seoSpec
		? t('pages.category.specSearch.meta.categorySpecForKeyword', {
				specName: seoSpec.seriesSpec.specName,
				specValueDisp: removeTags(seoSpec.specValue.specValueDisp),
		  })
		: '';

	const keywords = useMemo(() => {
		return t('pages.category.specSearch.meta.keywords', {
			categoryName,
			categoryRouteForKeywords,
			categorySpec: categorySpecForKeyword,
			seoKeywords: getDepartmentKeywords(departmentCode, t),
		});
	}, [
		categoryName,
		categoryRouteForKeywords,
		categorySpecForKeyword,
		departmentCode,
		t,
	]);

	const descriptionPage = useMemo(() => {
		if (!currentPage || currentPage <= 1) {
			return '';
		}

		return t('pages.category.specSearch.meta.descriptionPage', {
			page: currentPage,
		});
	}, [currentPage, t]);

	const isSpecNumeric = useMemo(() => {
		if (!parsedCategorySpecQuery) {
			return false;
		}

		const firstSpec = first(Object.values(parsedCategorySpecQuery));

		if (!firstSpec || typeof firstSpec === 'string') {
			return false;
		}

		return firstSpec.some(spec => isNumericString(spec));
	}, [parsedCategorySpecQuery]);

	const isNoindexNofollow = useMemo(() => {
		const specValues = Object.values(parsedCategorySpecQuery ?? {});
		const firstSpecValues = first(specValues);

		return (
			(seriesResponse && seriesResponse.seriesList.length === 0) ||
			dispMethod ||
			specValues.length > 1 ||
			(firstSpecValues && firstSpecValues.length > 1) ||
			isSpecNumeric
		);
	}, [dispMethod, isSpecNumeric, parsedCategorySpecQuery, seriesResponse]);

	const totalPage = useMemo(() => {
		const pageSize = getSeriesListPageSize();

		const totalSeriesCount = seriesResponse?.totalCount ?? 0;
		return Math.ceil(totalSeriesCount / pageSize);
	}, [seriesResponse]);

	const prevPage = useMemo(() => {
		if (totalPage === 1 || currentPage === 1) {
			return null;
		}

		const params: Params = {
			Page: currentPage > totalPage ? 1 : currentPage - 1,
		};

		if (filteredSpecFromQuery) {
			params.CategorySpec = filteredSpecFromQuery;
		}

		if (dispMethod) {
			params.DispMethod = dispMethod;
		}

		return url
			.category(...category.parentCategoryCodeList, category.categoryCode)
			.fromSpecSearch(params);
	}, [
		category.categoryCode,
		category.parentCategoryCodeList,
		currentPage,
		dispMethod,
		filteredSpecFromQuery,
		totalPage,
	]);

	const nextPage = useMemo(() => {
		if (totalPage === 1 || totalPage <= currentPage) {
			return null;
		}

		const params: Params = {
			Page: currentPage + 1,
		};

		if (filteredSpecFromQuery) {
			params.CategorySpec = filteredSpecFromQuery;
		}

		if (dispMethod) {
			params.DispMethod = dispMethod;
		}

		return url
			.category(...category.parentCategoryCodeList, category.categoryCode)
			.fromSpecSearch(params);
	}, [
		category.categoryCode,
		category.parentCategoryCodeList,
		currentPage,
		dispMethod,
		filteredSpecFromQuery,
		totalPage,
	]);

	const canonicalUrl = useMemo(() => {
		const params: Params = {};

		if (currentPage > 1) {
			params.Page = currentPage;
		}

		if (
			seoSpec &&
			seoSpec.seriesSpec.specName &&
			seoSpec.specValue.specValueDisp
		) {
			params.CategorySpec = filteredSpecFromQuery; // `${seoSpec.seriesSpec.specCode}::${seoSpec.specValue.specValue}`;
		}

		return url
			.category(...category.parentCategoryCodeList, category.categoryCode)
			.fromSpecSearch(params);
	}, [category, currentPage, filteredSpecFromQuery, seoSpec]);

	return (
		<Head>
			<title>
				{t('pages.category.specSearch.meta.title', {
					titlePage,
					titleSpec,
					makerSpecTitle: categoryName,
					titleSpecName,
				})}
			</title>
			<meta
				name="description"
				content={t('pages.category.specSearch.meta.description', {
					categoryName,
					categorySpec: categorySpecForDescription,
					descriptionPage,
				})}
			/>

			{keywords && <meta name="keywords" content={keywords} />}
			{isNoindexNofollow && <meta name="robots" content="noindex,nofollow" />}
			<meta name="format-detection" content="telephone=no" />
			{!isNoindexNofollow && <link rel="canonical" href={canonicalUrl} />}
			{prevPage && <link rel="prev" href={prevPage} />}
			{nextPage && <link rel="next" href={nextPage} />}
		</Head>
	);
};
Meta.displayName = 'Meta';
