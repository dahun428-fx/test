import classNames from 'classnames';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CategoryNavigation.module.scss';
import { CategoryNavigationListItem } from './CategoryNavigationListItem';
import { Flag } from '@/models/api/Flag';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { Category as SeriesCategory } from '@/models/api/msm/ect/series/SearchSeriesResponse';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';
import { getSeriesCount } from '@/utils/domain/series';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

export type Target =
	| 'CATEGORY'
	| 'MAKER_TOP'
	| 'MAKER_CATEGORY_TOP'
	| 'MAKER_CATEGORY'
	| 'MAKER_SPEC_SEARCH';

type Props = {
	categories: Category[];
	seriesCategories?: SeriesCategory[];
	target?: Target;
	brand?: Brand;
	categoryTopList?: Category[];
	categoryCode?: string;
};

const MAX_CATEGORY_ITEM = 6;

/** Category navigation component */
export const CategoryNavigation: VFC<Props> = ({
	categories,
	seriesCategories,
	target,
	brand,
	categoryTopList,
	categoryCode,
}) => {
	const [t] = useTranslation();
	const [expanded, setExpanded] = useState(false);

	const contentRef = useRef<HTMLDivElement>(null);
	const category = last(categories);
	assertNotNull(category);

	const totalItem = useMemo(() => {
		if (categories.length === 1) {
			return categories.length;
		}

		return (
			categories.length -
			1 + // Parent category
			category.childCategoryList.length + // Child category (last)
			(categories[categories.length - 2]?.childCategoryList.length ?? 0) // Sibling category
		);
	}, [categories, category]);

	const showsMore =
		totalItem > MAX_CATEGORY_ITEM && Flag.isTrue(category.specSearchFlag);
	const currentCategoryCode = category.categoryCode;

	useEffect(() => {
		if (!showsMore || !contentRef.current) {
			return;
		}

		let totalHeight = 0;
		const initialDisplayedItem = expanded ? undefined : MAX_CATEGORY_ITEM;

		Array.from(contentRef.current.querySelectorAll('ul > li'))
			.slice(0, initialDisplayedItem)
			.forEach(item => {
				totalHeight += item.clientHeight;
			});

		contentRef.current.style.height = `${totalHeight}px`;
	}, [expanded, showsMore]);

	const content = useMemo(() => {
		if (target === 'MAKER_TOP') {
			return (
				<ul>
					{categories.map(childCategory => {
						return (
							<CategoryNavigationListItem
								key={childCategory.categoryCode}
								category={childCategory}
								showsSubmenu={false}
								relationship="child"
								brand={brand}
							/>
						);
					})}
				</ul>
			);
		}

		// NOTE: When is maker category page, Current category and sibling category are display together
		if (
			categoryTopList &&
			categoryTopList.length > 0 &&
			target === 'MAKER_CATEGORY_TOP'
		) {
			return (
				<ul>
					{categoryTopList.map(item => {
						return (
							<Fragment key={item.categoryCode}>
								<CategoryNavigationListItem
									brand={brand}
									category={item}
									showsSubmenu={false}
									relationship={
										item.categoryCode === categoryCode ? 'root' : 'sibling'
									}
								/>
								{item.categoryCode === categoryCode && (
									<li>
										<ul>
											{item.childCategoryList.map(childCategory => {
												return (
													<CategoryNavigationListItem
														brand={brand}
														key={childCategory.categoryCode}
														category={childCategory}
														showsSubmenu={false}
														relationship="child"
													/>
												);
											})}
										</ul>
									</li>
								)}
							</Fragment>
						);
					})}
				</ul>
			);
		}

		// categories[0] は topCategory などとして持つべきだと思うが、500箇所の修正をしている今、そこまで手が回らないのでそのままにしている。
		if (categories.length === 1 && notNull(categories[0])) {
			return (
				<>
					<h3 className={styles.categoryRootTitle}>
						<CategoryNavigationListItem
							brand={brand}
							category={categories[0]}
							showsSubmenu={false}
							relationship="root"
						/>
					</h3>
					<ul>
						{categories[0].childCategoryList.map(childCategory => {
							return (
								<CategoryNavigationListItem
									brand={brand}
									key={childCategory.categoryCode}
									category={childCategory}
									showsSubmenu
									relationship="child"
								/>
							);
						})}
					</ul>
				</>
			);
		}

		return (
			<div className={styles.wrapperContent} ref={contentRef}>
				<ul>
					{categories.slice(0, categories.length - 1).map(category => {
						return (
							<CategoryNavigationListItem
								brand={brand}
								key={category.categoryCode}
								category={category}
								showsSubmenu={false}
								relationship="parent"
							/>
						);
					})}
				</ul>
				<ul className={styles.childCategory}>
					<CategoryNavigationListItem
						brand={brand}
						category={category}
						showsSubmenu={false}
						relationship="self"
					/>
					{category.childCategoryList.map(childCategory => {
						const seriesCount = getSeriesCount(
							childCategory.categoryCode,
							seriesCategories
						);

						return (
							<CategoryNavigationListItem
								brand={brand}
								key={childCategory.categoryCode}
								category={childCategory}
								showsSubmenu={false}
								seriesCount={seriesCount}
								relationship="child"
							/>
						);
					})}
					{categories[categories.length - 2]?.childCategoryList
						.filter(category => category.categoryCode !== currentCategoryCode)
						.map(childCategory => {
							return (
								<CategoryNavigationListItem
									brand={brand}
									key={childCategory.categoryCode}
									category={childCategory}
									showsSubmenu={false}
									relationship="sibling"
								/>
							);
						})}
				</ul>
			</div>
		);
	}, [
		brand,
		categories,
		category,
		categoryCode,
		categoryTopList,
		currentCategoryCode,
		seriesCategories,
		target,
	]);

	const isSpecSearch = Flag.isTrue(last(categories)?.specSearchFlag);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>{t('pages.category.category')}</h2>
			{brand && !isSpecSearch && (
				<h3 className={styles.categoryRootTitle}>
					<Link href={url.brand(brand).default}>
						<a
							className={classNames(styles.rootTitle, {
								[String(styles.categoryTitle)]: target !== 'MAKER_TOP',
								[String(styles.rootTitleActive)]: target === 'MAKER_TOP',
							})}
						>
							{t(
								'components.domain.category.categoryNavigation.allMakerCategory',
								{ brandName: brand.brandName }
							)}
						</a>
					</Link>
				</h3>
			)}

			<div
				className={classNames({
					[String(styles.categoryTopContent)]: target === 'MAKER_CATEGORY_TOP',
				})}
			>
				{content}
			</div>

			{showsMore && (
				<span
					className={classNames(styles.showMore, {
						[String(styles.plusIcon)]: !expanded,
						[String(styles.minusIcon)]: expanded,
					})}
					onClick={() => setExpanded(prev => !prev)}
				>
					{expanded
						? t('components.domain.category.categoryNavigation.collapsed')
						: t('components.domain.category.categoryNavigation.expanded')}
				</span>
			)}
		</div>
	);
};
CategoryNavigation.displayName = 'CategoryNavigation';
