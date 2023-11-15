import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag } from '@/models/api/Flag';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import type { TabId } from '@/models/domain/series/tab';
import { pagesPath } from '@/utils/$path';
import { getDepartmentKeywords } from '@/utils/domain/metaTag';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { getOneParams } from '@/utils/query';
import { removeTags } from '@/utils/string';
import { convertToURLString } from '@/utils/url';

type Props = {
	series: Series;
	partNumberResponse: SearchPartNumberResponse$search;
	defaultTabId?: TabId;
};

/** Simple Meta component */
export const Meta: VFC<Props> = ({
	series,
	partNumberResponse,
	defaultTabId,
}) => {
	const { t } = useTranslation();
	const { query } = useRouter();
	const pageSize = getPartNumberPageSize(query.Tab);

	const params = getOneParams(
		query,
		...['Page', 'Tab', 'ProductCode', 'PNSearch', 'HissuCode']
	);

	const paginationParams = getOneParams(
		query,
		...['CategorySpec', 'CAD', 'HyjnNoki']
	);

	const hasProductCodeOrHissuCode = !!params.HissuCode || !!params.ProductCode;
	const { totalCount, completeFlag, partNumberList } = partNumberResponse;

	const simpleFlag = partNumberList[0]?.simpleFlag;
	const partNumber = partNumberList[0]?.partNumber;

	const detailPagePath = pagesPath.vona2.detail._seriesCode(series.seriesCode);
	const tabId = params.Tab;

	const page =
		!!params.Page && !!parseInt(params.Page) ? parseInt(params.Page) : 1;

	const title = useMemo(() => {
		let dynamicName = '';
		if (hasProductCodeOrHissuCode && !!partNumber) {
			dynamicName = partNumber;
		} else if (page > 1) {
			dynamicName = t('pages.productDetail.simple.meta.page', {
				page: page,
			});
		}

		const baseTitle = t('pages.productDetail.simple.meta.title', {
			seriesName: series.seriesName,
			brandName: series.brandName,
		});

		return dynamicName ? `${dynamicName} | ${baseTitle}` : baseTitle;
	}, [
		hasProductCodeOrHissuCode,
		page,
		partNumber,
		series.brandName,
		series.seriesName,
		t,
	]);

	const description = useMemo(() => {
		let pageText = '';
		let partNumberText = '';

		if (!hasProductCodeOrHissuCode && page > 1) {
			pageText = t('pages.productDetail.simple.meta.pageText', {
				page: page,
			});
		}

		if (hasProductCodeOrHissuCode && !!partNumber) {
			partNumberText = `${partNumber} `;
		}

		return t('pages.productDetail.simple.meta.description', {
			seriesName: series.seriesName,
			brandName: series.brandName,
			pageText,
			partNumberText,
		});
	}, [
		hasProductCodeOrHissuCode,
		page,
		partNumber,
		series.brandName,
		series.seriesName,
		t,
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

	// 以下のいずれかの条件を満たす場合に noindex/nofollow を出力。
	// １．Tab=catalogが付与されている。
	// ２．（型番が param で指定）フル型番パラメータが付与されている。
	// ３．（型番が param で未指定）Tab=codeListが付与されている。
	// ４．（型番が param で未指定）型番リストが0件。
	const isNoIndexNoFollow =
		tabId === 'catalog' ||
		(hasProductCodeOrHissuCode
			? !!params.ProductCode
			: tabId === 'codeList' || totalCount === 0);

	const needsCanonical = useMemo(() => {
		// NOTE: router query has seriesCode
		const paramsCount = Object.keys(query).filter(
			item => item !== 'seriesCode'
		).length;

		return hasProductCodeOrHissuCode
			? // カタログタブを初期表示でない
			  !(tabId === 'catalog') &&
					// フル型番パラメータが付与されていない
					!params.ProductCode &&
					// 必須型番コードのみでない
					!(paramsCount === 1 && params.HissuCode)
			: // クエリパラメータあり
			  paramsCount > 0 &&
					// カタログタブを初期表示でない
					!(tabId === 'catalog') &&
					// Tabパラメータのみでない、或いはTabパラメータがデフォルト表示のTabと一致する。
					(!(paramsCount === 1 && !!params.Tab) || defaultTabId === tabId) &&
					// Pageパラメータのみでない
					!(paramsCount === 1 && !!params.Page);
	}, [
		defaultTabId,
		hasProductCodeOrHissuCode,
		params.HissuCode,
		params.Page,
		params.ProductCode,
		params.Tab,
		query,
		tabId,
	]);

	const canonicalURL = useMemo(() => {
		const query: Record<string, string> = {};

		if (!!tabId && tabId !== defaultTabId) {
			query['Tab'] = tabId;
		}

		if (hasProductCodeOrHissuCode) {
			if (
				!!partNumber &&
				!!params.HissuCode &&
				Flag.isTrue(simpleFlag) &&
				Flag.isTrue(completeFlag)
			) {
				query['HissuCode'] = partNumber;
			}
		}

		return pagesPath.vona2.detail
			._seriesCode(series.seriesCode)
			.$url({ query });
	}, [
		completeFlag,
		defaultTabId,
		hasProductCodeOrHissuCode,
		params.HissuCode,
		partNumber,
		series.seriesCode,
		simpleFlag,
		tabId,
	]);

	const needsPrev = !!totalCount && totalCount > pageSize && page > 1;
	const needsNext = !!totalCount && page < Math.ceil(totalCount / pageSize);

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
Meta.displayName = 'Meta';
