import React, { useMemo, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MakerInfo.module.scss';
import { Brand } from '@/models/api/msm/ect/brand/SearchBrandResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	isMakerTop?: boolean;
	brand: Brand;
	category?: Category;
};

/** Maker info component */
export const MakerInfo: VFC<Props> = ({ isMakerTop, brand, category }) => {
	const [t] = useTranslation();

	const headingTitle = useMemo(() => {
		if (!isMakerTop && category) {
			return `${brand?.brandName} ${category.categoryName}`;
		}

		return brand?.brandName;
	}, [brand?.brandName, category, isMakerTop]);

	return (
		<div className={styles.makerInfo}>
			<div className={styles.head}>
				<h2 className={styles.brandName}>{headingTitle}</h2>
				{brand.logoImageUrl && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={brand.logoImageUrl}
						alt={t('pages.maker.makerInfo.logoAlt', {
							brandName: brand.brandName,
						})}
					/>
				)}
			</div>

			{brand.catchCopy && (
				<div
					className={styles.description}
					dangerouslySetInnerHTML={{ __html: brand.catchCopy }}
				></div>
			)}

			{brand.brandSiteUrl && (
				<div className={styles.brandInfo}>
					<a
						className={styles.brandLink}
						href={brand.brandSiteUrl}
						target="_blank"
						rel="noreferrer"
					>
						{t('pages.maker.makerInfo.goToWebsite', {
							brandName: brand.brandName,
						})}
					</a>
				</div>
			)}
		</div>
	);
};
MakerInfo.displayName = 'MakerInfo';
