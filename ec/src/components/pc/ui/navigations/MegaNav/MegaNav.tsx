import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MegaNav.module.scss';
import { useTopCategories } from '@/components/pc/ui/navigations/MegaNav/MegaNav.hooks';
import { SkeletonTopCategoryItem } from '@/components/pc/ui/navigations/MegaNav/SkeletonTopCategoryItem';
import { TopCategoryItem } from '@/components/pc/ui/navigations/MegaNav/TopCategoryItem';
import { range } from '@/utils/number';

type Props = {
	/** click category link handler */
	onClickLink: () => void;
};

/**
 * メガナビ
 */
export const MegaNav: React.VFC<Props> = ({ onClickLink }) => {
	const { t } = useTranslation();

	const categoryList = useTopCategories();

	return (
		<div className={styles.meganavCategory}>
			<ul>
				{categoryList
					? categoryList.map(category => (
							<TopCategoryItem
								key={category.categoryCode}
								category={category}
								onClickLink={onClickLink}
							/>
					  ))
					: // There is 13 top categories
					  range(0, 13).map(index => <SkeletonTopCategoryItem key={index} />)}
			</ul>
		</div>
	);
};
MegaNav.displayName = 'MegaNav';
