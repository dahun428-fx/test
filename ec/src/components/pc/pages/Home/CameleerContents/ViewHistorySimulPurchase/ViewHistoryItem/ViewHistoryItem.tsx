import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ViewHistoryItem.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { ViewHistoryItem as ViewHistory } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { assignListParam } from '@/utils/cameleer';
import { toNumeric } from '@/utils/string';

type Props = {
	viewHistoryItem: ViewHistory;
	currencyCode: string;
	onClick: (itemCode: string, position: number, seriesUrl?: string) => void;
	onLoadImage: (itemCode: string, position: number) => void;
};

export const ViewHistoryItem: React.VFC<Props> = ({
	viewHistoryItem,
	currencyCode,
	onClick,
	onLoadImage,
}) => {
	const [t] = useTranslation();

	const handleClick = (event?: React.MouseEvent) => {
		event?.preventDefault();
		event?.stopPropagation();
		onClick(
			viewHistoryItem.itemCd,
			viewHistoryItem.position,
			viewHistoryItem.linkUrl
		);
	};

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>
				{t(
					'pages.home.cameleerContents.viewHistorySimulPurchase.viewHistoryItem.recentView'
				)}
			</h3>
			<li className={styles.productContainer} onClick={handleClick}>
				<div className={styles.imageContainer}>
					<ProductImage
						className={styles.image}
						imageUrl={viewHistoryItem.imgUrl}
						comment={viewHistoryItem.name}
						size={150}
						onLoad={() =>
							onLoadImage(viewHistoryItem.itemCd, viewHistoryItem.position)
						}
					/>
				</div>
				<p className={styles.brand}>{viewHistoryItem.maker}</p>
				<p className={styles.productName}>
					<Link
						href={assignListParam(
							viewHistoryItem.linkUrl,
							ItemListName.INTEREST_RECOMMEND
						)}
						className={styles.itemLink}
						onClick={handleClick}
						dangerouslySetInnerHTML={{ __html: viewHistoryItem.name ?? '' }}
					/>
				</p>
				<p className={styles.standardPrice}>
					{t(
						'pages.home.cameleerContents.viewHistorySimulPurchase.viewHistoryItem.unitPrice'
					)}
					<StandardPrice
						minStandardUnitPrice={toNumeric(viewHistoryItem.priceFrom)}
						maxStandardUnitPrice={toNumeric(viewHistoryItem.priceTo)}
						ccyCode={currencyCode}
						suffix="-"
					/>
				</p>
				<p className={styles.daysToShip}>
					{t(
						'pages.home.cameleerContents.viewHistorySimulPurchase.viewHistoryItem.daysToShip'
					)}
					<CrmDaysToShip
						minDaysToShip={toNumeric(viewHistoryItem.deliveryFrom)}
						maxDaysToShip={toNumeric(viewHistoryItem.deliveryTo)}
					/>
				</p>
			</li>
		</div>
	);
};
ViewHistoryItem.displayName = 'ViewHistoryItem';
