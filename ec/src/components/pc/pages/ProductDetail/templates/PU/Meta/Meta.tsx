import { Flag } from '@/models/api/Flag';
import { SearchPartNumberResponse$search } from '@/models/api/msm/ect/partNumber/SearchPartNumberResponse$search';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { TabId } from '@/models/domain/series/tab';
import { pagesPath } from '@/utils/$path';
import { first } from '@/utils/collection';
import {
	seriesDescContent,
	seriesKeywordsContent,
} from '@/utils/domain/metaTag';
import { getPartNumberPageSize } from '@/utils/domain/partNumber';
import { getDetailTabInfo } from '@/utils/domain/series';
import { getOneParams } from '@/utils/query';
import { adjustTrailingSlashForSeo, convertToURLString } from '@/utils/url';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { VFC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	series: Series;
	partNumberResponse: SearchPartNumberResponse$search;
	defaultTabId?: TabId;
};

export const Meta: VFC<Props> = ({ series, partNumberResponse }) => {
	const { t } = useTranslation();
	const { query } = useRouter();
	const pageSize = getPartNumberPageSize(query.Tab);
	const hasProductCodeKey = query.hasOwnProperty('ProductCode');

	const params = getOneParams(
		query,
		...['Page', 'Tab', 'ProductCode', 'PNSearch', 'HissuCode', 'DEV', 'wl']
	);

	const paginationParams = getOneParams(
		query,
		...['CategorySpec', 'CAD', 'HyjnNoki']
	);
	const paramsCount = Object.keys(query).filter(
		item => item !== 'seriesCode'
	).length;
	const { totalCount, completeFlag, partNumberList } = partNumberResponse;

	const simpleFlag = partNumberList[0]?.simpleFlag;
	const partNumber = partNumberList[0];
	const partNumberTotalCount = partNumberResponse?.partNumberList.length ?? 0;
	const detailPagePath = pagesPath.vona2.detail._seriesCode(series.seriesCode);
	const tabId = params.Tab;
	const invisibleTabList: TabId[] = useMemo(
		() => [
			'codeList',
			'catalog',
			'technicalInformation',
			'pdf',
			'standardSpecifications',
		],
		[]
	);

	const page =
		!!params.Page && !!parseInt(params.Page) ? parseInt(params.Page) : 1;

	const isSpecifiedPartNumber =
		!params.Tab &&
		!params.Page &&
		!paginationParams.CategorySpec &&
		!params.PNSearch &&
		!!params.HissuCode &&
		partNumberTotalCount === 1;

	const specifiedPartNumber = useMemo(() => {
		if (isSpecifiedPartNumber && partNumber) {
			return partNumber.partNumber;
		}

		if (
			params.HissuCode &&
			params.wl &&
			(params.wl === '1' || params.wl === '2') &&
			partNumberTotalCount >= 1
		) {
			return params.HissuCode;
		}

		return '';
	}, [
		isSpecifiedPartNumber,
		params.HissuCode,
		params.wl,
		partNumber,
		partNumberTotalCount,
	]);

	const titlePrefix = useMemo(() => {
		if (specifiedPartNumber) {
			return `${series.seriesName}, ${specifiedPartNumber}, ${series.brandName}`;
		} else {
			return `${series.seriesName}, ${series.brandName}`;
		}
	}, [
		series,
		partNumber,
		completeFlag,
		specifiedPartNumber,
		partNumberResponse,
		t,
	]);

	const title = t('pages.productDetail.pu.meta.title', {
		prefix: titlePrefix,
	});

	const description = t('pages.productDetail.pu.meta.description', {
		description: seriesDescContent(series, specifiedPartNumber),
	});

	const keywords = t('pages.productDetail.pu.meta.keywords', {
		keywords: seriesKeywordsContent(series, t),
	});

	const isNoIndexNoFollow =
		!!params.DEV ||
		!!params.ProductCode ||
		partNumberTotalCount === 0 ||
		(!!params.Tab && params.Tab !== 'codeList');

	const isQueryForCanonical = Object.keys(query)
		.filter(item => item !== 'seriesCode')
		.some(item => item !== 'Tab');

	const isDefaultTab = useMemo(() => {
		if (!params.Tab) {
			return false;
		}

		const wysiwygTabs = getDetailTabInfo(series, invisibleTabList);

		if (wysiwygTabs.length) {
			return first(wysiwygTabs)?.id === params.Tab;
		}

		return false;
	}, [invisibleTabList, params.Tab, series]);

	const needsCanonical = !(
		paramsCount === 0 ||
		params.DEV ||
		(params.Tab && params.Tab === 'catalog') ||
		hasProductCodeKey ||
		(!isQueryForCanonical && !isDefaultTab) ||
		(paramsCount === 1 && params.Page)
	);

	const isSetHissuCodeToCanonical = useMemo(() => {
		if (
			params.HissuCode &&
			Flag.isTrue(completeFlag) &&
			params.wl &&
			params.wl === '1'
		) {
			return true;
		}

		if (
			params.HissuCode &&
			Flag.isTrue(completeFlag) &&
			Flag.isTrue(simpleFlag)
		) {
			return true;
		}

		if (
			params.HissuCode &&
			partNumberTotalCount >= 1 &&
			params.wl &&
			params.wl === '2'
		) {
			return true;
		}

		return false;
	}, [
		completeFlag,
		params.HissuCode,
		params.wl,
		partNumberTotalCount,
		simpleFlag,
	]);

	const canonicalURL = useMemo(() => {
		const query: Record<string, string> = {};
		const isPage2Over = !!params.Page && parseInt(params.Page) > 1;

		if (tabId && !isDefaultTab) {
			if (tabId === 'codeList' && isPage2Over && params.Page) {
				query['Page'] = params.Page;
			}

			query['Tab'] = tabId;
		} else if (tabId && tabId === 'codeList' && isPage2Over && params.Page) {
			query['Page'] = params.Page;
			query['Tab'] = tabId;
		} else if (partNumber && isSetHissuCodeToCanonical) {
			if (params.wl && (params.wl === '1' || params.wl === '2')) {
				query['wl'] = params.wl;
			}

			if (params.HissuCode) {
				query['HissuCode'] = params.HissuCode;
			}
		}

		return adjustTrailingSlashForSeo(
			convertToURLString(
				pagesPath.vona2.detail._seriesCode(series.seriesCode).$url({ query })
			)
		);
	}, [
		isDefaultTab,
		isSetHissuCodeToCanonical,
		params.HissuCode,
		params.Page,
		params.wl,
		partNumber,
		series.seriesCode,
		tabId,
	]);

	/** todo : check ---> codeList page param is available */
	const needsPrev = !!totalCount && totalCount > pageSize && page > 1;
	const needsNext = !!totalCount && page < Math.ceil(totalCount / pageSize);

	const prevUrl = useMemo(() => {
		const query: Record<string, string | undefined> = {
			...paginationParams,
		};

		if (page !== 2) {
			query['Page'] = String(page - 1);
		}

		return detailPagePath.$url({
			query,
		});
	}, [detailPagePath, page, paginationParams]);

	return (
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			{isNoIndexNoFollow && <meta name="robots" content="noindex,nofollow" />}
			{needsCanonical && <link rel="canonical" href={canonicalURL} />}
			{needsPrev && <link rel="prev" href={convertToURLString(prevUrl)} />}
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
