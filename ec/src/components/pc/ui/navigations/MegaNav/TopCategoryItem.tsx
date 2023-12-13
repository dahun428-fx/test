import React, { useState } from 'react';
import { CategoryBalloon } from './CategoryBalloon';
import { Link } from './Link';
import styles from './TopCategoryItem.module.scss';
// import styles from './MegaNav.module.scss';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';
import classNames from 'classnames';

type Props = {
	/** トップカテゴリ情報 */
	category: Category;
	/** click category link handler */
	onClickLink: () => void;
};

/**
 * トップカテゴリのリストアイテム
 */
export const TopCategoryItem: React.FC<Props> = ({ category, onClickLink }) => {
	const [isHover, setIsHover] = useState(false);

	const handleMouseEnter = () => {
		setIsHover(true);
	};

	const handleMouseLeave = () => {
		setIsHover(false);
	};
	return (
		<li
			className={classNames(
				styles.meganavCategoryHead,
				styles[category.categoryCode]
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Link href={url.category(category.categoryCode)()} onClick={onClickLink}>
				{category.categoryName}
			</Link>
			{isHover && (
				<CategoryBalloon
					className={styles.meganavBalloonBox}
					isOpen={isHover}
					categoryCode={category.categoryCode}
					categoryGroupImageUrl={category.categoryGroupImageUrl}
					categoryName={category.categoryName}
					childCategoryList={category.childCategoryList}
					onClickLink={onClickLink}
				/>
			)}
		</li>
	);
};
TopCategoryItem.displayName = 'TopCategoryItem';
