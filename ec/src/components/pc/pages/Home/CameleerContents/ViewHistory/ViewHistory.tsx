import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ViewHistory.module.scss';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { config } from '@/config';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import {
	GetViewHistoryResponse,
	RecommendItem,
} from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { assignListParam } from '@/utils/cameleer';
import { toNumeric } from '@/utils/string';

type Props = {
	viewHistory: GetViewHistoryResponse;
};

export const ViewHistory: React.VFC<Props> = ({ viewHistory }) => {
	const [t] = useTranslation();
	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;

	const items = useMemo(
		() => viewHistory.recommendItems.slice(0, 6),
		[viewHistory.recommendItems]
	);

	const handleClickItem = (item: RecommendItem) => {
		cameleer.trackClick({ ...viewHistory, item }).then();
		ga.ecommerce.selectItem({
			seriesCode: item.itemCd,
			itemListName: ItemListName.VIEW_HISTORY,
		});
	};

	useEffect(() => {
		ga.ecommerce.viewItemList(
			items.map(recommend => ({
				seriesCode: recommend.itemCd,
				itemListName: ItemListName.VIEW_HISTORY,
			}))
		);
	}, [items]);

	return (
		<CameleerContents title={viewHistory.title} className={styles.viewHistory}>
			<p>{t('pages.home.cameleerContents.viewHistory.supplementaryMessage')}</p>
			<ul className={styles.list}>
				{items.map(
					(item, index) =>
						item.linkUrl && (
							<li key={index} className={styles.item}>
								<Link
									href={assignListParam(
										item.linkUrl,
										ItemListName.VIEW_HISTORY
									)}
									className={styles.link}
									onClick={() => handleClickItem(item)}
								>
									<div className={styles.imageContainer}>
										<ProductImage
											imageUrl={item.imgUrl}
											className={styles.image}
											comment={item.name}
											size={150}
											onLoad={() =>
												cameleer
													.trackImpression({ ...viewHistory, item })
													.then()
											}
										/>
									</div>
									<p className={styles.brand}>{item.maker}</p>
									<p
										className={styles.name}
										dangerouslySetInnerHTML={{ __html: item.name ?? '' }}
									/>
									<p className={styles.price}>
										{t('pages.home.cameleerContents.viewHistory.unitPrice')}
										<StandardPrice
											minStandardUnitPrice={toNumeric(item.priceFrom)}
											maxStandardUnitPrice={toNumeric(item.priceTo)}
											ccyCode={currencyCode}
											suffix="-"
										/>
									</p>
									<p className={styles.daysToShip}>
										{t('pages.home.cameleerContents.viewHistory.daysToShip')}
										<CrmDaysToShip
											minDaysToShip={toNumeric(item.deliveryFrom)}
											maxDaysToShip={toNumeric(item.deliveryTo)}
										/>
									</p>
								</Link>
							</li>
						)
				)}
			</ul>
		</CameleerContents>
	);
};
ViewHistory.displayName = 'ViewHistory';
