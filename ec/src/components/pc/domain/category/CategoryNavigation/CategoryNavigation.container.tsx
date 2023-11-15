import { useRouter } from 'next/router';
import { useMemo, VFC } from 'react';
import { CategoryNavigation as Presenter, Target } from './CategoryNavigation';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { useSelector } from '@/store/hooks';
import {
	selectCategoryResponse,
	selectSeriesResponse,
} from '@/store/modules/pages/category';
import { assertArray } from '@/utils/assertions';
import { last } from '@/utils/collection';
import { getCategoryListFromRoot } from '@/utils/domain/category';

type Props = {
	brand?: Brand;
	target?: Target;
	categoryTopList?: Category[];
	categoryCode?: string;
};

/** Category navigation container component */
export const CategoryNavigation: VFC<Props> = ({
	brand,
	target = 'CATEGORY',
	categoryTopList,
	categoryCode,
}) => {
	const rootCategory = useSelector(selectCategoryResponse);
	const seriesResponse = useSelector(selectSeriesResponse);

	const router = useRouter();
	const categoryCodeList = router.query.categoryCode;

	const categories = useMemo(() => {
		if (target === 'MAKER_TOP') {
			return rootCategory?.categoryList ?? [];
		}

		assertArray(categoryCodeList);
		const lastCategoryCode = last(categoryCodeList);

		if (!rootCategory || !lastCategoryCode) {
			return [];
		}

		const root =
			target === 'MAKER_CATEGORY_TOP'
				? rootCategory.categoryList.find(
						category => category.categoryCode === lastCategoryCode
				  )
				: rootCategory.categoryList[0];

		if (!root) {
			return [];
		}

		const categoryList = getCategoryListFromRoot(root, lastCategoryCode);

		const categoryCode = last(categoryList);

		if (!categoryList.length || !categoryCode) {
			return [];
		}

		if (categoryCodeList.length === 1) {
			return [categoryCode];
		}

		return categoryList;
	}, [categoryCodeList, rootCategory, target]);

	if (!rootCategory || !categories.length) {
		return null;
	}

	return (
		<Presenter
			target={target}
			categories={categories}
			seriesCategories={seriesResponse?.categoryList}
			key={router.asPath}
			brand={brand}
			categoryTopList={categoryTopList}
			categoryCode={categoryCode}
		/>
	);
};
CategoryNavigation.displayName = 'CategoryNavigation';
