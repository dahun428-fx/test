import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from './Heading';
import { Link } from './Link';
import styles from './MegaNav.module.scss';
import { useTopCategories } from '@/components/pc/ui/navigations/MegaNav/MegaNav.hooks';
import { SkeletonTopCategoryItem } from '@/components/pc/ui/navigations/MegaNav/SkeletonTopCategoryItem';
import { TopCategoryItem } from '@/components/pc/ui/navigations/MegaNav/TopCategoryItem';
import { range } from '@/utils/number';
import { url } from '@/utils/url';

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
		<div className={styles.megaNav}>
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

			<div className={styles.section}>
				<Heading>{t('components.ui.navigations.megaNav.headingBrand')}</Heading>
				<ul>
					<li>
						<Link href={url.brandList} onClick={onClickLink}>
							{t('components.ui.navigations.megaNav.brandPageLink')}
						</Link>
					</li>
					<li>
						<Link
							href={url.brandCategory({
								brandCode: 'MSM1',
								brandUrlCode: 'misumi',
							})}
							onClick={onClickLink}
						>
							{t('components.ui.navigations.megaNav.misumiCategoryPageLink')}
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};
MegaNav.displayName = 'MegaNav';
