import styles from './PurchaseSeriesRepeatRecommend.module.scss';
import { RecommendList } from '@/components/mobile/pages/Home/CameleerContents/RecommendList';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { GetPurchaseSeriesRepeatRecommendResponse } from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendResponse';
import { RecommendItem as CameleerRecommendItem } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';

type Props = {
	purchaseSeriesRepeatRecommend: GetPurchaseSeriesRepeatRecommendResponse;
	onClickItem?: (item: CameleerRecommendItem) => void;
	onLoadImage: (item: CameleerRecommendItem) => void;
};

export const PurchaseSeriesRepeatRecommend: React.VFC<Props> = ({
	purchaseSeriesRepeatRecommend,
	onClickItem,
	onLoadImage,
}) => {
	return (
		<div className={styles.container}>
			<SectionHeading>{purchaseSeriesRepeatRecommend.title}</SectionHeading>
			<div className={styles.listWrapper}>
				<RecommendList
					items={purchaseSeriesRepeatRecommend.recommendItems}
					itemListName={ItemListName.PURCHASE_SERIES_REPEAT_RECOMMEND}
					onClickItem={onClickItem}
					onLoadImage={onLoadImage}
				/>
			</div>
		</div>
	);
};
PurchaseSeriesRepeatRecommend.displayName = 'PurchaseSeriesRepeatRecommend';
