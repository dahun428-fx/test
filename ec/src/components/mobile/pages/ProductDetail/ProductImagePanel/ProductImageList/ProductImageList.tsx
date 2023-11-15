import React from 'react';
import styles from './ProductImageList.module.scss';
import { ProductImage as ProductImageComponent } from '@/components/mobile/ui/images/ProductImage';
import { ProductImage } from '@/models/api/msm/ect/series/shared';
type Props = {
	productImageList: ProductImage[];
	clickedIndex: number;
	switchMainImage: (index: number) => void;
};

/**
 * product image (thumbnail) list
 */
export const ProductImageList: React.VFC<Props> = ({
	productImageList,
	clickedIndex,
	switchMainImage,
}) => {
	return (
		<div className={styles.container}>
			<ul className={styles.imageList}>
				{productImageList.map((productImage, index) => (
					<li
						key={index}
						className={styles.thumbnail}
						data-selected={index === clickedIndex}
						onClick={() => switchMainImage(index)}
					>
						<ProductImageComponent
							imageUrl={productImage.url}
							size={38}
							className={styles.image}
							preset="t_product_thum"
						/>
					</li>
				))}
			</ul>
		</div>
	);
};
ProductImageList.displayName = 'ProductImageList';
