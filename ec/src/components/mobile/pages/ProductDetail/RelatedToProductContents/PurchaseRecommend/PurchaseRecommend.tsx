import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePurchaseRecommend, useSeries } from './PurchaseRecommend.hook';
import styles from './PurchaseRecommend.module.scss';
import { RecommendDaysToShip } from '@/components/mobile/domain/daysToShip';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Link } from '@/components/mobile/ui/links';
import { StandardPrice } from '@/components/mobile/ui/text/Price';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { Flag } from '@/models/api/Flag';
import { url } from '@/utils/url';

/** Complementary products section */
export const PurchaseRecommend: FC = () => {
	const { t } = useTranslation();
	const response = usePurchaseRecommend();
	const { seriesCode, misumiFlag } = useSeries();

	const getRid = useCallback(
		(seriesCodeOfItem: string, index: number) => {
			if (Flag.isTrue(misumiFlag)) {
				return 'rid2';
			}
			return `rid26_${seriesCode}_${seriesCodeOfItem}_${index}`;
		},
		[misumiFlag, seriesCode]
	);

	const getProductUrl = useCallback(
		(url: string, seriesCodeOfItem: string, index: number) => {
			const productUrl = new URL(url);
			productUrl.searchParams.append('rid', getRid(seriesCodeOfItem, index));
			productUrl.searchParams.append('list', ItemListName.PURCHASE_RECOMMEND);
			return productUrl.toString();
		},
		[getRid]
	);

	const handleClickProduct = useCallback((seriesCode: string) => {
		ga.ecommerce.selectItem({
			seriesCode,
			itemListName: ItemListName.PURCHASE_RECOMMEND,
		});
	}, []);

	if (!response?.totalCount) {
		return null;
	}

	return (
		<>
			<SectionHeading>
				{t(
					'mobile.pages.productDetail.relatedToProductContents.purchaseRecommend.title'
				)}
			</SectionHeading>

			<div className={styles.listWrapper}>
				<ul className={styles.list}>
					{response.purchaseRecommendList.map((item, index) => (
						<li key={`${item.seriesCode}-${index}`} className={styles.item}>
							<Link
								href={getProductUrl(
									url.productDetail(item.seriesCode).default,
									item.seriesCode,
									index
								)}
								className={styles.itemContainer}
								onClick={() => handleClickProduct(item.seriesCode)}
							>
								<div className={styles.imageWrapper}>
									<ProductImage
										imageUrl={item.productImageList[0]?.url}
										preset="t_product_recommend_a"
										comment={item.seriesName}
										className={styles.image}
									/>
								</div>
								<p
									className={styles.productName}
									dangerouslySetInnerHTML={{ __html: item.seriesName }}
								/>
								<p
									className={styles.brandName}
									dangerouslySetInnerHTML={{ __html: item.brandName }}
								/>
								{item.minStandardUnitPrice && (
									<p className={styles.text}>
										{t(
											'mobile.pages.productDetail.relatedToProductContents.purchaseRecommend.standardPrice'
										)}{' '}
										:{' '}
										<span className={styles.textBold}>
											<StandardPrice
												minStandardUnitPrice={item.minStandardUnitPrice}
												maxStandardUnitPrice={item.maxStandardUnitPrice}
												ccyCode={response.currencyCode}
												suffix="-"
											/>
										</span>
									</p>
								)}
								<div className={styles.daysToShip}>
									<RecommendDaysToShip
										minDaysToShip={item.minStandardDaysToShip}
										maxDaysToShip={item.maxStandardDaysToShip}
									/>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

PurchaseRecommend.displayName = 'PurchaseRecommend';
