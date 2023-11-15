import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { first } from '@/utils/collection';
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
	categoryList: Category[];
	seriesResponse: SearchSeriesResponse$search | undefined;
};

type Params = {
	CategorySpec?: string;
	Page?: number;
	DispMethod?: string;
};

export const Meta: VFC<Props> = ({
	category,
	categoryList,
	seriesResponse,
}) => {
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

	const { categoryName, departmentCode } = category;

	const { t } = useTranslation();

	const titlePage = useMemo(() => {
		if (!currentPage || currentPage <= 1) {
			return '';
		}

		return t('mobile.pages.category.seriesList.meta.titlePage', {
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

		return `${removeTags(seoSpec.specValue.specValueDisp)} | `;
	}, [seoSpec]);

	const titleSpecName = useMemo(() => {
		if (!seoSpec) {
			return '';
		}

		return ` | ${removeTags(seoSpec.seriesSpec.specName)}`;
	}, [seoSpec]);

	const topCategory = categoryList[0];

	const categoryCodeList = useMemo(() => {
		if (!topCategory) {
			return [category.categoryCode];
		}

		return getCategoryListFromRoot(topCategory, category.categoryCode).map(
			category => category.categoryCode
		);
	}, [category.categoryCode, topCategory]);

	/** TOP カテゴリを除くカテゴリ名の逆順リスト */
	const categoryNameList = useMemo(() => {
		if (!topCategory) {
			return category.categoryName;
		}

		return getCategoryListFromRoot(topCategory, category.categoryCode)
			.map(category => category.categoryName)
			.slice(1)
			.reverse()
			.join();
	}, [category.categoryCode, category.categoryName, topCategory]);

	// Description
	const categorySpecForDescription = seoSpec
		? t('mobile.pages.category.seriesList.meta.categorySpecForDescription', {
				specName: removeTags(seoSpec.seriesSpec.specName),
				specValueDisp: removeTags(seoSpec.specValue.specValueDisp),
		  })
		: '';

	const categorySpecForKeyword = seoSpec
		? t('mobile.pages.category.seriesList.meta.categorySpecForKeyword', {
				specName: removeTags(seoSpec.seriesSpec.specName),
				specValueDisp: removeTags(seoSpec.specValue.specValueDisp),
		  })
		: '';

	const keywords = useMemo(() => {
		return t('mobile.pages.category.seriesList.meta.keywords', {
			categoryNameList,
			categorySpec: categorySpecForKeyword,
			seoKeywords: getDepartmentKeywords(departmentCode, t),
		});
	}, [categoryNameList, categorySpecForKeyword, departmentCode, t]);

	const descriptionPage = useMemo(() => {
		if (!currentPage || currentPage <= 1) {
			return '';
		}

		return t('mobile.pages.category.seriesList.meta.descriptionPage', {
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
	}, [seriesResponse?.totalCount]);

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

		return url.category(...categoryCodeList).fromSpecSearch(params);
	}, [
		categoryCodeList,
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

		return url.category(...categoryCodeList).fromSpecSearch(params);
	}, [
		categoryCodeList,
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

		return url.category(...categoryCodeList).fromSpecSearch(params);
	}, [categoryCodeList, currentPage, filteredSpecFromQuery, seoSpec]);

	return (
		<Head>
			<title>
				{t('mobile.pages.category.seriesList.meta.title', {
					titlePage,
					titleSpec,
					makerSpecTitle: categoryName,
					titleSpecName,
				})}
			</title>
			<meta
				name="description"
				content={t('mobile.pages.category.seriesList.meta.description', {
					categoryName,
					categorySpec: categorySpecForDescription,
					descriptionPage,
				})}
			/>

			{keywords && <meta name="keywords" content={keywords} />}
			{isNoindexNofollow && <meta name="robots" content="noindex,nofollow" />}
			{!isNoindexNofollow && <link rel="canonical" href={canonicalUrl} />}
			{prevPage && <link rel="prev" href={prevPage} />}
			{nextPage && <link rel="next" href={nextPage} />}
		</Head>
	);
};
Meta.displayName = 'Meta';
