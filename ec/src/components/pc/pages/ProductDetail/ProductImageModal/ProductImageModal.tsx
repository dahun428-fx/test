import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductImageModal.module.scss';
import { ProductImage as ProductImageView } from '@/components/pc/ui/images/ProductImage';
import { Modal } from '@/components/pc/ui/modals';
import { ProductImage } from '@/models/api/msm/ect/series/shared';

type Props = {
	seriesName: string;
	productImageList: ProductImage[];
	clickedIndex: number;
	partNumber?: string;
};

/**
 * Product image modal.
 */
export const ProductImageModal: React.VFC<Props> = ({
	seriesName,
	productImageList,
	clickedIndex,
	partNumber,
}) => {
	const [t] = useTranslation();
	const [selectedIndex, setSelectedIndex] = useState(clickedIndex);

	const title = `${seriesName}${
		partNumber
			? t('pages.productDetail.productImageModal.partNumberLabel', {
					partNumber,
			  })
			: ''
	}`;

	useEffect(() => {
		setSelectedIndex(clickedIndex);
	}, [clickedIndex]);

	return (
		<Modal>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2
						className={styles.headerTitle}
						dangerouslySetInnerHTML={{ __html: title }}
					/>
				</div>
				<div className={styles.body}>
					<div className={styles.mainImageBox}>
						<div className={styles.mainImageContent}>
							{productImageList.length > 1 && (
								<a
									className={classNames(styles.arrow, styles.previousArrow)}
									onClick={() =>
										setSelectedIndex(
											selectedIndex > 0
												? selectedIndex - 1
												: productImageList.length - 1
										)
									}
								>
									{t('pages.productDetail.productImageModal.previous')}
								</a>
							)}

							<div className={styles.imageWrapper}>
								<ProductImageView
									imageUrl={productImageList[selectedIndex]?.url}
									preset="t_popover_main"
									className={styles.mainImage}
								/>
							</div>

							{productImageList.length > 1 && (
								<a
									className={classNames(styles.arrow, styles.nextArrow)}
									onClick={() =>
										setSelectedIndex(
											selectedIndex === productImageList.length - 1
												? 0
												: selectedIndex + 1
										)
									}
								>
									{t('pages.productDetail.productImageModal.next')}
								</a>
							)}
						</div>
						<div className={styles.comment}>
							{productImageList[selectedIndex]?.comment}
						</div>
					</div>
					<div className={styles.imageList}>
						{productImageList.map((image, index) => (
							<div
								key={index}
								onClick={() => setSelectedIndex(index)}
								className={classNames(styles.thumbnail, {
									[String(styles.selectedThumbnail)]: index === selectedIndex,
								})}
							>
								<ProductImageView
									imageUrl={image.url}
									size={50}
									preset="t_popover_thum"
									className={styles.image}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</Modal>
	);
};
ProductImageModal.displayName = 'ProductImageModal';
