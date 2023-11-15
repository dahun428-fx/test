import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductImageList.module.scss';
import { ProductImage as ProductImageComponent } from '@/components/pc/ui/images/ProductImage';
import { ModalOpener } from '@/components/pc/ui/modals';
import { ProductImage } from '@/models/api/msm/ect/series/shared';

type Props = {
	productImageList: ProductImage[];
	cursor: number;
	switchMainImage: (index: number) => void;
};

// NOTE: PAGE_SIZE が変わったら、styles.imageList の高さも調整が必要
const PAGE_SIZE = 3;

/**
 * product image (thumbnail) list
 */
export const ProductImageList: React.VFC<Props> = ({
	productImageList,
	cursor,
	switchMainImage,
}) => {
	const [page, setPage] = useState(1);
	const maxPage = Math.ceil(productImageList.length / PAGE_SIZE);
	const [t] = useTranslation();

	const handleClickPrevious = () => {
		const previousPage = page === 1 ? maxPage : page - 1;
		setPage(previousPage);
		switchMainImage((previousPage - 1) * PAGE_SIZE);
	};

	const handleClickNext = () => {
		const nextPage = page === maxPage ? 1 : page + 1;
		setPage(nextPage);
		switchMainImage((nextPage - 1) * PAGE_SIZE);
	};

	const isThumbnailHidden = (index: number) => {
		const from = (page - 1) * PAGE_SIZE;
		const to = page * PAGE_SIZE - 1;
		return index < from || index > to;
	};

	return (
		<div className={styles.container}>
			<ul className={styles.imageList}>
				{maxPage > 1 ? (
					<li
						className={styles.arrowContainerLeft}
						onClick={handleClickPrevious}
					>
						<a className={classNames(styles.arrow, styles.previousArrow)}>
							{t(
								'pages.productDetail.productImagePanel.productImageList.previous'
							)}
						</a>
					</li>
				) : (
					<li className={styles.arrowContainerLeft} />
				)}
				{productImageList.map((productImage, index) => (
					<ModalOpener key={index}>
						<li
							onMouseEnter={() => switchMainImage(index)}
							className={classNames(styles.thumbnail, {
								[String(styles.hiddenThumbnail)]: isThumbnailHidden(index),
								[String(styles.activeThumbnail)]: index === cursor,
								[String(styles.firstThumbnail)]:
									index === 0 || index % PAGE_SIZE === 0,
							})}
						>
							<ProductImageComponent
								imageUrl={productImage.url}
								size={48}
								className={styles.image}
								preset="t_product_thum"
								comment={productImage.comment}
							/>
						</li>
					</ModalOpener>
				))}
				{maxPage > 1 ? (
					<li className={styles.arrowContainerRight} onClick={handleClickNext}>
						<a className={classNames(styles.arrow, styles.nextArrow)}>
							{t('pages.productDetail.productImagePanel.productImageList.next')}
						</a>
					</li>
				) : (
					<li className={styles.arrowContainerRight} />
				)}
			</ul>
		</div>
	);
};
ProductImageList.displayName = 'ProductImageList';
