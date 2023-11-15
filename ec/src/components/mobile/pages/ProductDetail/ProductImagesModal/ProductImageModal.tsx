import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductImageModal.module.scss';
import { Button } from '@/components/mobile/ui/buttons';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';
import { Modal, ModalCloser } from '@/components/mobile/ui/modals';
import { ProductImage as ProductImageType } from '@/models/api/msm/ect/series/shared';

type Props = {
	seriesName: string;
	productImageList?: ProductImageType[];
	clickedIndex: number;
	partNumber?: string;
};

export const ProductImageModal: React.VFC<Props> = ({
	seriesName,
	productImageList,
	clickedIndex,
	partNumber,
}) => {
	const [t] = useTranslation();
	const [selectedIndex, setSelectedIndex] = useState(clickedIndex);

	const titleText = useMemo(() => {
		const partNumberLabel = partNumber
			? t('mobile.pages.productDetail.productImageModal.partNumberLabel', {
					partNumber,
			  })
			: '';
		return `${seriesName}${partNumberLabel}`;
	}, [partNumber, seriesName, t]);

	useEffect(() => {
		setSelectedIndex(clickedIndex);
	}, [clickedIndex]);

	return (
		<Modal>
			<div className={styles.modalWrapper}>
				<div className={styles.header}>
					<h2
						className={styles.headerTitle}
						dangerouslySetInnerHTML={{ __html: titleText }}
					/>
					<ModalCloser>
						<a className={styles.closeButton}>
							{t('mobile.pages.productDetail.productImageModal.close')}
						</a>
					</ModalCloser>
				</div>
				{productImageList?.length && (
					<div className={styles.imageWrapper}>
						<ProductImage
							imageUrl={productImageList[selectedIndex]?.url}
							preset="t_popover_main"
							className={styles.imageContent}
						/>
					</div>
				)}
				<div>
					<h2
						className={styles.subtitle}
						dangerouslySetInnerHTML={{ __html: titleText }}
					/>
					{productImageList && (
						<ul className={styles.imageList}>
							{productImageList?.map((image, index) => (
								<li
									key={index}
									onClick={() => setSelectedIndex(index)}
									className={classNames(styles.thumbnail, {
										[String(styles.selectedThumbnail)]: index === selectedIndex,
									})}
								>
									<ProductImage
										imageUrl={image.url}
										size={48}
										preset="t_product_thum"
										className={styles.image}
									/>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
			{/* prevボタン */}
			{productImageList && productImageList.length > 1 && (
				<Button
					icon="left-arrow"
					className={styles.previousIndex}
					onClick={() =>
						setSelectedIndex(
							selectedIndex > 0
								? selectedIndex - 1
								: productImageList.length - 1
						)
					}
				>
					{t('mobile.pages.productDetail.productImageModal.previous')}
				</Button>
			)}
			{/* nextボタン */}
			{productImageList && productImageList.length > 1 && (
				<Button
					icon="right-arrow"
					className={styles.nextIndex}
					onClick={() =>
						setSelectedIndex(
							selectedIndex === productImageList.length - 1
								? 0
								: selectedIndex + 1
						)
					}
				>
					{t('mobile.pages.productDetail.productImageModal.next')}
				</Button>
			)}
		</Modal>
	);
};
