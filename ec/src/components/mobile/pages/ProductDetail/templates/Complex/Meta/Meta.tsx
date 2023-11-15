import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTabTranslation } from '@/hooks/i18n/useTabTranslation';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TabId, tabIds } from '@/models/domain/series/tab';
import { PAGE_SIZE } from '@/models/pages/productDetail/shared.mobile';
import { pagesPath } from '@/utils/$path';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { convertToURLString } from '@/utils/url';

type Props = {
	series: Series;
	partNumberResponse: SearchPartNumberResponse$search;
	defaultTabId?: TabId;
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

/** Complex Meta component */
export const Meta: VFC<Props> = ({
	series,
	partNumberResponse,
	defaultTabId,
}) => {
	const { totalCount, completeFlag, partNumberList } = partNumberResponse;
	const simpleFlag = partNumberResponse.partNumberList[0]?.simpleFlag;

	const { t } = useTranslation();
	const router = useRouter();
	const params = getOneParams(
		router.query,
		'Page',
		'Tab',
		'ProductCode',
		'PNSearch',
		'HissuCode',
		'CategorySpec'
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

	const partNumber = partNumberList[0]?.partNumber;
	const hasProductCodeOrHissuCode = !!params.HissuCode || !!params.ProductCode;
	const tabId = params.Tab;

	const page =
		!!params.Page && !!parseInt(params.Page) ? parseInt(params.Page) : 1;

	const existsMultiplePages =
		params.Page && parseInt(params.Page ?? 1) > 1 ? params.Page : null;

	const title = useMemo(() => {
		let dynamicName = '';
		if (tabId && isTabId(tabId)) {
			if (existsMultiplePages && tabId === 'codeList') {
				dynamicName = t(
					'mobile.pages.productDetail.templates.complex.meta.page',
					{
						page: existsMultiplePages,
					}
				);
			} else if (tabId === 'codeList') {
				dynamicName = t(
					'mobile.pages.productDetail.templates.complex.meta.partNumber'
				);
			} else {
				dynamicName = translateTab(tabId);
			}
		} else if (
			params.HissuCode &&
			partNumberResponse.partNumberList[0]?.partNumber &&
			Flag.isTrue(completeFlag) &&
			Flag.isTrue(simpleFlag)
		) {
			dynamicName = partNumberResponse.partNumberList[0].partNumber;
		} else if (existsMultiplePages) {
			dynamicName = t(
				'mobile.pages.productDetail.templates.complex.meta.page',
				{
					page: existsMultiplePages,
				}
			);
		}

		const baseTitle = t(
			'mobile.pages.productDetail.templates.complex.meta.title',
			{
				seriesName: removeTags(series.seriesName),
				brandName: series.brandName,
			}
		);

		return dynamicName ? `${dynamicName} | ${baseTitle}` : baseTitle;
	}, [
		completeFlag,
		existsMultiplePages,
		params.HissuCode,
		partNumberResponse.partNumberList,
		series.brandName,
		series.seriesName,
		simpleFlag,
		t,
		tabId,
		translateTab,
	]);

	const description = useMemo(() => {
		let dynamicName = '';
		let partNumberText = '';

		if (tabId && isTabId(tabId)) {
			dynamicName = ` (${translateTab(tabId)})`;
		} else if (existsMultiplePages) {
			dynamicName = t(
				'mobile.pages.productDetail.templates.complex.meta.dynamicNameWithPage',
				{
					page: existsMultiplePages,
				}
			);
		}

		if (
			!hasProductCodeOrHissuCode &&
			tabId !== 'codeList' &&
			tabId !== 'catalog' &&
			page > 1
		) {
			dynamicName = t(
				'mobile.pages.productDetail.templates.complex.meta.dynamicNameWithPage',
				{
					page: page,
				}
			);
		}

		if (
			!params.Tab &&
			!params.Page &&
			!params.CategorySpec &&
			!params.PNSearch &&
			hasProductCodeOrHissuCode &&
			partNumber
		) {
			partNumberText = `${partNumber} `;
		}

		return t('mobile.pages.productDetail.templates.complex.meta.description', {
			seriesName: removeTags(series.seriesName),
			brandName: series.brandName,
			dynamicName,
			partNumberText,
		});
	}, [
		hasProductCodeOrHissuCode,
		existsMultiplePages,
		page,
		params.CategorySpec,
		params.PNSearch,
		params.Page,
		params.Tab,
		partNumber,
		series.brandName,
		series.seriesName,
		t,
		tabId,
		translateTab,
	]);

	const keywords = useMemo(() => {
		let partNumberText = '';
		if (
			!params.Tab &&
			!params.Page &&
			!params.CategorySpec &&
			!params.PNSearch &&
			hasProductCodeOrHissuCode &&
			partNumber
		) {
			partNumberText = `,${partNumber}`;
		}
		return t('mobile.pages.productDetail.templates.complex.meta.keywords', {
			brandName: series.brandName,
			seriesName: removeTags(series.seriesName),
			categoryNames: series.categoryList
				.map(category => category.categoryName)
				.concat(series.categoryName || [])
				.reverse()
				.join(','),
			seoKeyword: getDepartmentKeywords(series.departmentCode, t),
			partNumberText,
		});
	}, [
		hasProductCodeOrHissuCode,
		params.CategorySpec,
		params.PNSearch,
		params.Page,
		params.Tab,
		partNumber,
		series,
		t,
	]);

	const isNoIndexNoFollow =
		totalCount === 0 || (tabId && tabId !== 'codeList') || !!params.ProductCode;

	const needsCanonical = useMemo(() => {
		// NOTE router query has seriesCode
		const paramsCount = Object.keys(router.query).filter(
			item => item !== 'seriesCode'
		).length;

		if (paramsCount === 0 || tabId === 'catalog' || params.ProductCode) {
			return false;
		}

		if (paramsCount === 1 && !!tabId && defaultTabId !== tabId) {
			return false;
		}

		if (paramsCount === 1 && params.Page) {
			return false;
		}
		return true;
	}, [defaultTabId, params.Page, params.ProductCode, router.query, tabId]);

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
			partNumberResponse.partNumberList[0]?.partNumber &&
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
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
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
Meta.displayName = 'Meta';
