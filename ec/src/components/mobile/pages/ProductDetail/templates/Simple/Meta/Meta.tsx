import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import type { TabId } from '@/models/domain/series/tab';
import { PAGE_SIZE } from '@/models/pages/productDetail/shared.mobile';
import { pagesPath } from '@/utils/$path';
import { first } from '@/utils/collection';
import { getOGImageUrl } from '@/utils/domain/image';
import {
	getDepartmentKeywords,
	getDescriptionMessage,
} from '@/utils/domain/metaTag';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { convertToURLString } from '@/utils/url';

type Props = {
	series: Series;
	partNumberResponse: SearchPartNumberResponse$search;
	defaultTabId?: TabId;
};

/** Simple meta component */
export const Meta: VFC<Props> = ({
	series,
	defaultTabId,
	partNumberResponse,
}) => {
	const [t] = useTranslation();
	const router = useRouter();
	const params = getOneParams(
		router.query,
		'Page',
		'Tab',
		'HissuCode',
		'ProductCode'
	);
	const restParams = getOneParams(
		router.query,
		'CategorySpec',
		'CAD',
		'HyjnNoki'
	);

	const { totalCount } = partNumberResponse;
	const { seriesName, brandName, productImageList } = series;
	const { Tab: tabId, HissuCode: hissuCode } = params;
	const page = Number(params.Page) || 1;
	const productImage = first(productImageList);
	const detailPagePath = pagesPath.vona2.detail._seriesCode(series.seriesCode);

	// Page title
	const pageTitle = useMemo(() => {
		if (hissuCode) {
			return t(
				'mobile.pages.productDetail.templates.simple.meta.title.withPartNumber',
				{
					seriesName: removeTags(seriesName),
					brandName: removeTags(brandName),
					partNumber: removeTags(hissuCode),
				}
			);
		}

		if (page > 1) {
			return t(
				'mobile.pages.productDetail.templates.simple.meta.title.withoutPartNumber.pagination',
				{
					page,
					seriesName: removeTags(seriesName),
					brandName: removeTags(brandName),
				}
			);
		}

		return t(
			'mobile.pages.productDetail.templates.simple.meta.title.withoutPartNumber.withoutPagination',
			{
				seriesName: removeTags(seriesName),
				brandName: removeTags(brandName),
			}
		);
	}, [brandName, hissuCode, page, seriesName, t]);

	// Meta title content
	const title = useMemo(() => {
		if (page > 1) {
			return t(
				'mobile.pages.productDetail.templates.simple.meta.title.withoutPartNumber.pagination',
				{
					page,
					seriesName: removeTags(seriesName),
					brandName: removeTags(brandName),
				}
			);
		}

		return t(
			'mobile.pages.productDetail.templates.simple.meta.title.withoutPartNumber.withoutPagination',
			{
				seriesName: removeTags(seriesName),
				brandName: removeTags(brandName),
			}
		);
	}, [brandName, page, seriesName, t]);

	// canonicalURL url content
	const canonicalURL = useMemo(() => {
		const query: Record<string, string> = {};

		if (tabId && tabId !== defaultTabId) {
			query['Tab'] = tabId;
		}

		return pagesPath.vona2.detail
			._seriesCode(series.seriesCode)
			.$url({ query });
	}, [defaultTabId, series.seriesCode, tabId]);

	// Meta image content
	const imageUrl = getOGImageUrl(productImage?.url);

	// Meta description content
	const description = useMemo(() => {
		const topCategoryCode = first(series.categoryList)?.categoryCode;
		const translationParams: {
			seriesName: string;
			brandName: string;
			partNumber: string;
			partNumberPage: string;
		} = {
			seriesName: removeTags(seriesName),
			brandName: removeTags(brandName),
			partNumber: removeTags(hissuCode ?? ''),
			partNumberPage: '',
		};

		if (hissuCode) {
			const messageWithPartNumber = [
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withPartNumber.group1',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withPartNumber.group2',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withPartNumber.group3',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withPartNumber.group4',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withPartNumber.group5',
					translationParams
				),
			];
			return getDescriptionMessage(messageWithPartNumber, topCategoryCode);
		}

		if (!hissuCode) {
			if (page > 1) {
				translationParams.partNumberPage = t(
					'mobile.pages.productDetail.templates.simple.meta.description.partNumberPage',
					{
						page,
					}
				);
			}

			const messageWithoutPartNumber = [
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withoutPartNumber.group1',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withoutPartNumber.group2',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withoutPartNumber.group3',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withoutPartNumber.group4',
					translationParams
				),
				t(
					'mobile.pages.productDetail.templates.simple.meta.description.withoutPartNumber.group5',
					translationParams
				),
			];
			return getDescriptionMessage(messageWithoutPartNumber, topCategoryCode);
		}

		return '';
	}, [brandName, hissuCode, page, series.categoryList, seriesName, t]);

	// Meta keywords content
	const keywords = useMemo(() => {
		const categoryKeywords = series.categoryList
			.map(category => category.categoryName)
			.reverse()
			.join(', ');

		const departmentKeywords = getDepartmentKeywords(series.departmentCode, t);

		return `${removeTags(brandName)}, ${removeTags(seriesName)}, ${removeTags(
			categoryKeywords
		)}, ${removeTags(departmentKeywords)}`;
	}, [brandName, series.categoryList, series.departmentCode, seriesName, t]);

	const isNoIndexNoFollow =
		totalCount === 0 ||
		defaultTabId === 'catalog' ||
		(tabId && tabId !== 'codeList');

	const needsPrev = totalCount && totalCount > PAGE_SIZE && page > 1;

	const needsNext = totalCount && page < Math.ceil(totalCount / PAGE_SIZE);

	const needsCanonical = useMemo(() => {
		const routerQuery = { ...router.query };

		// NOTE: router query unset seriesCode
		delete routerQuery.seriesCode;
		let paramsCount = Object.keys(routerQuery).length;

		if (paramsCount === 0 || defaultTabId === 'catalog') {
			return false;
		}

		// NOTE: router query unset Tab
		delete routerQuery.Tab;
		paramsCount = Object.keys(routerQuery).length;
		if (
			(paramsCount === 0 && tabId && tabId !== defaultTabId) ||
			(paramsCount === 1 && params.Page)
		) {
			return false;
		}

		return true;
	}, [defaultTabId, params.Page, router.query, tabId]);

	return (
		<Head>
			<title>{pageTitle}</title>

			<meta property="og:title" content={title} />
			<meta property="og:url" content={convertToURLString(canonicalURL)} />
			<meta property="og:type" content="website" />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:description" content={description} />
			<meta
				property="og:site_name"
				content={t('mobile.pages.productDetail.templates.simple.meta.siteName')}
			/>

			<meta
				name="author"
				content={t('mobile.pages.productDetail.templates.simple.meta.siteName')}
			/>
			<meta
				name="copyright"
				content={t('mobile.pages.productDetail.templates.simple.meta.siteName')}
			/>
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
							query: { Page: page - 1, ...restParams },
						})
					)}
				/>
			)}
			{needsNext && (
				<link
					rel="next"
					href={convertToURLString(
						detailPagePath.$url({
							query: { Page: page + 1, ...restParams },
						})
					)}
				/>
			)}
		</Head>
	);
};
Meta.displayName = 'Meta';
