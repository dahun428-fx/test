import { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RecommendCode } from './CategoryRecommend.container';
import styles from './CategoryRecommend.module.scss';
import { CrmPagination } from '@/components/pc/domain/category/CrmPagination';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { ProductImage } from '@/components/pc/ui/images/ProductImage';
import { Link } from '@/components/pc/ui/links/Link';
import { config } from '@/config';
import { usePage } from '@/hooks/state/usePage';
import { GeneralRecommendLogParams } from '@/logs/cameleer/generalRecommend';
import { GeneralRecommendCategoryItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

type Props = {
	dispPage: GeneralRecommendLogParams['dispPage'];
	recommendCode: RecommendCode;
	recommendedItems: GeneralRecommendCategoryItem[];
	onLoadImage: (item: GeneralRecommendCategoryItem) => void;
	onClickItem: (item: GeneralRecommendCategoryItem) => void;
};

/** カテゴリ画面用のシンプルな汎用レコメンドコンポーネントView */
export const CategoryRecommend: React.VFC<Props> = ({
	dispPage,
	recommendCode,
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
			justifyContent: 'start',
			columnGap: '10px',
			padding: '8px 0',
			height: '225px',
		}),
		[]
	);

	const viewableList = useMemo(
		() =>
			listPerPage.map(item => (
				<li
					className={styles.item}
					onClick={() => onClickItem(item)}
					key={item.itemCd}
				>
					<ProductImage
						imageUrl={`${config.web.ec.origin}/${item.imgUrl}`}
						comment={item.name}
						size={100}
						onLoad={() => onLoadImage(item)}
					/>
					<Link
						href={`${item.linkUrl}?rid=${recommendCode}_${dispPage}_${item.position}_${item.itemCd}`}
						className={styles.itemName}
						onClick={e => e.preventDefault()}
					>
						{item.name}
					</Link>
				</li>
			)),
		[dispPage, listPerPage, onClickItem, onLoadImage, recommendCode]
	);

	return (
		<CameleerContents
			title={t(
				recommendCode === 'c12'
					? 'components.domain.category.cameleerContents.categoryRecommend.title.oneStepVariations'
					: 'components.domain.category.cameleerContents.categoryRecommend.title.needTheCategory'
			)}
			className={styles.container}
		>
			<CrmPagination
				itemWidth={124}
				totalItems={recommendedItems.length}
				listContainerStyle={listContainerStyle}
				{...{ pageSize, setPageSize, goToNext, backToPrev }}
			>
				{viewableList}
			</CrmPagination>
		</CameleerContents>
	);
};
CategoryRecommend.displayName = 'CategoryRecommend';
