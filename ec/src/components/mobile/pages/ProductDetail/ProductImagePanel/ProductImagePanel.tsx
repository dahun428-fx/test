import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductImagePanel.module.scss';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { getImageSize } from '@/api/services/cloudinary/getImageSize';
import { MainProductImage } from '@/components/mobile/pages/ProductDetail/ProductImagePanel/MainProductImage';
import { ProductImageList } from '@/components/mobile/pages/ProductDetail/ProductImagePanel/ProductImageList';
import { ProductImageModal } from '@/components/mobile/pages/ProductDetail/ProductImagesModal';
import { ProductImage as SimpleProductImage } from '@/components/mobile/ui/images/ProductImage';
import { ProductImagePreloader } from '@/components/mobile/ui/images/ProductImage/ProductImagePreloader';
import { ModalOpener, ModalProvider } from '@/components/mobile/ui/modals';
import { config } from '@/config';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import ImageType from '@/models/api/constants/ImageType';
import { ProductImage } from '@/models/api/msm/ect/series/shared';

export type Props = {
	seriesName: string;
	productImageList: ProductImage[];
	partNumber?: string;
};

/**
 * The image is hosted on Cloudinary or not
 * - NOTE: If all the image content
 * 		   in "stg0" environment becomes "cloudinary",
 *         it will no longer be necessary.
 */
function isCloudinaryImage(url?: string) {
	return url
		? url?.indexOf(config.cdn.domain.cloudinary.global) >= 0 ||
				url?.indexOf(config.cdn.domain.cloudinary.china) >= 0
		: false;
}

/**
 * Product Image
 */
const ProductImagePanel: React.VFC<Props> = ({
	seriesName,
	productImageList,
	partNumber,
}) => {
	// hovered list index
	const [cursor, setCursor] = useState(0);

	const { t } = useTranslation();

	// zoomable map
	const [zoomImageLongSideCache, setZoomImageLongSideCache] = useState<
		Record<number, number | undefined>
	>({});

	const { token } = useApiCancellation();

	// first image
	const firstImage = productImageList[0];
	// main image
	const mainImage = productImageList[cursor];
	// zoom image long side
	const zoomImageLongSide = zoomImageLongSideCache[cursor];

	const firstImageIsZoomable = firstImage?.type === ImageType.Zoomable;

	// main image is on Cloudinary
	const mainImageIsOnCloudinary = isCloudinaryImage(mainImage?.url);

	const hasMultiImages = productImageList.length > 1;

	const modalOpenable = mainImageIsOnCloudinary
		? zoomImageLongSide ?? 0 >= 195
		: true;

	useEffect(() => {
		if (
			zoomImageLongSide === undefined &&
			mainImageIsOnCloudinary &&
			mainImage
		) {
			// NOTE: Added this to avoid set state when unmounted error
			getImageSize({ imageUrl: mainImage.url }, token)
				.then(response => {
					const size =
						response.output.width > response.output.height
							? response.output.width
							: response.output.height;
					setZoomImageLongSideCache(prev => ({ ...prev, [cursor]: size }));
				})
				.catch(error => {
					// NOTE: Errors are accidental or dependent on the content of the submission.
					//       Correct handling by API error response is not expected.
					//       The only effect on the user is that images that could have been displayed modally are not displayed.
					if (error instanceof ApiCancelError) {
						return;
					}
				});
		}
	}, [
		cursor,
		mainImage,
		mainImageIsOnCloudinary,
		productImageList,
		token,
		zoomImageLongSide,
	]);

	if (mainImage == null) {
		return <SimpleProductImage size={195} />;
	}

	return (
		<ModalProvider>
			<div className={styles.productImage}>
				<ProductImagePreloader url={firstImage?.url} preset="t_product_main" />
				<div className={hasMultiImages ? styles.mainImage : styles.singleImage}>
					<ModalOpener disabled={!modalOpenable}>
						<MainProductImage seriesName={seriesName} mainImage={mainImage} />
					</ModalOpener>
					<p className={styles.caption}>
						{modalOpenable &&
							firstImageIsZoomable &&
							t('mobile.pages.productDetail.productImagePanel.tapCaption')}
					</p>
				</div>
				{hasMultiImages && firstImageIsZoomable && (
					<ProductImageList
						productImageList={productImageList}
						clickedIndex={cursor}
						switchMainImage={setCursor}
					/>
				)}
			</div>
			<ProductImageModal
				seriesName={seriesName}
				productImageList={productImageList}
				clickedIndex={cursor}
				partNumber={partNumber}
			/>
		</ModalProvider>
	);
};
ProductImagePanel.displayName = 'ProductImagePanel';
export { ProductImagePanel };
