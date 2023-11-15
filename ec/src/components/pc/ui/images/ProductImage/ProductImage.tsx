import React, { forwardRef, useMemo } from 'react';
import styles from './ProductImage.module.scss';
import { convertImageUrl } from '@/utils/domain/image';
import { removeTags } from '@/utils/string';

export type Props = {
	/** 画像のURL */
	imageUrl?: string;
	/** preset */
	preset?: string;
	/** 画像の説明文 */
	comment?: string;
	/** 画像のサイズ */
	size?: number;
	/** スタイル */
	className?: string;
	/** style */
	style?: React.CSSProperties;
	/** onLoad */
	onLoad?: () => void;
};

/**
 * Product Image
 */
export const ProductImage = forwardRef<HTMLImageElement, Props>(
	({ imageUrl, preset, comment, size, className, style, onLoad }, ref) => {
		const url = preset ? convertImageUrl(imageUrl, preset) : imageUrl;

		const imageStyle = useMemo(() => {
			if (typeof size === 'number') {
				return { width: size, height: size, ...style };
			}
			return undefined;
		}, [size, style]);

		return url ? (
			<img // eslint-disable-line @next/next/no-img-element
				ref={ref}
				src={url}
				alt={removeTags(comment ?? '')}
				className={className}
				style={imageStyle}
				onLoad={onLoad}
			/>
		) : (
			<div className={styles.noImage} style={imageStyle} />
		);
	}
);
ProductImage.displayName = 'ProductImage';
