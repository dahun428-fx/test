import React, { forwardRef, useMemo } from 'react';
import styles from './ProductImage.module.scss';
import { convertImageUrl } from '@/utils/domain/image';
import { removeTags } from '@/utils/string';

export type Props = {
	/** Image URL */
	imageUrl?: string;
	/** Preset */
	preset?: string;
	/** Image description */
	comment?: string;
	/** Image size */
	size?: number;
	/** Class name */
	className?: string;
	/** Style */
	style?: React.CSSProperties;
	loading?: 'lazy' | 'eager';
	/** onLoad */
	onLoad?: () => void;
};

/**
 * Product Image
 */
export const ProductImage = forwardRef<HTMLImageElement, Props>(
	(
		{ imageUrl, preset, comment, size, className, style, loading, onLoad },
		ref
	) => {
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
				loading={loading}
				style={imageStyle}
				onLoad={onLoad}
			/>
		) : (
			<div className={styles.noImage} style={imageStyle} />
		);
	}
);
ProductImage.displayName = 'ProductImage';
