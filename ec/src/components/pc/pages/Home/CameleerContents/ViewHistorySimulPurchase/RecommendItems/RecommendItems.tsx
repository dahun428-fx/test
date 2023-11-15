import { useTranslation } from 'react-i18next';
import styles from './RecommendItems.module.scss';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links';
import { CrmDaysToShip } from '@/components/pc/ui/text/DaysToShip';
import { StandardPrice } from '@/components/pc/ui/text/Price';
import { ItemListName } from '@/logs/analytics/google/ecommerce/types';
import { RecommendItem } from '@/models/api/cameleer/getViewHistorySimulPurchase/GetViewHistorySimulPurchaseResponse';
import { assignListParam } from '@/utils/cameleer';
import { toNumeric } from '@/utils/string';

type Props = {
	currentPageRecommendList: RecommendItem[];
	currencyCode: string;
	onClick: (itemCode: string, position: number, seriesUrl?: string) => void;
	onLoadImage: (itemCode: string, position: number) => void;
	changePage: (prevOrNext: 'prev' | 'next') => void;
};

export const RecommendItems: React.VFC<Props> = ({
	currentPageRecommendList,
	currencyCode,
	onClick,
	onLoadImage,
	changePage,
}) => {
	const [t] = useTranslation();

	const handleClickItem = (
		recommend: RecommendItem,
		event?: React.MouseEvent
	) => {
		event?.preventDefault();
		event?.stopPropagation();
		onClick(recommend.itemCd, recommend.position, recommend.linkUrl);
	};

	return (
		<div className={styles.container}>
			<div className={styles.pagerContainer}>
				<div className={styles.previous} onClick={() => changePage('prev')} />
				<ul className={styles.panelList}>
					{currentPageRecommendList.map((recommend, index) => (
						<li
							key={index}
							className={styles.panelItem}
							onClick={() => handleClickItem(recommend)}
						>
							<div className={styles.imageContainer}>
								<ProductImage
									className={styles.image}
									imageUrl={recommend.imgUrl}
									comment={recommend.name}
									size={150}
									onLoad={() =>
										onLoadImage(recommend.itemCd, recommend.position)
									}
								/>
							</div>
							<p className={styles.brand}>{recommend.maker}</p>
							<Link
								href={assignListParam(
									recommend.linkUrl,
									ItemListName.INTEREST_RECOMMEND
								)}
								className={styles.itemLink}
								onClick={event => {
									handleClickItem(recommend, event);
								}}
								dangerouslySetInnerHTML={{ __html: recommend.name ?? '' }}
							/>
							<p className={styles.standardPrice}>
								{t(
									'pages.home.cameleerContents.viewHistorySimulPurchase.recommendItems.unitPrice'
								)}
								<StandardPrice
									minStandardUnitPrice={toNumeric(recommend.priceFrom)}
									maxStandardUnitPrice={toNumeric(recommend.priceTo)}
									ccyCode={currencyCode}
									suffix="-"
								/>
							</p>
							<p className={styles.daysToShip}>
								{t(
									'pages.home.cameleerContents.viewHistorySimulPurchase.recommendItems.daysToShip'
								)}
								<CrmDaysToShip
									minDaysToShip={toNumeric(recommend.deliveryFrom)}
									maxDaysToShip={toNumeric(recommend.deliveryTo)}
								/>
							</p>
						</li>
					))}
				</ul>
				<div className={styles.next} onClick={() => changePage('next')} />
			</div>
		</div>
	);
};
RecommendItems.displayName = 'RecommendItems';
