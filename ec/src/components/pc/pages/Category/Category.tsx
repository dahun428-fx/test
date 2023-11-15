import { useRouter } from 'next/router';
import { useEffect, useMemo, VFC } from 'react';
import { useCategory } from './Category.hooks';
import styles from './Category.module.scss';
import { CategoryInfo } from './CategoryInfo';
import { SpecSearch } from './SpecSearch';
import { TopCategory } from './TopCategory';
import { CategoryRecommend } from '@/components/pc/domain/category/CameleerContents/CategoryRecommend';
import { EmphasizedRecommend } from '@/components/pc/domain/category/CameleerContents/EmphasizedRecommend';
import { RecentlyViewedAndRecommend } from '@/components/pc/domain/category/CameleerContents/RecentlyViewedAndRecommend';
import { ViewedHistoryProducts } from '@/components/pc/domain/category/CameleerContents/_legacy/ViewedHistoryProducts';
import { CategoryNavigation } from '@/components/pc/domain/category/CategoryNavigation';
import { CategoryNavigationProvider } from '@/components/pc/domain/category/CategoryNavigation/context';
import { CenterSpec } from '@/components/pc/domain/category/CenterSpec';
import { RelatedCategories } from '@/components/pc/domain/category/RelatedCategories';
import { SeriesList } from '@/components/pc/domain/category/SeriesList';
import { SpecSearchPanel } from '@/components/pc/domain/category/SpecSearchPanel';
import { SpecSearchProvider } from '@/components/pc/domain/category/context';
import { Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { cameleer } from '@/logs/cameleer';
import { GeneralRecommendLogParams } from '@/logs/cameleer/generalRecommend';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Flag } from '@/models/api/Flag';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import { first } from '@/utils/collection';
import {
	getDefaultDisplayType,
	getSeriesListPageSize,
	toDisplayType,
} from '@/utils/domain/spec';
import { getOneParams } from '@/utils/query';
import { uuidv4 } from '@/utils/uuid';

// NOTE: Using uuid to avoid duplicated id in DOM
const CATEGORY_CONTAINER_ID = `category-container-${uuidv4()}`;
const CATEGORY_MAIN_ID = `category-main-${uuidv4()}`;

export type Props = {
	categoryCode: string;
	topCategoryCode: string;
	isTopCategory: boolean;
	categoryResponse: SearchCategoryResponse;
	seriesResponse?: SearchSeriesResponse$search;
	brandResponse?: SearchBrandResponse;
	page: number;
	categorySpec?: string;
};

