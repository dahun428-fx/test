import { useRouter } from 'next/router';
import { useCallback, VFC } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewHistoryItem } from './ViewHistoryItem';
import styles from './ViewHistorySimulPurchase.module.scss';
import { CameleerContents } from '@/components/pc/domain/category/CameleerContents';
import { RecommendItems } from '@/components/pc/domain/category/CameleerContents/_legacy/ViewHistorySimulPurchase/RecommendItems';
import { config } from '@/config';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import { GetViewHistorySimulPurchaseResponse } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { assignListParam } from '@/utils/cameleer';

type Props = {
	viewHistorySimulPurchase: GetViewHistorySimulPurchaseResponse;
};

/** View history simul purchase component */
export const ViewHistorySimulPurchase: VFC<Props> = ({
	viewHistorySimulPurchase,
}) => {
	const [t] = useTranslation();
	const router = useRouter();
	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;
	const { recommendItems, title, viewHistoryItem } = viewHistorySimulPurchase;

	const handleClickSeriesPanel = useCallback(
		(itemCode: string, position: number, seriesUrl?: string) => {
			cameleer
				.trackClick({
					...viewHistorySimulPurchase,
					item: { itemCd: itemCode, position },
				})
				.then();

			ga.ecommerce.selectItem({
				seriesCode: itemCode,
				itemListName: ItemListName.INTEREST_RECOMMEND,
			});

			if (seriesUrl) {
				const path = assignListParam(
					seriesUrl,
					ItemListName.INTEREST_RECOMMEND
				);
				router.push(path);
			}
		},
		[router, viewHistorySimulPurchase]
	);

	const handleLoadSeriesImage = useCallback(
		(itemCode: string, position: number) => {
			cameleer
				.trackImpression({
					...viewHistorySimulPurchase,
					item: { itemCd: itemCode, position },
				})
				.then();
		},
		[viewHistorySimulPurchase]
	);

	return (
		<CameleerContents title={title} className={styles.recommendContent}>
			<p className={styles.subtitle}>
				{t('components.domain.category.cameleerContents.supplementaryMessage')}
			</p>
			<div className={styles.viewHistorySimulPurchaseContainer}>
				<ViewHistoryItem
					viewHistoryItem={viewHistoryItem}
					currencyCode={currencyCode}
					onClick={handleClickSeriesPanel}
					onLoadImage={handleLoadSeriesImage}
				/>
				<div className={styles.container}>
					<div className={styles.pagerContainer}>
						<div className={styles.titleContents}>
							<h2 className={styles.title}>
								{t(
									'components.domain.category.cameleerContents.viewHistorySimulPurchase.recommendations'
								)}
							</h2>
						</div>
						<RecommendItems
							recommendListItem={recommendItems}
							onClick={handleClickSeriesPanel}
							onLoadImage={handleLoadSeriesImage}
							itemListName={ItemListName.INTEREST_RECOMMEND}
						/>
					</div>
				</div>
			</div>
		</CameleerContents>
	);
};
ViewHistorySimulPurchase.displayName = 'ViewHistorySimulPurchase';
