import React, { useRef } from 'react';
import styles from './MainProductImage.module.scss';
import { ProductImage as SimpleProductImage } from '@/components/mobile/ui/images/ProductImage';
import { ProductImage } from '@/models/api/msm/ect/series/shared';

type Props = {
	seriesName: string;
	mainImage: ProductImage;
};

/**
 * Main product image.
 */
export const MainProductImage: React.VFC<Props> = ({
	seriesName,
	mainImage,
}) => {
	// node refs
	const imageRef = useRef<HTMLImageElement>(null);

	return (
		<div className={styles.container}>
			<a href="#" className={styles.image} onClick={e => e.preventDefault()}>
				<SimpleProductImage
					imageUrl={mainImage.url}
					comment={mainImage.comment ?? seriesName}
					preset="t_product_main"
					size={195}
					ref={imageRef}
				/>
			</a>
		</div>
	);
};
MainProductImage.displayName = 'MainProductImage';
