import { VFC } from 'react';
import { Meta } from './Meta';
import { TopCategory } from '@/components/pc/domain/category/TopCategory';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { ClassCode } from '@/logs/constants';
import { ectLogger } from '@/logs/ectLogger';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	category: Category;
	brand: Brand;
};

/** Maker category top page */
export const MakerCategoryTop: VFC<Props> = ({ category, brand }) => {
	useOnMounted(() => {
		aa.pageView.maker.category
			.top({
				brandCode: brand.brandCode,
				categoryCode: category.categoryCode,
			})
			.then();
		ga.pageView.maker
			.categoryTop({
				brandCode: brand.brandCode,
				brandName: brand.brandName,
				misumiFlag: brand.misumiFlag,
				departmentCode: category.departmentCode,
				categoryCode: category.categoryCode,
			})
			.then();
		ectLogger.visit({
			classCode: ClassCode.MAKER,
		});
	});

	return (
		<>
			<Meta category={category} brand={brand} />
			<TopCategory category={category} brand={brand} />
		</>
	);
};
MakerCategoryTop.displayName = 'MakerCategoryTop';
