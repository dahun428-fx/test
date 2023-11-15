import React from 'react';
import styles from './RecommendCategoriesSection.module.scss';
import { CameleerContents } from '@/components/pc/domain/category/CameleerContents';
import {
	RecommendCategory,
	RecommendCategoryItems,
} from '@/components/pc/domain/category/CameleerContents/_legacy/RecommendCategory/RecommendCategoriesSection/RecommendCategoryItems';

type Props = {
	title: string;
	categoryList: RecommendCategory[];
	onClick: (itemCode: string, position: number) => void;
	onLoadImage: (itemCode: string, position: number) => void;
};

/** Recommend categories section */
export const RecommendCategoriesSection: React.VFC<Props> = ({
	title,
	categoryList,
	onClick,
	onLoadImage,
}) => {
	return (
		<CameleerContents title={title} className={styles.section}>
			<RecommendCategoryItems
				categoryList={categoryList}
				onClick={onClick}
				onLoadImage={onLoadImage}
			/>
		</CameleerContents>
	);
};

RecommendCategoriesSection.displayName = 'RecommendCategoriesSection';
