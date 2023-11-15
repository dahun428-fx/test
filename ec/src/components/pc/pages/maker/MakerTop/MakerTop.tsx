import { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMakerTop } from './MakerTop.hooks';
import styles from './MakerTop.module.scss';
import { Meta } from './Meta';
import { CategoryNavigation } from '@/components/pc/domain/category/CategoryNavigation';
import { CategoryNavigationProvider } from '@/components/pc/domain/category/CategoryNavigation/context';
import { CategoryTopSectionListItem } from '@/components/pc/domain/category/TopCategory/CategoryTopSectionListItem';
import { MakerInfo } from '@/components/pc/pages/maker/MakerInfo';
import { Breadcrumb, Breadcrumbs } from '@/components/pc/ui/links/Breadcrumbs';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { SearchBrandResponse } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { assertNotNull } from '@/utils/assertions';
import { first } from '@/utils/collection';
import { getBrandBreadcrumbList } from '@/utils/domain/brand';

type Props = {
	brandResponse: SearchBrandResponse;
	categoryResponse: SearchCategoryResponse;
};

/** Maker top page */
export const MakerTop: VFC<Props> = ({ brandResponse, categoryResponse }) => {
	const [t] = useTranslation();

	useMakerTop({ brandResponse, categoryResponse });

	const breadcrumbList: Breadcrumb[] = useMemo(() => {
		return getBrandBreadcrumbList(t, { brandResponse });
	}, [brandResponse, t]);

	// TODO: Handle Misumi TOP and other brands TOP base on brand info.

	const brand = first(brandResponse.brandList);
	const category = first(categoryResponse.categoryList);

	assertNotNull(brand);

	useOnMounted(() => {
		aa.pageView.maker.top({ brandCode: brand.brandCode }).then();
		ga.pageView.maker
			.top({
				brandCode: brand.brandCode,
				brandName: brand.brandName,
				misumiFlag: brand.misumiFlag,
				departmentCode: 'all',
			})
			.then();
		ectLogger.visit({
			classCode: ClassCode.MAKER,
		});
	});

	return (
		<>
			<Meta brand={brand} category={category} />
			<div>
				<Breadcrumbs displayMode="html" breadcrumbList={breadcrumbList} />

				<div className={styles.container}>
					<div className={styles.categoryNavigation}>
						<CategoryNavigationProvider>
							<CategoryNavigation brand={brand} target="MAKER_TOP" />
						</CategoryNavigationProvider>
					</div>
					<div className={styles.main}>
						<MakerInfo isMakerTop brand={brand} />

						{categoryResponse.categoryList.map(category => (
							<div key={category.categoryCode}>
								<h2 className={styles.categoryTitle}>
									{category.categoryName}
								</h2>
								{category.childCategoryList.map((childCategory, index) => (
									<CategoryTopSectionListItem
										key={index}
										category={childCategory}
										brand={brand}
									/>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
MakerTop.displayName = 'MakerTop';
