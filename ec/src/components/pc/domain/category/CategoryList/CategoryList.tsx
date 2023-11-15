import styles from './CategoryList.module.scss';
import { CategoryItem } from '@/components/pc/domain/category/CategoryItem';
import { useSpecSearchContext } from '@/components/pc/domain/category/context';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { Category as SeriesCategory } from '@/models/api/msm/ect/series/SearchSeriesResponse';
import { getSeriesCount } from '@/utils/domain/series';

type Props = {
	categoryList: Category[];
	brand?: Brand;
	seriesCategories?: SeriesCategory[];
};

/** Category list */
export const CategoryList: React.VFC<Props> = ({
	categoryList,
	brand,
	seriesCategories,
}) => {
	const { conditions } = useSpecSearchContext();

	return (
		<ul className={styles.categoryList}>
			{categoryList.map(category => {
				const seriesCount = getSeriesCount(
					category.categoryCode,
					seriesCategories
				);

				return (
					<CategoryItem
						seriesCount={seriesCount}
						key={category.categoryCode}
						category={category}
						brand={brand}
						query={conditions}
					/>
				);
			})}
		</ul>
	);
};
CategoryList.displayName = 'CategoryList';
