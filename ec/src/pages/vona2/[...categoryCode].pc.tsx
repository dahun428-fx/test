import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Props, SharedQuery } from './[...categoryCode].types';
import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import {
	isErrorResponse,
	searchCategory$suppressResponseCode,
} from '@/api/services/searchCategory';
import { Props as CategoryProps } from '@/components/pc/pages/Category';
import { Flag } from '@/models/api/Flag';
import {
	AncesterType,
	SearchCategoryRequest,
} from '@/models/api/msm/ect/category/SearchCategoryRequest';
import { getSeriesAndBrandResponse } from '@/store/modules/pages/category/operations';
import { assertArray } from '@/utils/assertions';
import { first, last } from '@/utils/collection';
import { getCategoryPageUrl, getCategoryParams } from '@/utils/domain/category';
import { parseSpecValue } from '@/utils/domain/spec';
import { removeEmptyProperties } from '@/utils/object';
import { cookie, log, logError } from '@/utils/server';

export type OptionalQuery = SharedQuery;

const Category = dynamic<CategoryProps>(
	() =>
		import('@/components/pc/pages/Category').then(modules => modules.Category),
	{ ssr: false }
);

const CategoryPage: NextPage<Props> = props => {
	const router = useRouter();
	return <Category {...props} key={router.asPath} />;
};
CategoryPage.displayName = 'CategoryPage';

export const getServerSideProps: GetServerSideProps = async ({
	query,
	req,
	res,
	resolvedUrl,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const categoryCodeList = query.categoryCode;

	assertArray(categoryCodeList);
	const lastCategoryCode = last(categoryCodeList);
	const topCategoryCode = first(categoryCodeList);

	if (!lastCategoryCode) {
		return {
			notFound: true,
		};
	}

	const { pageSize } = cookie({
		cookie: req?.headers.cookie,
	});
	const { brandCode, cadType, categorySpec, page, daysToShip, cValueFlag } =
		getCategoryParams(query);

	const isTopCategory = categoryCodeList.length === 1;

	const requestData: SearchCategoryRequest = {
		categoryCode: lastCategoryCode,
	};

	requestData.categoryLevel = isTopCategory ? 0 : 2;
	requestData.ancesterType = isTopCategory
		? AncesterType.NO_GET
		: AncesterType.GET_FROM_DIRECT_TOP_CATEGORY;

	try {
		log('Category', resolvedUrl);
		const categoryResponse = await searchCategory$suppressResponseCode({
			...requestData,
		});

		if (isErrorResponse(categoryResponse)) {
			if (categoryResponse.status === 301) {
				return {
					redirect: {
						statusCode: 301,
						destination: getCategoryPageUrl(
							...categoryResponse.errorList[0].errorParameterList[0]
						),
					},
				};
			}

			if (categoryResponse.status >= 400) {
				throw new Error(
					`Internal server error status = ${categoryResponse.status}`
				);
			}

			throw new Error(`Unknown error status = ${categoryResponse.status}`);
		}

		const { seriesResponse, brandResponse } = await getSeriesAndBrandResponse({
			categoryCode: requestData.categoryCode,
			categoryResponse,
			params: {
				allSpecFlag: Flag.TRUE,
				brandCode,
				cadType,
				daysToShip,
				page,
				pageSize,
				cValueFlag,
				...parseSpecValue(categorySpec),
			},
		});

		const rootCategory = first(categoryResponse.categoryList);

		if (!rootCategory) {
			return {
				notFound: true,
			};
		}

		const props = {
			categoryResponse,
			seriesResponse,
			brandResponse,
			categoryCode: lastCategoryCode,
			topCategoryCode,
			isTopCategory,
			page,
			categorySpec,
		};

		return {
			props: removeEmptyProperties(props),
		};
	} catch (error) {
		logError('Category', resolvedUrl, error);
		throw error;
	}
};

export default CategoryPage;
