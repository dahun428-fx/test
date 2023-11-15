import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ViewHistorySimulPurchase.module.scss';
import { RecommendList } from '@/components/mobile/pages/Home/CameleerContents/RecommendList';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { RecommendItem as CameleerRecommendItem } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { GetViewHistorySimulPurchaseResponse } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';

type Props = {
	viewHistorySimulPurchase: GetViewHistorySimulPurchaseResponse;
	onClickItem?: (item: CameleerRecommendItem) => void;
	onLoadImage: (item: CameleerRecommendItem) => void;
};

/** View history simul purchase component */
export const ViewHistorySimulPurchase: React.VFC<Props> = ({
	viewHistorySimulPurchase,
	onClickItem,
	onLoadImage,
}) => {
	const [t] = useTranslation();

	const { recommendItems } = viewHistorySimulPurchase;

	return (
		<div className={styles.container}>
			<SectionHeading>
				{t('mobile.pages.home.cameleerContents.viewHistorySimulPurchase.title')}
			</SectionHeading>
			<div className={styles.listWrapper}>
				<RecommendList
					items={recommendItems}
					itemListName={ItemListName.INTEREST_RECOMMEND}
					onClickItem={onClickItem}
					onLoadImage={onLoadImage}
				/>
			</div>
		</div>
	);
};
ViewHistorySimulPurchase.displayName = 'ViewHistorySimulPurchase';