/** Category page */
export const Category: VFC<Props> = ({
	isTopCategory,
	categoryCode,
	categoryResponse,
	page,
	topCategoryCode,
	brandResponse,
	categorySpec,
	seriesResponse,
}) => {
	const { breadcrumbs, category, categoryList, leftBannerResponse } =
		useCategory({
			categoryCode,
			categoryResponse,
			page,
			topCategoryCode,
			brandResponse,
			categorySpec,
			seriesResponse,
		});
	const router = useRouter();
	const { DispMethod: displayTypeQuery } = getOneParams(
		router.query,
		'DispMethod'
	);
	const isSpecSearch = Flag.isTrue(category?.specSearchFlag);

	const defaultDisplayType = getDefaultDisplayType({
		displayTypeQuery,
		seriesDisplayType: seriesResponse?.specSearchDispType,
	});

	const dispPage = useMemo(() => {
		const value =
			categoryList.length === 1 ? 'ctop' : `ctg${categoryList.length}`;
		return value as GeneralRecommendLogParams['dispPage'];
	}, [categoryList]);

	const content = useMemo(() => {
		if (!category) {
			return null;
		}

		if (isTopCategory) {
			return <TopCategory category={category} />;
		}

		if (isSpecSearch) {
			return (
				<>
					<SpecSearch category={category} />
					<CenterSpec category={category} />
					<div id={CATEGORY_MAIN_ID}>
						<SeriesList
							categoryCode={category.categoryCode}
							stickyBottomSelector={`#${CATEGORY_CONTAINER_ID}`}
							categoryMainSelector={`#${CATEGORY_CONTAINER_ID}`}
						/>
					</div>
				</>
			);
		}

		return (
			<CategoryInfo
				category={category}
				categoryList={categoryList}
				topCategoryCode={topCategoryCode}
			/>
		);
	}, [category, categoryList, isSpecSearch, isTopCategory, topCategoryCode]);

	useOnMounted(() => {
		ectLogger.visit({
			classCode: ClassCode.CATEGORY,
			specSearchDispType: isSpecSearch
				? toDisplayType(defaultDisplayType)
				: undefined,
		});
	});

	useEffect(() => {
		if (!category) {
			return;
		}

		const categoryCode = category.categoryCode;
		const departmentCode = category.departmentCode;

		if (isTopCategory) {
			aa.pageView.category
				.top({
					categoryCode,
				})
				.then();
			ga.pageView.category
				.top({
					categoryCode,
					departmentCode,
				})
				.then();
			return;
		}

		if (isSpecSearch) {
			aa.pageView.category.spec({
				categoryCodeList: [
					...category.parentCategoryCodeList,
					category.categoryCode,
				],
			});
			ga.pageView.category
				.lower({
					departmentCode: departmentCode,
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
			return;
		}

		aa.pageView.category.lower({
			categoryCodeList: [
				...category.parentCategoryCodeList,
				category.categoryCode,
			],
		});
		ga.pageView.category
			.lower({
				misumiFlag: undefined,
				departmentCode: departmentCode,
				categoryList: categoryList.slice(1).map(category => ({
					categoryCode: category.categoryCode,
					categoryName: category.categoryName,
				})),
				categoryCode: first(categoryList)?.categoryCode,
			})
			.then();
	}, [category, categoryList, defaultDisplayType, isSpecSearch, isTopCategory]);

	useEffect(() => {
		if (category) {
			cameleer.viewCategory(category);
		}
	}, [category]);

	useEffect(() => {
		// NOTE: Trigger scroll event to calculate initial sticky position.
		const timer = setTimeout(() => {
			window.scrollTo(0, window.scrollY + 1);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	if (!category) {
		return null;
	}

	return (
		<SpecSearchProvider
			categoryCode={category.categoryCode}
			seriesResponse={seriesResponse}
		>
			<Breadcrumbs displayMode="html" breadcrumbList={breadcrumbs} />
			<div className={styles.content}>
				<div className={styles.categoryNavigation}>
					<CategoryNavigationProvider>
						<CategoryNavigation />
					</CategoryNavigationProvider>
					{isSpecSearch && (
						<SpecSearchPanel
							categoryCode={category.categoryCode}
							categoryMainSelector={`#${CATEGORY_MAIN_ID}`}
						/>
					)}
					{!isSpecSearch && leftBannerResponse && (
						<div dangerouslySetInnerHTML={{ __html: leftBannerResponse }} />
					)}
				</div>
				<div className={styles.main} id={CATEGORY_CONTAINER_ID}>
					{content}
					{!isSpecSearch && (
						<>
							{!isTopCategory && (
								<EmphasizedRecommend recommendCode="c22" dispPage={dispPage} />
							)}
							<CategoryRecommend
								recommendCode="c12"
								itemCode={categoryCode}
								dispPage={dispPage}
							/>
							{isTopCategory && <RecentlyViewedAndRecommend />}
							<ViewedHistoryProducts />
						</>
					)}
				</div>
			</div>
			{isSpecSearch && (
				<>
					{!isTopCategory && (
						<EmphasizedRecommend recommendCode="c22" dispPage={dispPage} />
					)}
					<CategoryRecommend
						recommendCode="c13"
						itemCode={categoryCode}
						dispPage={dispPage}
					/>
					{isTopCategory && <RecentlyViewedAndRecommend />}
					<ViewedHistoryProducts />
					<RelatedCategories categories={categoryList} />
				</>
			)}
		</SpecSearchProvider>
	);
};

Category.displayName = 'Category';
