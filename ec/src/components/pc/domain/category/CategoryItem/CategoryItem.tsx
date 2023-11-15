import Link from 'next/link';
import React, { useMemo } from 'react';
import styles from './CategoryItem.module.scss';
import { QueryCondition } from '@/components/pc/domain/category/context';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';

export const ITEM_WIDTH = 124;

export type Props = {
	category: Category;
	brand?: Brand;
	seriesCount?: number;
	query?: QueryCondition;
};

/**  Category item component */
export const CategoryItem: React.VFC<Props> = ({
	category,
	brand,
	seriesCount,
	query,
}) => {
	const href = useMemo(() => {
		if (brand) {
			return url
				.brand(brand)
				.category(
					...category.parentCategoryCodeList,
					category.categoryCode
				)(query);
		}

		return url.category(
			...category.parentCategoryCodeList,
			category.categoryCode
		)(query);
	}, [brand, category.categoryCode, category.parentCategoryCodeList, query]);

	return (
		<li
			className={styles.categoryItem}
			key={category.categoryCode}
			// NOTE: ITEM_WIDTH is exported as a variable so that parent component can use,
			// therefore we need to use inline style here
			style={{ width: `${ITEM_WIDTH}px` }}
		>
			<Link href={href}>
				<a className={styles.categoryLink}>
					<div className={styles.imageWrapper}>
						<ProductImage
							imageUrl={category.categoryImageUrl}
							comment={category.categoryName}
							className={styles.categoryImage}
							size={100}
							preset="category_first"
						/>
					</div>
					<p className={styles.categoryItemName}>
						{category.categoryName}
						{!!seriesCount && `(${seriesCount})`}
					</p>
				</a>
			</Link>
		</li>
	);
};

CategoryItem.displayName = 'CategoryItem';
