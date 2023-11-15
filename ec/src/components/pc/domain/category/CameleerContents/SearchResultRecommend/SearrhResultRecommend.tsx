import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SearchResultRecommend.module.scss';
import { CrmPagination } from '@/components/pc/domain/category/CrmPagination';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links/Link';
import { usePage } from '@/hooks/state/usePage';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

type Props = {
	recommendedItems: GeneralRecommendSeriesItem[];
	onLoadImage: (item: GeneralRecommendSeriesItem) => void;
	onClickItem: (item: GeneralRecommendSeriesItem) => void;
};

/** 検索結果画面用汎用レコメンドコンポーネントView */
export const SearchResultRecommend: React.VFC<Props> = ({
	recommendedItems,
	onLoadImage,
	onClickItem,
}) => {
	const [t] = useTranslation();

	const { setPageSize, goToNext, backToPrev, pageSize, listPerPage } = usePage({
		initialPageSize: 1,
		list: recommendedItems,
	});

	// liの親になるCrmPagination内のulに充てるスタイル
	const listContainerStyle: CSSProperties = useMemo(
		() => ({
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: 'space-around',
			rowGap: '70px',
			padding: '8px 0',
			height: '260px',
		}),
		[]
	);

	// カルーセルで見えてるリスト
	const viewableList = useMemo(
		() =>
			listPerPage.map(item => (
				<li
					className={styles.item}
					onClick={() => onClickItem(item)}
					key={item.seriesCode}
				>
					<ProductImage
						imageUrl={item.imgUrl}
						comment={item.seriesName}
						size={64}
						onLoad={() => onLoadImage(item)}
					/>
					<div>
						<Link
							href={`${item.linkUrl}?rid=rid3_searchresult_${item.position}_${item.seriesCode}`}
							className={styles.itemName}
							onClick={e => e.preventDefault()}
						>
							{item.seriesName}
						</Link>
						<p>{item.brandName}</p>
						<p>
							{t(
								'components.domain.category.cameleerContents.searchResultRecommend.dayToShip'
							)}
							{item.minShortestDaysToShip || item.minStandardDaysToShip}
							{t(
								'components.domain.category.cameleerContents.searchResultRecommend.dayToShipSuffix'
							)}
						</p>
					</div>
				</li>
			)),
		[listPerPage, onClickItem, onLoadImage, t]
	);

	return (
		<CameleerContents
			title={t(
				'components.domain.category.cameleerContents.searchResultRecommend.title'
			)}
			className={styles.container}
		>
			<CrmPagination
				itemWidth={350}
				totalItems={recommendedItems.length}
				rowNumber={2}
				listContainerStyle={listContainerStyle}
				{...{ pageSize, setPageSize, goToNext, backToPrev }}
			>
				{viewableList}
			</CrmPagination>
		</CameleerContents>
	);
};
SearchResultRecommend.displayName = 'SearchResultRecoomend';
