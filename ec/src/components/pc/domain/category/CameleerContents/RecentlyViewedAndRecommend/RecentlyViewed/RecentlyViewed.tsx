import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RecentlyViewed.module.scss';
import { HistoryItem } from '@/components/pc/domain/category/CameleerContents/RecentlyViewedAndRecommend/RecentlyViewedAndRecommend.container';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links/Link';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { toNumeric } from '@/utils/string';

type Props = {
	recentlyViewedItem: HistoryItem;
	currencyCode: string;
	onClickItem: (item: HistoryItem) => void;
	onLoadImage: (item: HistoryItem) => void;
	generateItemPath: (item: HistoryItem) => string;
};

/** Recently Viewed item component */
export const RecentlyViewed: React.VFC<Props> = ({
	recentlyViewedItem,
	currencyCode,
	onClickItem,
	onLoadImage,
	generateItemPath,
}) => {
	const [t] = useTranslation();

	const onClick = useCallback(
		() => onClickItem(recentlyViewedItem),
		[onClickItem, recentlyViewedItem]
	);
	const onLoad = useCallback(
		() => onLoadImage(recentlyViewedItem),
		[onLoadImage, recentlyViewedItem]
	);

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>
				{t(
					'components.domain.category.cameleerContents.recentlyViewedAndRecommend.recentView'
				)}
			</h3>
			<div className={styles.productContainer} onClick={onClick}>
				<div className={styles.imageContainer}>
					<ProductImage
						className={styles.image}
						imageUrl={recentlyViewedItem.imgUrl}
						comment={recentlyViewedItem.name}
						size={100}
						onLoad={onLoad}
					/>
				</div>
				<p className={styles.brand}>{recentlyViewedItem.maker}</p>
				<p className={styles.productName}>
					<Link
						href={generateItemPath(recentlyViewedItem)}
						className={styles.itemLink}
						onClick={e => e.preventDefault()}
					>
						{recentlyViewedItem.name}
					</Link>
				</p>
				<p className={styles.standardPrice}>
					{t('components.domain.category.cameleerContents.unitPrice')}
					<StandardPrice
						minStandardUnitPrice={toNumeric(recentlyViewedItem.priceFrom)}
						maxStandardUnitPrice={toNumeric(recentlyViewedItem.priceTo)}
						ccyCode={currencyCode}
						suffix="-"
					/>
				</p>
				<p className={styles.daysToShip}>
					{t('components.domain.category.cameleerContents.daysToShip')}
					<CrmDaysToShip
						minDaysToShip={toNumeric(recentlyViewedItem.deliveryFrom)}
						maxDaysToShip={toNumeric(recentlyViewedItem.deliveryTo)}
					/>
				</p>
			</div>
		</div>
	);
};
RecentlyViewed.displayName = 'RecentlyViewed';
