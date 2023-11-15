import React from 'react';
import styles from './RecommendList.module.scss';
import { RecommendItem } from '@/components/mobile/pages/Home/CameleerContents/RecommendItem';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { RecommendItem as CameleerRecommendItem } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';

type Props = {
	items: CameleerRecommendItem[];
	itemListName: ItemListName;
	onClickItem?: (item: CameleerRecommendItem) => void;
	onLoadImage: (item: CameleerRecommendItem) => void;
};

/** Recommend List component */
export const RecommendList: React.VFC<Props> = ({
	items,
	itemListName,
	onClickItem,
	onLoadImage,
}) => {
	return (
		<ul className={styles.list}>
			{items.map((item, index) => (
				<RecommendItem
					key={index}
					recommendData={item}
					itemListName={itemListName}
					onClick={onClickItem}
					onLoadImage={() => onLoadImage(item)}
				/>
			))}
		</ul>
	);
};
RecommendItem.displayName = 'RecommendList';
