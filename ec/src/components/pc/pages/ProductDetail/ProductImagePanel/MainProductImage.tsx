import classNames from 'classnames';
import React, { MouseEvent, useRef, useState } from 'react';
import styles from './MainProductImage.module.scss';
import { ProductImage as SimpleProductImage } from '@/components/pc/ui/images/ProductImage';
import { useBoolState } from '@/hooks/state/useBoolState';
import { ProductImage } from '@/models/api/msm/ect/series/shared';

type Props = {
	seriesName: string;
	mainImage: ProductImage;
	zoomable: boolean;
	className?: string;
};

type ZoomImageStyle = Pick<React.CSSProperties, 'top' | 'left'>;

/**
 * Main product image.
 */
export const MainProductImage: React.VFC<Props> = ({
	seriesName,
	mainImage,
	zoomable,
	className,
}) => {
	const [showsZoomImage, showImage, hideImage] = useBoolState(false);
	const [zoomImageStyle, setZoomImageStyle] = useState<ZoomImageStyle>({});
	const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>();

	// node refs
	const imageRef = useRef<HTMLImageElement>(null);
	const zoomImageRef = useRef<HTMLImageElement>(null);
	const viewerRef = useRef<HTMLDivElement>(null);

	const zoomImage = (event: MouseEvent) => {
		showImage();

		if (imageRef.current && viewerRef.current && zoomImageRef.current) {
			// メインの商品イメージ
			const mainImageRect = imageRef.current.getBoundingClientRect();

			// 拡大した商品イメージ
			const zoomImageRect = zoomImageRef.current.getBoundingClientRect();

			// 拡大イメージのビューア
			const viewerRect = viewerRef.current.getBoundingClientRect();

			// ビューアに対する拡大イメージの比率
			const zoomImageRatioWidth = viewerRect.width / (zoomImageRect.width || 1);
			const zoomImageRatioHeight =
				viewerRect.height / (zoomImageRect.height || 1);

			// インジケータのサイズを計算（拡大画像の表示範囲）
			const indicatorWidth = mainImageRect.width * zoomImageRatioWidth;
			const indicatorHeight = mainImageRect.height * zoomImageRatioHeight;

			// インジケータの位置を計算()
			const indicatorLeft =
				Math.min(
					Math.max(
						event.pageX -
							(mainImageRect.left + (window.scrollX ?? window.pageXOffset)) + // NOTE: pageXOffset is for IE
							1, // マウスカーソルを中心にインジケータを配置した場合の画像の左端からインジケータの左端までの距離
						indicatorWidth / 2 // インジケータの半分の幅
					),
					mainImageRect.width - indicatorWidth / 2 // 商品画像幅 - インジケータの半分の幅(謎？)
				) -
				indicatorWidth / 2;
			const indicatorTop =
				Math.min(
					Math.max(
						event.pageY -
							(mainImageRect.top + (window.scrollY ?? window.pageYOffset)) + // NOTE: pageYOffset is for IE
							1,
						indicatorHeight / 2
					),
					mainImageRect.height - indicatorHeight / 2
				) -
				indicatorHeight / 2;

			// 改題画像の表示位置(%)
			const zoomPositionRatioX =
				indicatorLeft / (mainImageRect.width - indicatorWidth);
			const zoomPositionRatioY =
				indicatorTop / (mainImageRect.height - indicatorHeight);

			// 改題画像の表示位置(px)
			const zoomPositionX =
				zoomPositionRatioX * (zoomImageRect.width - viewerRect.width);
			const zoomPositionY =
				zoomPositionRatioY * (zoomImageRect.height - viewerRect.height);

			setZoomImageStyle({
				top: -zoomPositionY,
				left: -zoomPositionX,
			});

			setIndicatorStyle({
				width: indicatorWidth,
				height: indicatorHeight,
				left: indicatorLeft,
				top: indicatorTop,
			});
		}
	};
	return (
		<div
			className={classNames(styles.image, className)}
			onMouseMove={zoomImage}
			onMouseLeave={hideImage}
		>
			<SimpleProductImage
				imageUrl={mainImage.url}
				comment={mainImage.comment ?? seriesName}
				preset="t_product_main"
				size={250}
				ref={imageRef}
			/>
			{zoomable && (
				<>
					<div
						className={styles.zoomIndicator}
						style={indicatorStyle}
						aria-hidden={!showsZoomImage}
					/>
					<div
						className={styles.zoomViewer}
						aria-hidden={!showsZoomImage}
						ref={viewerRef}
					>
						<SimpleProductImage
							imageUrl={mainImage.url}
							preset="t_product_zoom_a"
							size={2000}
							ref={zoomImageRef}
							comment={seriesName}
							className={styles.zoomImage}
							style={{ ...zoomImageStyle, width: 2000, height: 2000 }}
						/>
					</div>
				</>
			)}
		</div>
	);
};
MainProductImage.displayName = 'MainProductImage';
