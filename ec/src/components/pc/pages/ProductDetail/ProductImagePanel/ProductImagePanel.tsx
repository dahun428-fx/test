import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductImageList } from './ProductImageList/ProductImageList';
import styles from './ProductImagePanel.module.scss';
import { useApiCancellation } from '@/api/clients/cancel/useApiCancellation';
import { getImageSize } from '@/api/services/cloudinary/getImageSize';
import { ProductImageModal } from '@/components/pc/pages/ProductDetail/ProductImageModal';
import { MainProductImage } from '@/components/pc/pages/ProductDetail/ProductImagePanel/MainProductImage';
import { ProductImage as SimpleProductImage } from '@/components/pc/ui/images/ProductImage';
import { ModalOpener, ModalProvider } from '@/components/pc/ui/modals';
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
 * - 2022/4/18 現在、実際にはすべての商品画像が Cloudinary にある筈ですが、マレーシアの stg0 はバグっており、
 *   いまだに DAM に画像が置かれており、デモや検証が不可能になるためこの判定を入れています。
 *   マレーシアの検証環境のすべてで Cloudinary 移行が完了すれば、この判定は不要です。
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
	// main image is on Cloudinary
	// - メイン画像は Cloudinary にホスティングされている画像か
	// - Cloudinary 以外にも S3 にホスティングされている商品画像も存在するために判定
	const mainImageIsOnCloudinary = isCloudinaryImage(mainImage?.url);

	// NOTE: 2022/4/18 現在の既存システムで、「1枚目の画像が拡大可能でなければサムネイルリストも出さないし
	//       hover で拡大表示もしないし拡大モーダルも出さない」という制御が入っているため、踏襲しています。
	//       mainImage.type を見ない意味が分からなさすぎる。
	const zoomable =
		firstImage?.type === ImageType.Zoomable &&
		(mainImageIsOnCloudinary ? (zoomImageLongSide ?? 0) >= 1000 : false);
	const openable =
		firstImage?.type === ImageType.Zoomable &&
		(mainImageIsOnCloudinary ? (zoomImageLongSide ?? 0) >= 250 : true);

	useEffect(() => {
		if (zoomImageLongSide === undefined) {
			const mainImage = productImageList[cursor];
			if (mainImage) {
				if (isCloudinaryImage(mainImage.url)) {
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
							if (error instanceof ApiCancelError) {
								return;
							}
							// TODO: handle error
						});
				}
			}
		}
	}, [cursor, productImageList, token, zoomImageLongSide, zoomable]);

	if (mainImage == null) {
		return <SimpleProductImage size={250} />;
	}

	return (
		<ModalProvider>
			<div>
				<ModalOpener disabled={!openable}>
					<MainProductImage
						className={classNames({
							[String(styles.cursorPointer)]: zoomable || openable,
						})}
						seriesName={seriesName}
						mainImage={mainImage}
						zoomable={zoomable}
					/>
				</ModalOpener>
				{zoomable ? (
					<p className={styles.caption}>
						{t('pages.productDetail.productImagePanel.mouseOverCaption')}
					</p>
				) : (
					openable && (
						<p className={styles.caption}>
							{t('pages.productDetail.productImagePanel.clickCaption')}
						</p>
					)
				)}
				{firstImage?.type === ImageType.Zoomable &&
					productImageList.length > 1 && (
						<ProductImageList
							productImageList={productImageList}
							switchMainImage={setCursor}
							cursor={cursor}
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
