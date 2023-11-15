import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RecommendItems } from './RecommendItems';
import { ViewHistoryItem } from './ViewHistoryItem';
import styles from './ViewHistorySimulPurchase.module.scss';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { config } from '@/config';
import { usePage } from '@/hooks/state/usePage';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import { GetViewHistorySimulPurchaseResponse } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { assignListParam } from '@/utils/cameleer';

type Props = {
	viewHistorySimulPurchase: GetViewHistorySimulPurchaseResponse;
};

function calculatePageSize() {
	return window.innerWidth < 1205 ? 2 : window.innerWidth < 1405 ? 4 : 5;
}

export const ViewHistorySimulPurchase: React.VFC<Props> = ({
	viewHistorySimulPurchase,
}) => {
	const [t] = useTranslation();
	const router = useRouter();
	// NOTE: cameleer api の返却値の価格通貨コードは現法固定 (MY => MYR)
	const currencyCode = config.defaultCurrencyCode;

	const { recommendItems, title, viewHistoryItem } = viewHistorySimulPurchase;

	const handleClickSeriesPanel = useCallback(
		(itemCd: string, position: number, seriesUrl?: string) => {
			cameleer
				.trackClick({ ...viewHistorySimulPurchase, item: { itemCd, position } })
				.then();
			ga.ecommerce.selectItem({
				seriesCode: itemCd,
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
		(itemCd: string, position: number) => {
			cameleer
				.trackImpression({
					...viewHistorySimulPurchase,
					item: { itemCd, position },
				})
				.then();
		},
		[viewHistorySimulPurchase]
	);

	const { listPerPage, setPageSize, goToNext, backToPrev } = usePage({
		initialPageSize: calculatePageSize(),
		list: recommendItems,
	});

	const changePage = useCallback(
		(prevOrNext: 'prev' | 'next') => {
			prevOrNext === 'prev' ? backToPrev() : goToNext();
		},
		[backToPrev, goToNext]
	);

	useEffect(() => {
		const resize = () => {
			setPageSize(calculatePageSize());
		};
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, [setPageSize]);

	useEffect(() => {
		ga.ecommerce.viewItemList(
			listPerPage.map(recommend => ({
				seriesCode: recommend.itemCd,
				itemListName: ItemListName.INTEREST_RECOMMEND,
			}))
		);
	}, [listPerPage]);

	return (
		<CameleerContents title={title} className={styles.recommendContent}>
			<p>
				{t(
					'pages.home.cameleerContents.viewHistorySimulPurchase.supplementaryMessage'
				)}
			</p>
			<div className={styles.viewHistorySimulPurchaseContainer}>
				<ViewHistoryItem
					viewHistoryItem={viewHistoryItem}
					currencyCode={currencyCode}
					onClick={handleClickSeriesPanel}
					onLoadImage={handleLoadSeriesImage}
				/>
				<RecommendItems
					currentPageRecommendList={listPerPage}
					currencyCode={currencyCode}
					onClick={handleClickSeriesPanel}
					changePage={changePage}
					onLoadImage={handleLoadSeriesImage}
				/>
			</div>
		</CameleerContents>
	);
};
ViewHistorySimulPurchase.displayName = 'ViewHistorySimulPurchase';
