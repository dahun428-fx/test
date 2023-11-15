import classNames from 'classnames';
import { forwardRef } from 'react';
import { CategoryGroup } from './CategoryGroup';
import styles from './SecondaryCategoryGroups.module.scss';
import type { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	secondaryCategoryList: Category[];
	onClickTertiary: (categoryCode: string) => void;
	className?: string;
};

export const SecondaryCategoryGroups = forwardRef<HTMLDivElement, Props>(
	({ className, secondaryCategoryList, onClickTertiary }, ref) => {
		return (
			<div className={classNames(className, styles.container)} ref={ref}>
				<ul>
					{secondaryCategoryList.map(category => (
						<CategoryGroup
							key={category.categoryCode}
							category={category}
							onClickTertiary={onClickTertiary}
						/>
					))}
				</ul>
			</div>
		);
	}
);
SecondaryCategoryGroups.displayName = 'SecondaryCategoryGroups';
