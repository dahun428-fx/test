import NextLink from 'next/link';
import { VFC } from 'react';
import styles from './RecentlyViewItem.module.scss';
import { ProductImage } from '@/components/mobile/ui/images/ProductImage';

type Props = {
	url: string;
	imageUrl: string;
	title: string;
	categoryCode: string;
	position?: number;
	onClickItem: (categoryCode: string, position?: number) => void;
	onLoadImage: (categoryCode: string, position?: number) => void;
};

/**
 * Recently Viewed Item
 */
export const RecentlyViewedItem: VFC<Props> = ({
	url,
	imageUrl,
	title,
	categoryCode,
	position,
	onClickItem,
	onLoadImage,
}) => {
	return (
		<li className={styles.listItem}>
			<div>
				<NextLink href={url}>
					<a
						className={styles.link}
						onClick={() => onClickItem(categoryCode, position)}
					>
						<span className={styles.imageWrapper}>
							<ProductImage
								imageUrl={imageUrl}
								comment={title}
								size={100}
								onLoad={() => onLoadImage(categoryCode, position)}
							/>
						</span>
						<span className={styles.categoryName}>{title}</span>
					</a>
				</NextLink>
			</div>
		</li>
	);
};
RecentlyViewedItem.displayName = 'RecentlyViewedItem';
