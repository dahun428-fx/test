import Link from 'next/link';
import { memo, useCallback } from 'react';
import styles from './CategoryGroupItem.module.scss';
import { Flag } from '@/models/api/Flag';
import type { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';

type Props = {
	category: Category;
	onClick?: () => void;
};

export const CategoryGroupItem = memo<Props>(({ category, onClick }) => {
	const { categoryCode, categoryName, parentCategoryCodeList, specSearchFlag } =
		category;

	const handleClick = useCallback(() => {
		if (Flag.isFalse(specSearchFlag)) {
			onClick?.();
		}
	}, [onClick, specSearchFlag]);

	return (
		<Link
			href={pagesPath.vona2
				._categoryCode([...parentCategoryCodeList, categoryCode])
				.$url()}
		>
			<a className={styles.link} onClick={handleClick}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={category.categoryImageUrl} alt="" className={styles.image} />
				<span
					className={styles.categoryName}
					dangerouslySetInnerHTML={{ __html: categoryName }}
				/>
			</a>
		</Link>
	);
});
CategoryGroupItem.displayName = 'CategoryGroupItem';
