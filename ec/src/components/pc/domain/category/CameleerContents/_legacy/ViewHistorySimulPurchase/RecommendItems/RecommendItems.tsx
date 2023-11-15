import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RecommendItems.module.scss';
import { CrmPagination } from '@/components/pc/domain/category/CrmPagination';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { config } from '@/config';
import { usePage } from '@/hooks/state/usePage';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { RecommendItem } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { assignListParam } from '@/utils/cameleer';
import { toNumeric } from '@/utils/string';
type Props = {
	recommendListItem: RecommendItem[];
	itemListName: ItemListName;
	onClick: (itemCode: string, position: number, seriesUrl?: string) => void;
	onLoadImage: (itemCode: string, position: number) => void;
};

const ITEM_WIDTH = 140;

/** Recommend items component */
export const RecommendItems: React.VFC<Props> = ({
	recommendListItem,
	itemListName,
	onClick,
	onLoadImage,
}) => {
	const [t] = useTranslation();

	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;

	const { setPageSize, goToNext, backToPrev, pageSize, listPerPage } = usePage({
		initialPageSize: 1,
		list: recommendListItem,
	});

	const handleClickItem = (
		recommend: RecommendItem,
		event?: React.MouseEvent
	) => {
		event?.preventDefault();
		event?.stopPropagation();
		onClick(recommend.itemCd, recommend.position, recommend.linkUrl);
	};

	useEffect(() => {
		// FIXME: This is a trick to avoid sending GA event when page size in initial state.
		// If having pattern of page size = 1 in UI, need to reconsider this.
		if (pageSize > 1) {
			ga.ecommerce.viewItemList(
				listPerPage.map(recommend => ({
					seriesCode: recommend.itemCd,
					itemListName,
				}))
			);
		}
	}, [itemListName, listPerPage, pageSize]);

	return (
		<CrmPagination
			itemWidth={ITEM_WIDTH}
			totalItems={recommendListItem.length}
			{...{ pageSize, setPageSize, goToNext, backToPrev }}
		>
			{listPerPage.map((recommend, index) => (
				<li key={index} className={styles.recommendItem}>
					<div
						className={styles.panelItem}
						onClick={() => handleClickItem(recommend)}
						style={{ width: ITEM_WIDTH }}
					>
						<div className={styles.imageContainer}>
							<ProductImage
								className={styles.image}
								imageUrl={recommend.imgUrl}
								comment={recommend.name}
								size={100}
								onLoad={() => onLoadImage(recommend.itemCd, recommend.position)}
							/>
						</div>
						<p className={styles.brand}>{recommend.maker}</p>
						<Link
							href={assignListParam(recommend.linkUrl, itemListName)}
							className={styles.itemLink}
							onClick={event => {
								handleClickItem(recommend, event);
							}}
							dangerouslySetInnerHTML={{ __html: recommend.name ?? '' }}
						/>
						<p className={styles.standardPrice}>
							{t('components.domain.category.cameleerContents.unitPrice')}
							<StandardPrice
								minStandardUnitPrice={toNumeric(recommend.priceFrom)}
								maxStandardUnitPrice={toNumeric(recommend.priceTo)}
								ccyCode={currencyCode}
								suffix="-"
							/>
						</p>
						<p className={styles.daysToShip}>
							{t('components.domain.category.cameleerContents.daysToShip')}
							<CrmDaysToShip
								minDaysToShip={toNumeric(recommend.deliveryFrom)}
								maxDaysToShip={toNumeric(recommend.deliveryTo)}
							/>
						</p>
					</div>
				</li>
			))}
		</CrmPagination>
	);
};
RecommendItems.displayName = 'RecommendItems';
