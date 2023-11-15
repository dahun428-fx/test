import { VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { RecentlyViewed } from './RecentlyViewed';
import { HistoryItem } from './RecentlyViewedAndRecommend.container';
import styles from './RecentlyViewedAndRecommend.module.scss';
import { RecommendItems } from './RecommendItems';
import { CameleerContents } from '@/components/pc/domain/category/CameleerContents';
import { config } from '@/config';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

type Props = {
	historyItem: HistoryItem;
	recommendedItems: GeneralRecommendSeriesItem[];
	onLoadItem: (item: GeneralRecommendSeriesItem | HistoryItem) => void;
	onClickItem: (item: GeneralRecommendSeriesItem | HistoryItem) => void;
	generateItemPath: (item: GeneralRecommendSeriesItem | HistoryItem) => string;
};

/** Recently viewed & Recommendations component */
export const RecentlyViewedAndRecommend: VFC<Props> = ({
	historyItem,
	recommendedItems,
	onLoadItem,
	onClickItem,
	generateItemPath,
}) => {
	const [t] = useTranslation();
	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;

	return (
		<CameleerContents
			title={t(
				'components.domain.category.cameleerContents.recentlyViewedAndRecommend.title'
			)}
			className={styles.recommendContent}
		>
			<p className={styles.subtitle}>
				{t('components.domain.category.cameleerContents.supplementaryMessage')}
			</p>
			<div className={styles.viewHistorySimulPurchaseContainer}>
				<RecentlyViewed
					recentlyViewedItem={historyItem}
					currencyCode={currencyCode}
					onClickItem={onClickItem}
					onLoadImage={onLoadItem}
					generateItemPath={generateItemPath}
				/>
				<div className={styles.container}>
					<div className={styles.pagerContainer}>
						<div className={styles.titleContents}>
							<h2 className={styles.title}>
								{t(
									'components.domain.category.cameleerContents.recentlyViewedAndRecommend.recommendations'
								)}
							</h2>
						</div>
						<RecommendItems
							recommendedItems={recommendedItems}
							onClickItem={onClickItem}
							onLoadItem={onLoadItem}
							generateItemPath={generateItemPath}
						/>
					</div>
				</div>
			</div>
		</CameleerContents>
	);
};
RecentlyViewedAndRecommend.displayName = 'RecentlyViewedAndRecommend';
