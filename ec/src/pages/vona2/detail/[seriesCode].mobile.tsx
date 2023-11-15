import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Props, SharedOptionalQuery } from './[seriesCode].types';
import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchPartNumber$search } from '@/api/services/searchPartNumber';
import { searchSeries$detail } from '@/api/services/searchSeries';
import { ProductDetail } from '@/components/mobile/pages/ProductDetail';
import { MsmApiError } from '@/errors/api/MsmApiError';
import { Flag } from '@/models/api/Flag';
import { TemplateType } from '@/models/api/constants/TemplateType';
import { PAGE_SIZE } from '@/models/pages/productDetail/shared.mobile';
import { NextPageWithLayout } from '@/pages/types';
import {
	getParams,
	getRedirectTo,
} from '@/pages/vona2/detail/[seriesCode].utils';
import { assertNotNull } from '@/utils/assertions';
import { getTemplateType } from '@/utils/domain/series';
import { log, logError } from '@/utils/server';
import { url } from '@/utils/url';

export type OptionalQuery = SharedOptionalQuery;

/**
 * Product Detail Page
 */
const ProductDetailPage: NextPageWithLayout<Props> = ({
	seriesResponse,
	partNumberResponse,
}) => {
	const { isReady, query } = useRouter();

	if (!isReady) {
		return null;
	}

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
	req,
	res,
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
		template,
	} = getParams(query);

	try {
		sessionManager.init({ cookie: req.headers.cookie, response: res });
		queryManager.init({ query });

		log('Product Detail', resolvedUrl);

		const [seriesResponse, partNumberResponse] = await Promise.all([
			searchSeries$detail({ seriesCode, pageSize: 1 }),
			searchPartNumber$search({
				seriesCode,
				partNumber,
				// NOTE: PC / mobile で pageSize が異なるのが SEO 上大丈夫か気になりますが、榎本さんから永野さんに確認済みです。(2023/3/9)
				pageSize: PAGE_SIZE, // ect-web-th では cookie や Tab パラメータは無視されている
				specSortFlag: Flag.FALSE,
				allSpecFlag: Flag.TRUE,
				page,
				cadType,
				daysToShip,
				...categorySpec,
			}),
		]);

		if (!seriesResponse.seriesList.length) {
			return { notFound: true };
		}

		const [series] = seriesResponse.seriesList;
		assertNotNull(series);

		const templateType = getTemplateType(series.templateType, template);

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
							destination: url.productDetail(redirectTo).default,
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
