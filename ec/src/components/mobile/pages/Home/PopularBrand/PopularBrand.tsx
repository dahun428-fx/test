import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePopularBrandList } from './PopularBrand.hooks';
import styles from './PopularBrand.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';

export const PopularBrand = () => {
	const { popularBrand } = usePopularBrandList();
	const { t } = useTranslation();

	if (!popularBrand) {
		return null;
	}

	return (
		<div className={styles.container}>
			<SectionHeading>
				{t('mobile.pages.home.popularBrand.title')}
			</SectionHeading>
			<div className={styles.scrollWrapper}>
				<div className={styles.listWrapper}>
					<ul className={styles.list}>
						{popularBrand.brandList.map((item, index) => (
							<li key={index} className={styles.listItem}>
								{item.logoImageUrl ? (
									<div className={styles.imageContainer}>
										<a href={item.brandUrl} className={styles.link}>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												className={styles.image}
												src={item.logoImageUrl}
												alt={item.brandName}
												width={110}
												height={44}
												loading="lazy"
											/>
										</a>
									</div>
								) : (
									<div className={styles.noImageContainer}>
										<a href={item.brandUrl} className={styles.noImageLink}>
											{item.brandName}
										</a>
									</div>
								)}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
