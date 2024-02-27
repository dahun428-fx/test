import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Props, SharedOptionalQuery } from './[seriesCode].types';
import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchSeries$detail } from '@/api/services/searchSeries';
import type { Props as ProductDetailProps } from '@/components/pc/pages/ProductDetail';
import { searchPartNumber$search as parametricUnitSearchPartNumber } from '@/api/services/parametricUnit';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import {
	getPageSize,
	getParams,
	getRedirectTo,
} from '@/pages/vona2/detail/[seriesCode].utils';
import { assertNotNull } from '@/utils/assertions';
import { getTemplateType } from '@/utils/domain/series';
import { log, logError } from '@/utils/server';
import { url } from '@/utils/url';
import { omit } from '@/utils/object';

export type OptionalQuery = SharedOptionalQuery;

const ProductDetail = dynamic<ProductDetailProps>(
	() =>
		import('@/components/pc/pages/ProductDetail').then(
			modules => modules.ProductDetail
		),
	{ ssr: false }
);

/**
 * Product Detail Page
 */
const ProductDetailPage: NextPage<Props> = ({
	seriesResponse,
	partNumberResponse,
}) => {
	const { query } = useRouter();

	return (
		<ProductDetail
			seriesResponse={seriesResponse}
			partNumberResponse={partNumberResponse}
			{...getParams(query)}
		/>
	);
};
ProductDetailPage.displayName = 'ProductDetailPage';

export const getServerSideProps: GetServerSideProps<Props> = async ({
	res,
	req,
	query,
	resolvedUrl,
}) => {
	const {
		seriesCode,
		partNumber,
		page,
		cadType,
		categorySpec,
		daysToShip,
		tab,
		template,
	} = getParams(query);

	try {
		sessionManager.init({ cookie: req.headers.cookie, response: res });
		queryManager.init({ query });

		log('Product Detail', resolvedUrl);

		if (page === 1 && tab === 'codeList') {
			return {
				props: {},
				redirect: {
					statusCode: 301,
					destination: url
						.productDetail(seriesCode)
						.default(omit(query, 'Page', 'Tab')),
				},
			};
		}

		if (page === 1) {
			return {
				props: {},
				redirect: {
					statusCode: 301,
					destination: url
						.productDetail(seriesCode)
						.default(omit(query, 'Page')),
				},
			};
		}

		if (tab === 'codeList') {
			return {
				props: {},
				redirect: {
					statusCode: 301,
					destination: url
						.productDetail(seriesCode)
						.default(omit(query, 'Tab')),
				},
			};
		}

		const seriesResponse = await searchSeries$detail({
			seriesCode,
			pageSize: 1,
		});

		if (!seriesResponse.seriesList.length) {
			return { notFound: true };
		}

		const [series] = seriesResponse.seriesList;
		assertNotNull(series);

		const templateType = getTemplateType(series.templateType, template);

		let searchPartNumberRequest;
		switch (templateType) {
			case TemplateType.PU:
				searchPartNumberRequest = parametricUnitSearchPartNumber;
				break;
			default:
				searchPartNumberRequest = searchPartNumber$search;
		}

		const partNumberResponse = await searchPartNumberRequest({
			seriesCode,
			partNumber,
			pageSize: getPageSize(req.headers.cookie, tab),
			specSortFlag: Flag.FALSE,
			allSpecFlag: Flag.TRUE,
			page,
			cadType,
			daysToShip,
			...categorySpec,
		});

		// 単純系、複雑系の場合は型番検索結果がない場合は 404 とする
		if (
			Array<string>(TemplateType.SIMPLE, TemplateType.COMPLEX).includes(
				templateType
			) &&
			partNumberResponse.partNumberList.length === 0
		) {
			return { notFound: true };
		}

		return { props: { seriesResponse, partNumberResponse } };
	} catch (error) {
		// 301 moved permanently
		if (error instanceof MsmApiError) {
			if (error.isMovedPermanently) {
				const redirectTo = getRedirectTo(error);
				if (redirectTo) {
					return {
						redirect: {
							statusCode: 301,
							destination: url.productDetail(redirectTo).default(),
						},
					};
				}
			}
			logError('Product Detail', resolvedUrl, error);

			// リダイレクト先が見つからない場合やその他のAPIエラーは、Not Found とする（現行と同一挙動）
			// その他のエラーはサーバーエラーとする
			return { notFound: true };
		}

		logError('Product Detail', resolvedUrl, error);

		throw error;
	}
};

export default ProductDetailPage;
