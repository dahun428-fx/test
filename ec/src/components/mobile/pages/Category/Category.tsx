import Router from 'next/router';
import { VFC, useMemo } from 'react';
import { CategoryDescription } from './CategoryDescription';
import { CategoryList } from '@/components/mobile/pages/Category/CategoryList';
import { SeriesList } from '@/components/mobile/pages/Category/SeriesList';
import { Flag } from '@/models/api/Flag';
import {
	SearchCategoryResponse,
	Category as CategoryItem,
} from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { getCategoryListFromRoot } from '@/utils/domain/category';

export type Props = {
	topCategoryCode: string;
	categoryCode: string;
	categoryResponse: SearchCategoryResponse;
	currentCategory: CategoryItem;
	isTopCategory: boolean;
	loading: boolean;
};

export const Category: VFC<Props> = ({
	topCategoryCode,
	categoryCode,
	categoryResponse,
	currentCategory,
	loading,
}) => {
	const flattenCategoryList = useMemo(() => {
		if (!categoryResponse.categoryList[0]) {
			return [];
		}
		return getCategoryListFromRoot(
			categoryResponse.categoryList[0],
			categoryCode
		);
	}, [categoryCode, categoryResponse.categoryList]);

	/**
	 * SeriesList key
	 * - router.asPath を直接 key に指定すると(key={router.asPath})、
	 *   router.asPath 変更時点で currentCategory が古いので、このようにしています。
	 *   (カテゴリ検索結果が更新されたタイミングで key を更新。
	 *    内容はその時点のパラメータ付きパスで良いので、router.asPath ではなく Router.asPath を使用)
	 */
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const key = useMemo(() => Router.asPath, [categoryResponse]);

	return (
		<>
			{Flag.isTrue(currentCategory.specSearchFlag) ? (
				<SeriesList
					key={key}
					category={currentCategory}
					topCategoryCode={topCategoryCode}
					categoryList={categoryResponse.categoryList}
					loadingCategory={loading}
					rootCategoryList={flattenCategoryList}
				/>
			) : (
				<CategoryList
					currentCategoryCode={categoryCode}
					topCategoryCode={topCategoryCode}
					flattenCategoryList={flattenCategoryList}
				/>
			)}
			{currentCategory.categoryDetail && (
				<CategoryDescription
					categoryName={currentCategory.categoryName}
					categoryDetail={currentCategory.categoryDetail}
				/>
			)}
		</>
	);
};
Category.displayName = 'Category';
