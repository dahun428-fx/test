import { useMemo, useState } from 'react';
import styles from './BrandCategory.module.scss';
import { Link } from '@/components/pc/ui/links';
import { Series } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

const MAX_LINK = 3;

type Props = Pick<
	Series,
	| 'brandName'
	| 'brandCode'
	| 'brandUrlCode'
	| 'categoryList'
	| 'categoryCode'
	| 'categoryName'
> & { displayCategoryLink?: boolean };

type Item = {
	label: string;
	url: string;
};

/**
 * Brand and category link popover
 */
export const BrandCategory: React.VFC<Props> = ({
	brandName,
	brandCode,
	brandUrlCode,
	categoryList,
	categoryCode,
	categoryName,
	displayCategoryLink = true,
}) => {
	const [showsPopover, setShowsPopover] = useState(false);

	const itemList: Item[] = useMemo(() => {
		const mergedCategoryList = [
			...categoryList,
			{
				categoryCode: categoryCode,
				categoryName: categoryName,
			},
		];
		const itemList = [];
		for (
			let i = mergedCategoryList.length - 1, j = 0;
			i >= 0 && j < MAX_LINK;
			i--, j++
		) {
			itemList.push({
				label: `${brandName}×${mergedCategoryList[i]?.categoryName}`,
				url: url.brandCategory(
					{ brandCode, brandUrlCode },
					...mergedCategoryList
						.slice(0, i + 1)
						.map(category => category.categoryCode)
						.filter(notNull)
				),
			});
		}
		return itemList;
	}, [
		brandCode,
		brandName,
		brandUrlCode,
		categoryCode,
		categoryList,
		categoryName,
	]);

	return (
		<div className={styles.container}>
			<Link
				href={url.brandCategory({ brandCode, brandUrlCode })}
				className={styles.brandLink}
				data-hoverable={displayCategoryLink}
				onMouseEnter={() => displayCategoryLink && setShowsPopover(true)}
			>
				{brandName}
			</Link>

			{showsPopover && (
				<div
					className={styles.popover}
					onMouseLeave={() => setShowsPopover(false)}
				>
					<div className={styles.brand}>
						<Link
							href={url.brandCategory({ brandCode, brandUrlCode })}
							className={styles.popoverBrandLink}
						>
							{brandName}
						</Link>
					</div>
					<ul className={styles.list}>
						{itemList.map(item => (
							<li key={item.url} className={styles.item}>
								<Link href={item.url} className={styles.link}>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
BrandCategory.displayName = 'BrandCategory';
