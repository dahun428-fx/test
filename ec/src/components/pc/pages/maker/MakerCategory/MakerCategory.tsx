import { VFC } from 'react';
import { useMakerCategory } from './MakerCategory.hooks';
import { Meta } from './Meta';
import { CategoryList } from '@/components/pc/domain/category/CategoryList';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { first } from '@/utils/collection';

type Props = {
	category: Category;
	categoryList: Category[];
	brand: Brand;
};

/** Maker category page */
export const MakerCategory: VFC<Props> = ({
	category,
	categoryList,
	brand,
}) => {
	const { seriesResponse } = useMakerCategory();

	useOnMounted(() => {
		aa.pageView.maker.category
			.lower({
				categoryCodeList: [
					...category.parentCategoryCodeList,
					category.categoryCode,
				],
				brandCode: brand.brandCode,
			})
			.then();
		ga.pageView.maker
			.category({
				brandCode: brand.brandCode,
				brandName: brand.brandName,
				misumiFlag: brand.misumiFlag,
				departmentCode: category.departmentCode,
				categoryList: categoryList.slice(1).map(category => ({
					categoryCode: category.categoryCode,
					categoryName: category.categoryName,
				})),
				categoryCode: first(categoryList)?.categoryCode,
			})
			.then();
		ectLogger.visit({
			classCode: ClassCode.CATEGORY,
		});
	});

	const seriesCategories = seriesResponse?.categoryList;
	return (
		<>
			<Meta brand={brand} category={category} />
			<div>
				{category.childCategoryList.length > 0 && (
					<CategoryList
						seriesCategories={seriesCategories}
						brand={brand}
						categoryList={category.childCategoryList}
					/>
				)}
			</div>
		</>
	);
};
MakerCategory.displayName = 'MakerCategory';
