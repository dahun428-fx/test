import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Props, SharedOptionalQuery } from './index.types';
import { queryManager } from '@/api/managers/queryManager';
import { sessionManager } from '@/api/managers/sessionManager';
import { searchBrand } from '@/api/services/searchBrand';
import { searchCategory } from '@/api/services/searchCategory';
import { MakerTop } from '@/components/pc/pages/maker/MakerTop';
import { Standard } from '@/layouts/pc/standard';
import {
	AncesterType,
	SearchCategoryRequest,
} from '@/models/api/msm/ect/category/SearchCategoryRequest';
import { NextPageWithLayout } from '@/pages/types';
import { first } from '@/utils/collection';
import { removeEmptyProperties } from '@/utils/object';

export type OptionalQuery = SharedOptionalQuery;

/** Maker top page */
const MakerTopPage: NextPageWithLayout<Props> = props => {
	const router = useRouter();

	return <MakerTop key={router.asPath} {...props} />;
};
MakerTopPage.displayName = 'MakerTopPage';
MakerTopPage.getLayout = Standard;

export const getServerSideProps: GetServerSideProps = async ({
	query,
	req,
	res,
}) => {
	sessionManager.init({ cookie: req.headers.cookie, response: res });
	queryManager.init({ query });

	const brandCode = query.brandCode;

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
		categoryLevel: 3,
		ancesterType: AncesterType.NO_GET,
	};

	const categoryResponse = await searchCategory(categoryRequest);

	const props = {
		brandResponse,
		categoryResponse,
	};

	return {
		props: removeEmptyProperties(props),
	};
};

export default MakerTopPage;
