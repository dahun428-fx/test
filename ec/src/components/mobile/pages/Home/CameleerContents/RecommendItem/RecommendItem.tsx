import Link from 'next/link';
import React from 'react';
import styles from './RecommendItem.module.scss';
import { PriceLeadTime } from '@/components/mobile/pages/Home/CameleerContents/PriceLeadTime';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { RecommendItem as CameleerRecommendItem } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { assignListParam } from '@/utils/cameleer';
import { toNumeric } from '@/utils/string';

type Props = {
	recommendData: CameleerRecommendItem;
	itemListName: ItemListName;
	onClick?: (item: CameleerRecommendItem) => void;
	onLoadImage: () => void;
};

/** Recommend Item component */
export const RecommendItem: React.VFC<Props> = ({
	recommendData,
	itemListName,
	onClick,
	onLoadImage,
}) => {
	if (!recommendData.linkUrl) {
		return null;
	}

	return (
		<li>
			<Link href={assignListParam(recommendData.linkUrl, itemListName)}>
				<a className={styles.item} onClick={() => onClick?.(recommendData)}>
					<div className={styles.imageContainer}>
						<ProductImage
							imageUrl={recommendData.imgUrl}
							comment={recommendData.name}
							size={100}
							onLoad={onLoadImage}
						/>
					</div>
					<div className={styles.itemContent}>
						<p
							className={styles.name}
							dangerouslySetInnerHTML={{ __html: recommendData.name ?? '' }}
						/>
						<p className={styles.brand}>{recommendData.maker}</p>
						<PriceLeadTime
							deliveryFrom={toNumeric(recommendData.deliveryFrom)}
							deliveryTo={toNumeric(recommendData.deliveryTo)}
							priceFrom={toNumeric(recommendData.priceFrom)}
						/>
					</div>
				</a>
			</Link>
		</li>
	);
};
RecommendItem.displayName = 'RecommendItem';
