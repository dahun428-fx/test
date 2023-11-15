import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RecommendItems.module.scss';
import { CrmPagination } from '@/components/pc/domain/category/CrmPagination';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links/Link';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { config } from '@/config';
import { usePage } from '@/hooks/state/usePage';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';
import { toNumeric } from '@/utils/string';

type Props = {
	recommendedItems: GeneralRecommendSeriesItem[];
	onClickItem: (item: GeneralRecommendSeriesItem) => void;
	onLoadItem: (item: GeneralRecommendSeriesItem) => void;
	generateItemPath: (item: GeneralRecommendSeriesItem) => string;
};

const ITEM_WIDTH = 140;

/**
 * Recommend items component
 * ([Your recently viewed items and Recommendations -> Recommendations])
 * @TODO 2023.08. GeneralRecommend一部導入により、ViewHistoryProducs/RecommendItemsと分化。再び共通化した際にはリファクタする。
 * @see ../ViewHistoryProducts/RecommendItems
 */
export const RecommendItems: React.VFC<Props> = ({
	recommendedItems: recommendListItem,
	onClickItem,
	onLoadItem,
	generateItemPath,
}) => {
	const [t] = useTranslation();

	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;

	const { setPageSize, goToNext, backToPrev, pageSize, listPerPage } = usePage({
		initialPageSize: 1,
		list: recommendListItem,
	});

	return (
		<CrmPagination
			itemWidth={ITEM_WIDTH}
			totalItems={recommendListItem.length}
			{...{ pageSize, setPageSize, goToNext, backToPrev }}
		>
			{listPerPage.map((item, index) => (
				<li key={index} className={styles.recommendItem}>
					<div
						className={styles.panelItem}
						onClick={() => onClickItem(item)}
						style={{ width: ITEM_WIDTH }}
					>
						<div className={styles.imageContainer}>
							<ProductImage
								className={styles.image}
								imageUrl={item.imgUrl}
								comment={item.seriesName}
								size={100}
								onLoad={() => onLoadItem(item)}
							/>
						</div>
						<p className={styles.brand}>{item.brandName}</p>
						<Link
							href={generateItemPath(item)}
							className={styles.itemLink}
							onClick={e => e.preventDefault()}
						>
							{item.seriesName}
						</Link>
						<p className={styles.standardPrice}>
							{t('components.domain.category.cameleerContents.unitPrice')}
							<StandardPrice
								minStandardUnitPrice={toNumeric(item.minStandardUnitPrice)}
								maxStandardUnitPrice={toNumeric(item.maxStandardUnitPrice)}
								ccyCode={currencyCode}
							/>
						</p>
						<p className={styles.daysToShip}>
							{t('components.domain.category.cameleerContents.daysToShip')}
							<CrmDaysToShip
								minDaysToShip={toNumeric(item.minStandardDaysToShip)}
								maxDaysToShip={toNumeric(item.maxStandardDaysToShip)}
							/>
						</p>
					</div>
				</li>
			))}
		</CrmPagination>
	);
};
RecommendItems.displayName = 'RecommendItems';
