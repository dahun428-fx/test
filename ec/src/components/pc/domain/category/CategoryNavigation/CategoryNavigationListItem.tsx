import classNames from 'classnames';
import Link from 'next/link';
import { useMemo, VFC } from 'react';
import styles from './CategoryNavigationListItem.module.scss';
import { useCategoryNavigationContext } from './context';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';

type Props = {
	category: Category;
	level?: number;
	showsSubmenu: boolean;
	relationship: 'root' | 'self' | 'child' | 'submenu' | 'sibling' | 'parent';
	seriesCount?: number;
	brand?: Brand;
};

const MAX_SUBMENU_LEVEL = 4;

/** Category navigation list item component */
export const CategoryNavigationListItem: VFC<Props> = ({
	category,
	level = 1,
	showsSubmenu,
	relationship,
	seriesCount,
	brand,
}) => {
	const { hoveredCategory, setHoveredCategory } =
		useCategoryNavigationContext();

	// TODO: Adding spec/maker filter to URL -> Need to handle on spec filtering
	const itemLink = useMemo(() => {
		if (brand) {
			return url
				.brand(brand)
				.category(...category.parentCategoryCodeList, category.categoryCode)();
		}

		return url.category(
			...category.parentCategoryCodeList,
			category.categoryCode
		)();
	}, [brand, category]);

	const shouldShowSubmenu =
		category.childCategoryList.length &&
		showsSubmenu &&
		level < MAX_SUBMENU_LEVEL;

	const subMenu = useMemo(() => {
		if (!shouldShowSubmenu) {
			return null;
		}

		return (
			<ul
				className={classNames(styles.submenu, {
					[String(styles.submenuVisible)]:
						hoveredCategory === category ||
						hoveredCategory?.parentCategoryCodeList.includes(
							category.categoryCode
						),
				})}
			>
				{category.childCategoryList.map(childCategory => (
					<CategoryNavigationListItem
						brand={brand}
						key={childCategory.categoryCode}
						category={childCategory}
						level={level + 1}
						showsSubmenu={showsSubmenu}
						relationship="submenu"
					/>
				))}
			</ul>
		);
	}, [
		brand,
		category,
		hoveredCategory,
		level,
		shouldShowSubmenu,
		showsSubmenu,
	]);

	const handleMouseEnter = () => {
		setHoveredCategory(category);
	};

	const handleMouseLeave = () => {
		setHoveredCategory(null);
	};

	if (relationship === 'root') {
		return (
			<li>
				<Link href={itemLink}>
					<a
						className={classNames(styles.link, {
							[String(styles.root)]: relationship === 'root',
						})}
					>
						{category.categoryName}
					</a>
				</Link>
			</li>
		);
	}

	return (
		<li key={category.categoryCode} className={styles.listItem}>
			<Link href={itemLink}>
				<a
					className={classNames(styles.link, {
						[String(styles.self)]: relationship === 'self',
						[String(styles.child)]: relationship === 'child',
						[String(styles.submenuItem)]: relationship === 'submenu',
						[String(styles.sibling)]: relationship === 'sibling',
						[String(styles.parent)]: relationship === 'parent',
					})}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{category.categoryName}
					{relationship === 'child' &&
						Number(seriesCount) > 0 &&
						`(${seriesCount})`}
				</a>
			</Link>
			{subMenu}
		</li>
	);
};
CategoryNavigationListItem.displayName = 'CategoryNavigationListItem';
