import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInterestRecommend } from './InterestRecommend.hooks';
import styles from './InterestRecommend.module.scss';
import { RecommendDaysToShip } from '@/components/mobile/domain/daysToShip';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Link } from '@/components/mobile/ui/links';
import { StandardPrice } from '@/components/mobile/ui/text/Price';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { pagesPath } from '@/utils/$path';

/**
 * Products that users who are viewing this product are also viewing
 */
export const InterestRecommend: React.VFC = () => {
	const [t] = useTranslation();

	const response = useInterestRecommend();

	const handleClick = (seriesCode: string) => {
		ga.ecommerce.selectItem({
			seriesCode,
			itemListName: ItemListName.INTEREST_RECOMMEND,
		});
	};

	if (!response || response.totalCount < 1) {
		return null;
	}

	const { interestRecommendList, currencyCode } = response;

	return (
		<>
			<SectionHeading>
				{t(
					'mobile.pages.productDetail.relatedToProductContents.interestRecommend.title'
				)}
			</SectionHeading>

			<ul className={styles.interestRecommendContainer}>
				{interestRecommendList.map((item, index) => (
					<li key={index} className={styles.itemContainer}>
						<Link
							href={pagesPath.vona2.detail._seriesCode(item.seriesCode).$url({
								query: { rid: 'rid3', list: ItemListName.INTEREST_RECOMMEND },
							})}
							onClick={() => handleClick(item.seriesCode)}
							className={styles.itemLink}
						>
							<div className={styles.itemImageBox}>
								<ProductImage
									imageUrl={item.productImageList[0]?.url}
									loading="lazy"
									preset="t_product_recommend_b"
									className={styles.image}
								/>
							</div>
							<p
								className={styles.itemProductName}
								dangerouslySetInnerHTML={{ __html: item.seriesName }}
							/>
							<p
								className={styles.itemBrandName}
								dangerouslySetInnerHTML={{ __html: item.brandName }}
							/>
							{item.maxStandardUnitPrice && (
								<p className={styles.text}>
									{t(
										'mobile.pages.productDetail.relatedToProductContents.interestRecommend.priceTitle'
									)}
									<span className={styles.price}>
										<StandardPrice
											minStandardUnitPrice={item.minStandardUnitPrice}
											maxStandardUnitPrice={item.maxStandardUnitPrice}
											ccyCode={currencyCode}
											suffix="-"
										/>
									</span>
								</p>
							)}
							{item.minStandardDaysToShip && (
								<div className={styles.daysToShip}>
									<RecommendDaysToShip
										minDaysToShip={item.minStandardDaysToShip}
										maxDaysToShip={item.maxStandardDaysToShip}
									/>
								</div>
							)}
						</Link>
					</li>
				))}
			</ul>
		</>
	);
};
InterestRecommend.displayName = 'InterestRecommend';
