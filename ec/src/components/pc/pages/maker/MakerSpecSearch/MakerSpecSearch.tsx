import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Meta } from './Meta';
import { CategoryList } from '@/components/pc/domain/category/CategoryList';
import { SeriesList } from '@/components/pc/domain/category/SeriesList';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { first } from '@/utils/collection';
import { getSeriesListPageSize, toDisplayType } from '@/utils/domain/spec';

type Props = {
	seriesResponse?: SearchSeriesResponse$search;
	category: Category;
	categoryList: Category[];
	brand: Brand;
	categoryMainId: string;
	seriesPage: number;
};

/** Maker spec search component */
export const MakerSpecSearch: React.VFC<Props> = ({
	category,
	categoryList,
	brand,
	categoryMainId,
	seriesResponse,
}) => {
	const router = useRouter();
	const { defaultDisplayType } = useSpecSearchContext();

	useOnMounted(() => {
		aa.pageView.maker.category
			.spec({
				brandCode: brand.brandCode,
				categoryCodeList: [
					...category.parentCategoryCodeList,
					category.categoryCode,
				],
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
				layout: toDisplayType(defaultDisplayType),
				pageSize: getSeriesListPageSize(),
				productClass: 'Product',
			})
			.then();
		ectLogger.visit({
			classCode: ClassCode.CATEGORY,
			specSearchDispType: toDisplayType(defaultDisplayType),
		});
	});

	useEffect(() => {
		// NOTE: Trigger scroll event to calculate initial sticky position.
		const timer = setTimeout(() => {
			window.scrollTo(0, window.scrollY + 1);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<Meta category={category} brand={brand} />
			<div id={categoryMainId}>
				{category && category.childCategoryList.length > 0 && (
					<CategoryList
						seriesCategories={seriesResponse?.categoryList}
						brand={brand}
						categoryList={category.childCategoryList}
					/>
				)}
				<SeriesList
					key={router.asPath}
					categoryCode={category.categoryCode}
					stickyBottomSelector={`#${categoryMainId}`}
					categoryMainSelector={`#${categoryMainId}`}
				/>
			</div>
		</>
	);
};
MakerSpecSearch.displayName = 'MakerSpecSearch';
