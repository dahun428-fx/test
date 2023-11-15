import Router from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PurchaseSeriesRepeatRecommend.module.scss';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { usePage } from '@/hooks/state/usePage';
import { ga } from '@/logs/analytics/google';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { cameleer } from '@/logs/cameleer';
import {
	GetPurchaseSeriesRepeatRecommendResponse,
	RecommendItem,
} from '@/models/api/cameleer/getPurchaseSeriesRepeatRecommend/GetPurchaseSeriesRepeatRecommendResponse';
import { trimUrlDomain, hasLinkUrl } from '@/utils/cameleer';
import { toNumeric } from '@/utils/string';
import { getWindowSize, WindowSize } from '@/utils/window';

type Props = {
	purchaseSeriesRepeatRecommend: GetPurchaseSeriesRepeatRecommendResponse;
};

export const PurchaseSeriesRepeatRecommend: React.VFC<Props> = ({
	purchaseSeriesRepeatRecommend,
}) => {
	const [t] = useTranslation();

	function getPageSize() {
		const windowSize = getWindowSize();
		switch (windowSize) {
			case WindowSize.LARGE:
				return 6;
			case WindowSize.MEDIUM:
				return 5;
			default:
				return 3;
		}
	}

	const recommendItems = useMemo(
		() => purchaseSeriesRepeatRecommend.recommendItems.filter(hasLinkUrl),
		[purchaseSeriesRepeatRecommend.recommendItems]
	);

	const {
		listPerPage: displayRecommends,
		pageSize,
		goToNext,
		backToPrev,
		setPageSize,
	} = usePage({
		initialPageSize: getPageSize(),
		list: recommendItems,
	});

	const resize = useCallback(() => {
		setPageSize(getPageSize());
	}, [setPageSize]);

	const handleClickSeriesPanel = (item: RecommendItem) => {
		ga.ecommerce.selectItem({
			seriesCode: item.itemCd,
			itemListName: ItemListName.PURCHASE_SERIES_REPEAT_RECOMMEND,
		});
		cameleer.trackClick({ ...purchaseSeriesRepeatRecommend, item }).then();
		if (item.linkUrl) {
			Router.push(trimUrlDomain(item.linkUrl));
		}
	};

	useEffect(() => {
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, [resize]);

	useEffect(() => {
		ga.ecommerce.viewItemList(
			displayRecommends.map(recommend => ({
				seriesCode: recommend.itemCd,
				itemListName: ItemListName.PURCHASE_SERIES_REPEAT_RECOMMEND,
			}))
		);
	}, [displayRecommends]);

	return (
		<CameleerContents
			title={purchaseSeriesRepeatRecommend.title}
			className={styles.recommendContent}
		>
			<p>
				{t(
					'pages.home.cameleerContents.purchaseRecommend.supplementaryMessage'
				)}
			</p>
			<div className={styles.wrapper}>
				<ul data-page-size={pageSize} className={styles.seriesPanelList}>
					{displayRecommends.map((recommend, index) => (
						<li
							key={index}
							className={styles.seriesPanel}
							onClick={() => handleClickSeriesPanel(recommend)}
						>
							<div className={styles.imageContainer}>
								<ProductImage
									imageUrl={recommend.imgUrl}
									className={styles.image}
									comment={recommend.name}
									size={150}
									onLoad={() =>
										cameleer
											.trackImpression({
												...purchaseSeriesRepeatRecommend,
												item: recommend,
											})
											.then()
									}
								/>
							</div>
							<Link
								href={trimUrlDomain(recommend.linkUrl)}
								className={styles.link}
								dangerouslySetInnerHTML={{ __html: recommend.name ?? '' }}
							/>
							<div className={styles.brandName}>{recommend.maker}</div>
							<div className={styles.sameDayShipOut}>
								{t('pages.home.cameleerContents.purchaseRecommend.daysToShip')}
								<CrmDaysToShip
									className={styles.daysToShipValue}
									minDaysToShip={toNumeric(recommend.deliveryFrom)}
									maxDaysToShip={toNumeric(recommend.deliveryTo)}
								/>
							</div>
						</li>
					))}
				</ul>
				<div className={styles.previous} onClick={() => backToPrev()}></div>
				<div className={styles.next} onClick={() => goToNext()}></div>
			</div>
		</CameleerContents>
	);
};
PurchaseSeriesRepeatRecommend.displayName = 'PurchaseSeriesRepeatRecommend';
