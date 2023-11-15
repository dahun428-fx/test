import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { Tab, TabId, tabIds } from '@/models/domain/series/complexTab';
import { pagesPath } from '@/utils/$path';
import { first } from '@/utils/collection';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { convertToURLString } from '@/utils/url';

type Props = {
	series: Series;
	tabs: Tab[];
	partNumberResponse: SearchPartNumberResponse$search | null;
};

/** Check if tabId is a valid tabId */
const isTabId = (tabId: string): tabId is TabId => {
	for (const id of tabIds) {
		if (tabId === id) {
			return true;
		}
	}
	return false;
};

const PAGE_SIZE = 50;

/** ComplexMeta component */
export const ComplexMeta: VFC<Props> = ({
	series,
	tabs,
	partNumberResponse,
}) => {
	const totalCount = partNumberResponse?.totalCount;
	const simpleFlag = partNumberResponse?.partNumberList?.[0]?.simpleFlag;
	const completeFlag = partNumberResponse?.completeFlag;

	const { t } = useTranslation();
	const router = useRouter();
	const params = getOneParams(
		router.query,
		'Page',
		'DEV',
		'Tab',
		'ProductCode',
		'PNSearch',
		'HissuCode'
	);

	const paginationParams = getOneParams(
		router.query,
		'CategorySpec',
		'CAD',
		'HyjnNoki',
		'Tab'
	);

	const { translateTab } = useTabTranslation();
	const detailPagePath = pagesPath.vona2.detail._seriesCode(series.seriesCode);
	const tabId = params.Tab;
	const defaultTabId = tabs[0]?.tabId;

	const isPage2Over =
		params.Page && parseInt(params.Page ?? 1) > 1 ? params.Page : null;

	const title = useMemo(() => {
		let dynamicName = '';
		if (tabId && isTabId(tabId)) {
			if (isPage2Over && tabId === 'codeList') {
				dynamicName = t('pages.productDetail.complex.meta.page', {
					page: isPage2Over,
				});
			} else {
				dynamicName = translateTab(tabId);
			}
		} else if (
			params.HissuCode &&
			partNumberResponse?.partNumberList[0]?.partNumber &&
			Flag.isTrue(completeFlag) &&
			Flag.isTrue(simpleFlag)
		) {
			dynamicName = partNumberResponse?.partNumberList[0].partNumber;
		} else if (isPage2Over) {
			dynamicName = t('pages.productDetail.complex.meta.page', {
				page: isPage2Over,
			});
		}

		const baseTitle = t('pages.productDetail.complex.meta.title', {
			seriesName: series.seriesName,
			brandName: series.brandName,
		});

		return dynamicName ? `${dynamicName} | ${baseTitle}` : baseTitle;
	}, [
		completeFlag,
		isPage2Over,
		params.HissuCode,
		partNumberResponse?.partNumberList,
		series,
		simpleFlag,
		t,
		tabId,
		translateTab,
	]);

	const description = useMemo(() => {
		const isSpecifiedPartNumber = !!(
			params.HissuCode &&
			partNumberResponse?.partNumberList.length === 1 &&
			!params.Page &&
			!params.Tab &&
			!params.PNSearch &&
			!paginationParams.CategorySpec
		);

		let dynamicName = '';

		if (tabId && isTabId(tabId)) {
			dynamicName = ` (${translateTab(tabId)})`;
		} else if (isPage2Over) {
			dynamicName = t('pages.productDetail.complex.meta.dynamicNameWithPage', {
				page: isPage2Over,
			});
		}

		if (isSpecifiedPartNumber) {
			return `${first(partNumberResponse.partNumberList)?.partNumber ?? ''} ${t(
				'pages.productDetail.complex.meta.description',
				{
					seriesName: series.seriesName,
					brandName: series.brandName,
					dynamicName,
				}
			)}`;
		}

		return t('pages.productDetail.complex.meta.description', {
			seriesName: series.seriesName,
			brandName: series.brandName,
			dynamicName,
		});
	}, [
		isPage2Over,
		paginationParams.CategorySpec,
		params.HissuCode,
		params.PNSearch,
		params.Page,
		params.Tab,
		partNumberResponse?.partNumberList,
		series.brandName,
		series.seriesName,
		t,
		tabId,
		translateTab,
	]);

	const keywords = useMemo(
		() =>
			t('pages.productDetail.meta.keywords', {
				series,
				categoryNames: series.categoryList
					.map(category => category.categoryName)
					.concat(series.categoryName || [])
					.reverse()
					.join(','),
				seoKeyword: getDepartmentKeywords(series.departmentCode, t),
			}),
		[series, t]
	);

	const isNoIndexNoFollow =
		totalCount === 0 ||
		params.DEV != null ||
		(tabId && tabId !== 'codeList') ||
		!!params.ProductCode;

	const needsCanonical = useMemo(() => {
		// NOTE router query has seriesCode
		const paramsCount = Object.keys(router.query).filter(
			item => item !== 'seriesCode'
		).length;

		if (
			paramsCount === 0 ||
			params.DEV ||
			tabId === 'catalog' ||
			params.ProductCode
		) {
			return false;
		}

		if (paramsCount === 1 && !!tabId && defaultTabId !== tabId) {
			return false;
		}

		if (paramsCount === 1 && params.Page) {
			return false;
		}
		return true;
	}, [
		defaultTabId,
		params.DEV,
		params.Page,
		params.ProductCode,
		router.query,
		tabId,
	]);

	const canonicalURL = useMemo(() => {
		const query: Record<string, string> = {};

		if (tabId) {
			if (tabId === 'codeList' && params.Page && parseInt(params.Page) > 1) {
				query['Page'] = params.Page;
			}

			if (tabId !== defaultTabId) {
				query['Tab'] = tabId;
			}
		}

		if (
			partNumberResponse?.partNumberList?.[0]?.partNumber &&
			Flag.isTrue(simpleFlag) &&
			Flag.isTrue(completeFlag)
		) {
			query['HissuCode'] = partNumberResponse.partNumberList[0].partNumber;
		}

		return pagesPath.vona2.detail
			._seriesCode(series.seriesCode)
			.$url({ query });
	}, [
		completeFlag,
		defaultTabId,
		params,
		partNumberResponse,
		series.seriesCode,
		simpleFlag,
		tabId,
	]);

	const page = params.Page ? parseInt(params.Page) : 1;

	const needsPrev =
		tabId &&
		tabId === 'codeList' &&
		totalCount &&
		totalCount > PAGE_SIZE &&
		page > 1;

	const needsNext =
		tabId === 'codeList' &&
		totalCount &&
		page < Math.ceil(totalCount / PAGE_SIZE);

	return (
		<Head>
			<title>{removeTags(title)}</title>
			<meta name="description" content={removeTags(description)} />
			<meta name="keywords" content={removeTags(keywords)} />
			{isNoIndexNoFollow && <meta name="robots" content="noindex,nofollow" />}
			{needsCanonical && (
				<link rel="canonical" href={convertToURLString(canonicalURL)} />
			)}
			{needsPrev && (
				<link
					rel="prev"
					href={convertToURLString(
						detailPagePath.$url({
							query: { Page: page - 1, ...paginationParams },
						})
					)}
				/>
			)}
			{needsNext && (
				<link
					rel="next"
					href={convertToURLString(
						detailPagePath.$url({
							query: { Page: page + 1, ...paginationParams },
						})
					)}
				/>
			)}
		</Head>
	);
};

ComplexMeta.displayName = 'ComplexMeta';
