import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Props, SharedQuery } from './[...categoryCode].types';
import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchBrand } from '@/api/services/searchBrand';
import {
	isErrorResponse,
	searchCategory,
	searchCategory$suppressResponseCode,
} from '@/api/services/searchCategory';
import { Props as MakerCategoryProps } from '@/components/pc/pages/maker/MakerCategoryContainer';
import { Flag } from '@/models/api/Flag';
import {
	AncesterType,
	SearchCategoryRequest,
} from '@/models/api/msm/ect/category/SearchCategoryRequest';
import { getSeriesAndBrandResponse } from '@/store/modules/pages/category/operations';
import { assertArray, assertNotArray, assertNotNull } from '@/utils/assertions';
import { first, last } from '@/utils/collection';
import {
	getCategoryParams,
	getMakerCategoryPageUrl,
} from '@/utils/domain/category';
import { parseSpecValue } from '@/utils/domain/spec';
import { removeEmptyProperties } from '@/utils/object';
import { notEmpty } from '@/utils/predicate';
import { cookie, log, logError } from '@/utils/server';

export type OptionalQuery = SharedQuery;

const MakerCategoryContainer = dynamic<MakerCategoryProps>(
	() =>
		import('@/components/pc/pages/maker/MakerCategoryContainer').then(
			modules => modules.MakerCategoryContainer
		),
	{ ssr: false }
);

/** Maker category page */
const MakerCategoryPage: NextPage<Props> = props => {
	const router = useRouter();
	return <MakerCategoryContainer key={router.asPath} {...props} />;
};
MakerCategoryPage.displayName = 'MakerCategoryPage';

export const getServerSideProps: GetServerSideProps = async ({
	query,
	req,
	res,
	resolvedUrl,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const brandCode = query.brandCode;
	const categoryCodeList = query.categoryCode;
	assertArray(categoryCodeList);
	const lastCategoryCode = last(categoryCodeList);
	const isMakerCategoryTop = categoryCodeList.length === 1;
	const { pageSize } = cookie({ cookie: req?.headers.cookie });
	const { page, cadType, categorySpec, cValueFlag } = getCategoryParams(query);
	const params = isMakerCategoryTop ? undefined : { pageSize, page };

	try {
		log('Maker Category', resolvedUrl);

		const brandResponse = await searchBrand({
			brandCode,
		});
		const brand = first(brandResponse.brandList);

		if (!brand) {
			return {
				notFound: true,
			};
		}

		const categoryRequest: SearchCategoryRequest = {
			brandCode: brand.brandCode,
			categoryLevel: 2,
			ancesterType: AncesterType.NO_GET,
			categoryCode: lastCategoryCode,
		};

		let categoryResponse = await searchCategory$suppressResponseCode({
			...categoryRequest,
			categoryLevel: isMakerCategoryTop ? 0 : 2,
		});

		assertNotArray(brandCode);
		assertNotNull(brandCode);

		if (isErrorResponse(categoryResponse)) {
			if (categoryResponse.status === 301) {
				return {
					redirect: {
						statusCode: 301,
						destination: getMakerCategoryPageUrl(
							brandCode,
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

		const seriesAndBrandResponse = await getSeriesAndBrandResponse({
			categoryCode: lastCategoryCode,
			categoryResponse,
			params: {
				...params,
				...parseSpecValue(categorySpec),
				brandCode,
				cadType,
				allSpecFlag: Flag.TRUE,
				cValueFlag,
			},
		});

		if (!isMakerCategoryTop && notEmpty(categoryResponse.categoryList)) {
			categoryResponse = await searchCategory({
				...categoryRequest,
				ancesterType: AncesterType.GET_FROM_DIRECT_TOP_CATEGORY,
			});
		}

		let topCategoriesResponse;
		if (isMakerCategoryTop && notEmpty(categoryResponse.categoryList)) {
			topCategoriesResponse = await searchCategory({
				...categoryRequest,
				categoryLevel: 3,
				categoryCode: undefined,
			});
		}

		// NOTE: For Maker TOP category page, categoryCode won't be set to categorySearch API.
		// 500 error will be thrown in case of categoryCode from query is not included in categoryList from response.
		const hasCategory = topCategoriesResponse?.categoryList.some(
			category => category.categoryCode === lastCategoryCode
		);

		if (
			!notEmpty(categoryResponse.categoryList) ||
			(isMakerCategoryTop && !hasCategory)
		) {
			return {
				notFound: true,
			};
		}

		const props = {
			brandResponse,
			seriesResponse: seriesAndBrandResponse.seriesResponse,
			brandIndexList: seriesAndBrandResponse.brandResponse?.brandList,
			categoryResponse,
			categoryCode: lastCategoryCode,
			categorySpec,
			page,
			isMakerCategoryTop,
			categoryTopList: topCategoriesResponse?.categoryList ?? [],
		};

		return {
			props: removeEmptyProperties(props),
		};
	} catch (error) {
		logError('Maker Category', resolvedUrl, error);
		throw error;
	}
};

export default MakerCategoryPage;
