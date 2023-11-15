import Link from 'next/link';
import styles from './RecommendCategoryItems.module.scss';
import { CrmPagination } from '@/components/pc/domain/category/CrmPagination';
import { usePage } from '@/hooks/state/usePage';

export type RecommendCategory = {
	categoryCode: string;
	categoryName: string;
	imageUrl: string;
	url: string;
	position: number;
};

type Props = {
	categoryList: RecommendCategory[];
	onClick: (itemCode: string, position: number) => void;
	onLoadImage: (itemCode: string, position: number) => void;
};

const ITEM_WIDTH = 124;

/** Recommend items components */
export const RecommendCategoryItems: React.VFC<Props> = ({
	categoryList,
	onClick,
	onLoadImage,
}) => {
	const { setPageSize, goToNext, backToPrev, pageSize, listPerPage } = usePage({
		initialPageSize: 1,
		list: categoryList,
	});

	return (
		<CrmPagination
			itemWidth={ITEM_WIDTH}
			totalItems={categoryList.length}
			{...{ pageSize, setPageSize, goToNext, backToPrev }}
		>
			{listPerPage.map((category, index) => (
				<li
					className={styles.item}
					key={index}
					onClick={() => onClick(category.categoryCode, category.position)}
					style={{ width: ITEM_WIDTH }}
				>
					<Link href={category.url} passHref>
						<a className={styles.linkItem}>
							<div className={styles.categoryImageWrapper}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									className={styles.categoryImage}
									src={category.imageUrl}
									alt={category.categoryName}
									onLoad={() =>
										onLoadImage(category.categoryCode, category.position)
									}
								/>
							</div>
							<span>{category.categoryName}</span>
						</a>
					</Link>
				</li>
			))}
		</CrmPagination>
	);
};
RecommendCategoryItems.displayName = 'RecommendCategoryItems';
