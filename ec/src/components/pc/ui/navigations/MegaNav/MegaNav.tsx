import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MegaNav.module.scss';
import { useTopCategories } from '@/components/pc/ui/navigations/MegaNav/MegaNav.hooks';
import { SkeletonTopCategoryItem } from '@/components/pc/ui/navigations/MegaNav/SkeletonTopCategoryItem';
import { TopCategoryItem } from '@/components/pc/ui/navigations/MegaNav/TopCategoryItem';
import { range } from '@/utils/number';
import { Link } from './Link';
import classNames from 'classnames';

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

	const [isHover, setIsHover] = useState(false);

	const handleMouseEnter = () => {
		setIsHover(true);
	};
	const handleMouseLeave = () => {
		setIsHover(false);
	};
	return (
		<div className={styles.meganavCategory}>
			<ul>
				<li
					className={
						isHover
							? classNames(styles.miconT, styles.on)
							: classNames(styles.miconT)
					}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Link href={``} onClick={onClickLink}>
						경제형 제품
					</Link>
				</li>
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
