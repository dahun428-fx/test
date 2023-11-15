import React from 'react';
import styles from './ViewHistory.module.scss';
import { RecommendList } from '@/components/mobile/pages/Home/CameleerContents/RecommendList';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import {
	GetViewHistoryResponse,
	RecommendItem as CameleerRecommendItem,
} from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';

type Props = {
	viewHistory: GetViewHistoryResponse;
	onClickItem?: (item: CameleerRecommendItem) => void;
	onLoadImage: (item: CameleerRecommendItem) => void;
};

/** View history component */
export const ViewHistory: React.VFC<Props> = ({
	viewHistory,
	onClickItem,
	onLoadImage,
}) => {
	return (
		<div className={styles.container}>
			<SectionHeading>{viewHistory.title}</SectionHeading>
			<div className={styles.listWrapper}>
				<RecommendList
					items={viewHistory.recommendItems}
					itemListName={ItemListName.VIEW_HISTORY}
					onClickItem={onClickItem}
					onLoadImage={onLoadImage}
				/>
			</div>
		</div>
	);
};
ViewHistory.displayName = 'ViewHistory';
