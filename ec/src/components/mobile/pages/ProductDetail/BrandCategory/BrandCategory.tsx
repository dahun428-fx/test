import classNames from 'classnames';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BrandCategory.module.scss';
import { Link } from '@/components/mobile/ui/links';
import { useBoolState } from '@/hooks/state/useBoolState';
import useOuterClick from '@/hooks/ui/useOuterClick';
import { Category } from '@/models/api/msm/ect/series/SearchSeriesResponse$detail';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

const MAX_LINK = 3;

type Props = {
	brandName: string;
	brandCode: string;
	brandUrlCode: string;
	categoryList: Category[];
	categoryCode: string | undefined;
	categoryName: string | undefined;
};

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
}) => {
	const { t } = useTranslation();
	const ref = useRef(null);
	const { bool: isOpen, toggle, setFalse: closePopover } = useBoolState(false);
	useOuterClick(ref, closePopover);

	const brand = { brandCode, brandUrlCode };
	const mergedCategoryList = [
		...categoryList,
		{
			categoryCode: categoryCode,
			categoryName: categoryName,
		},
	];
	const itemList: Item[] = [];

	for (
		let i = mergedCategoryList.length - 1, j = 0;
		i >= 0 && j < MAX_LINK;
		i--, j++
	) {
		itemList.push({
			label: `${brandName}×${mergedCategoryList[i]?.categoryName}`,
			url: url.brandCategory(
				brand,
				...mergedCategoryList
					.slice(0, i + 1)
					.map(category => category.categoryCode)
					.filter(notNull)
			),
		});
	}

	return (
		<div className={styles.container} ref={ref}>
			<span className={styles.title}>
				{t('mobile.pages.productDetail.brandCategory.brand')}
			</span>
			<div
				onClick={toggle}
				className={classNames(
					styles.brandLink,
					isOpen ? styles.arrowUp : styles.arrowDown
				)}
			>
				{brandName}
			</div>

			{isOpen && (
				<div className={styles.popover} onClick={closePopover}>
					<div className={styles.brand}>
						<div className={styles.popoverBrandLink}>{brandName}</div>
					</div>
					<ul className={styles.list}>
						<li className={styles.item}>
							<Link href={url.brandCategory(brand)} className={styles.link}>
								{brandName}
							</Link>
						</li>
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
