import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ViewedHistoryProducts.module.scss';
import { RecommendItems } from '@/components/pc/domain/category/CameleerContents/_legacy/ViewedHistoryProducts/RecommendItems';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import { GetViewHistoryResponse } from '@/models/api/cameleer/getViewHistory/GetViewHistoryResponse';
import { assignListParam } from '@/utils/cameleer';

type Props = {
	viewHistory: GetViewHistoryResponse;
};

/** Viewed history products component */
export const ViewedHistoryProducts: React.VFC<Props> = ({ viewHistory }) => {
	const [t] = useTranslation();
	const router = useRouter();

	const handleClickSeriesPanel = useCallback(
		(itemCode: string, position: number, seriesUrl?: string) => {
			cameleer
				.trackClick({ ...viewHistory, item: { itemCd: itemCode, position } })
				.then();

			ga.ecommerce.selectItem({
				seriesCode: itemCode,
				itemListName: ItemListName.VIEW_HISTORY,
			});

			if (seriesUrl) {
				const path = assignListParam(seriesUrl, ItemListName.VIEW_HISTORY);
				router.push(path);
			}
		},
		[router, viewHistory]
	);

	const handleLoadSeriesImage = useCallback(
		(itemCode: string, position: number) => {
			cameleer
				.trackImpression({
					...viewHistory,
					item: { itemCd: itemCode, position },
				})
				.then();
		},
		[viewHistory]
	);

	return (
		<CameleerContents title={viewHistory.title} className={styles.viewHistory}>
			<p className={styles.title}>
				{t('components.domain.category.cameleerContents.supplementaryMessage')}
			</p>
			<RecommendItems
				recommendListItem={viewHistory.recommendItems}
				onClick={handleClickSeriesPanel}
				onLoadImage={handleLoadSeriesImage}
				itemListName={ItemListName.VIEW_HISTORY}
			/>
		</CameleerContents>
	);
};
ViewedHistoryProducts.displayName = 'ViewedHistoryProducts';
