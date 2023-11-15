import classNames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RelatedCategories.module.scss';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { last } from '@/utils/collection';
import { url } from '@/utils/url';

type Props = {
	categories: Category[];
	brand?: Brand;
};

/** Related categories component */
export const RelatedCategories: React.VFC<Props> = ({ categories, brand }) => {
	const [t] = useTranslation();

	const currentCategory = last(categories);

	const getCategories = useCallback(
		(categories: Category[], brand?: Brand) =>
			categories.map(category => {
				const href = !!brand
					? url
							.brand(brand)
							.category(
								...category.parentCategoryCodeList,
								category.categoryCode
							)()
					: url.category(
							...category.parentCategoryCodeList,
							category.categoryCode
					  )();

				return {
					href,
					text: category.categoryName,
					categoryCode: category.categoryCode,
				};
			}),
		[]
	);

	const breadcrumbs = useMemo(() => {
		return getCategories(categories.slice(0, categories.length - 1));
	}, [categories, getCategories]);

	const siblingCategories = useMemo(() => {
		const parentCategory = categories[categories.length - 2];

		if (!parentCategory) {
			return [];
		}

		return getCategories(parentCategory.childCategoryList, brand);
	}, [brand, categories, getCategories]);

	const childCategories = useMemo(() => {
		if (!currentCategory?.childCategoryList.length) {
			return [];
		}

		return getCategories(currentCategory.childCategoryList, brand);
	}, [brand, currentCategory, getCategories]);

	return (
		<div className={styles.relatedCategories}>
			<h2 className={styles.title}>
				{t('components.domain.category.relatedCategories.title', {
					categoryName: currentCategory?.categoryName,
				})}
			</h2>

			{!!breadcrumbs.length && (
				<ul className={styles.list}>
					<li className={styles.linkItem}>
						<Link href={pagesPath.$url()} passHref>
							<a className={styles.link}>
								{t('components.domain.category.relatedCategories.home')}
							</a>
						</Link>
					</li>

					{breadcrumbs.map((breadcrumb, index) => (
						<li className={styles.linkItem} key={index}>
							<Link href={breadcrumb.href} passHref>
								<a className={styles.link}>{breadcrumb.text}</a>
							</Link>
						</li>
					))}
				</ul>
			)}

			{!!siblingCategories.length && (
				<div className={styles.listBottom}>
					<ul className={styles.list}>
						{siblingCategories.map((category, index) => (
							<li className={styles.linkItem} key={index}>
								<Link href={category.href} passHref>
									<a
										className={classNames(styles.link, {
											[String(styles.linkActive)]:
												category.categoryCode === currentCategory?.categoryCode,
										})}
									>
										{category.text}
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}

			{!!childCategories.length && (
				<div className={styles.listBottom}>
					<ul className={styles.list}>
						{childCategories.map((category, index) => (
							<li className={styles.linkItem} key={index}>
								<Link href={category.href} passHref>
									<a className={styles.link}>{category.text}</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
RelatedCategories.displayName = 'RelatedCategories';
