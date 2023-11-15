import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MakerCategoryContainer.module.scss';
import { RecommendCategory } from '@/components/pc/domain/category/CameleerContents/_legacy/RecommendCategory';
import { ViewHistorySimulPurchase } from '@/components/pc/domain/category/CameleerContents/_legacy/ViewHistorySimulPurchase';
import { ViewedHistoryProducts } from '@/components/pc/domain/category/CameleerContents/_legacy/ViewedHistoryProducts';
import { CategoryNavigation } from '@/components/pc/domain/category/CategoryNavigation';
import { CategoryNavigationProvider } from '@/components/pc/domain/category/CategoryNavigation/context';
import { CenterSpec } from '@/components/pc/domain/category/CenterSpec';
import { RelatedCategories } from '@/components/pc/domain/category/RelatedCategories';
import { SpecSearchPanel } from '@/components/pc/domain/category/SpecSearchPanel';
import { SpecSearchProvider } from '@/components/pc/domain/category/context';
import { MakerCategory } from '@/components/pc/pages/maker/MakerCategory';
import { useMakerCategoryContainer } from '@/components/pc/pages/maker/MakerCategoryContainer/MakerCategoryContainer.hooks';
import { MakerCategoryTop } from '@/components/pc/pages/maker/MakerCategoryTop';
import { MakerInfo } from '@/components/pc/pages/maker/MakerInfo';
import { MakerSpecSearch } from '@/components/pc/pages/maker/MakerSpecSearch';
import { Breadcrumb, Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import { cameleer } from '@/logs/cameleer';
import { Flag } from '@/models/api/Flag';
import {
	Brand,
	SearchBrandResponse,
} from '@/models/api/msm/ect/brand/SearchBrandResponse';
import {
	Category,
	SearchCategoryResponse,
} from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { assertNotNull } from '@/utils/assertions';
import { first } from '@/utils/collection';
import {
	getBrandBreadcrumbList,
	BrandBreadcrumbPayload,
} from '@/utils/domain/brand';
import { getCategorySpecFromQuery } from '@/utils/domain/category';
import { uuidv4 } from '@/utils/uuid';

const CATEGORY_MAIN_ID = `maker-category-main-${uuidv4()}`;

export type Props = {
	brandResponse: SearchBrandResponse;
	seriesResponse?: SearchSeriesResponse$search;
	categoryResponse: SearchCategoryResponse;
	categoryTopList: Category[];
	brandIndexList: Brand[];
	categoryCode: string;
	categorySpec?: string;
	page: number;
	isMakerCategoryTop: boolean;
};

/** Maker category container component */
export const MakerCategoryContainer: React.VFC<Props> = ({
	isMakerCategoryTop,
	categorySpec,
	categoryCode,
	page,
	seriesResponse,
	categoryResponse,
	brandResponse,
	brandIndexList,
	categoryTopList,
}) => {
	const [t] = useTranslation();
	const { category, categoryList } = useMakerCategoryContainer({
		categoryCode,
		seriesResponse,
		categoryResponse,
		brandResponse,
		brandIndexList,
	});

	const categorySpecForBreadcrumbs = useMemo(() => {
		if (!seriesResponse || !categorySpec) {
			return null;
		}

		return getCategorySpecFromQuery(categorySpec, seriesResponse);
	}, [categorySpec, seriesResponse]);

	const isSpecSearch = Flag.isTrue(category?.specSearchFlag);

	const breadcrumbList: Breadcrumb[] = useMemo(() => {
		const payload: BrandBreadcrumbPayload = {
			brandResponse,
			categoryCode,
			categoryResponse,
		};

		if (isSpecSearch) {
			payload.page = page;
			payload.categorySpec = categorySpecForBreadcrumbs;
		}

		return getBrandBreadcrumbList(t, payload);
	}, [
		brandResponse,
		categoryCode,
		categoryResponse,
		categorySpecForBreadcrumbs,
		isSpecSearch,
		page,
		t,
	]);

	const brand = first(brandResponse?.brandList);
	assertNotNull(brand);

	const content = useMemo(() => {
		if (!category) {
			return null;
		}

		if (isMakerCategoryTop) {
			return <MakerCategoryTop category={category} brand={brand} />;
		}

		if (isSpecSearch) {
			return (
				<>
					<CenterSpec category={category} />
					<MakerSpecSearch
						seriesResponse={seriesResponse}
						seriesPage={page}
						category={category}
						categoryList={categoryList}
						brand={brand}
						categoryMainId={CATEGORY_MAIN_ID}
					/>
				</>
			);
		}

		return (
			<MakerCategory
				brand={brand}
				category={category}
				categoryList={categoryList}
			/>
		);
	}, [
		brand,
		category,
		categoryList,
		isMakerCategoryTop,
		isSpecSearch,
		page,
		seriesResponse,
	]);

	useEffect(() => {
		if (category) {
			cameleer.viewCategory(category);
		}
	}, [category]);

	const target = isMakerCategoryTop
		? 'MAKER_CATEGORY_TOP'
		: isSpecSearch
		? 'MAKER_SPEC_SEARCH'
		: 'MAKER_CATEGORY';

	return (
		<SpecSearchProvider
			categoryCode={category.categoryCode}
			seriesResponse={seriesResponse}
		>
			<Breadcrumbs displayMode="html" breadcrumbList={breadcrumbList} />

			<div className={styles.container}>
				<div className={styles.categoryNavigation}>
					<CategoryNavigationProvider>
						<CategoryNavigation
							brand={brand}
							target={target}
							categoryCode={category.categoryCode}
							categoryTopList={categoryTopList}
						/>
					</CategoryNavigationProvider>
					{isSpecSearch && (
						<SpecSearchPanel
							categoryCode={category.categoryCode}
							categoryMainSelector={`#${CATEGORY_MAIN_ID}`}
						/>
					)}
				</div>
				<div className={styles.main}>
					<MakerInfo brand={brand} category={category} />
					{content}
					{!isSpecSearch && (
						<>
							<RecommendCategory
								categories={categoryList}
								variant="PurchaseCategoryRecommend"
							/>
							<RecommendCategory
								categories={categoryList}
								variant="PurchaseCategoryRepeatRecommend"
							/>
							<ViewHistorySimulPurchase />
							<ViewedHistoryProducts />
						</>
					)}
				</div>
			</div>
			{isSpecSearch && (
				<>
					<RecommendCategory
						categories={categoryList}
						variant="ViewedCategoryRecommend"
					/>
					<ViewHistorySimulPurchase />
					<ViewedHistoryProducts />
					<RelatedCategories brand={brand} categories={categoryList} />
				</>
			)}
		</SpecSearchProvider>
	);
};
MakerCategoryContainer.displayName = 'MakerCategoryContainer';
