import { VFC } from 'react';
import styles from './RecentlyViewedItems.module.scss';
import { RecentlyViewedItem } from '@/components/mobile/pages/Home/RecentlyViewedItem/RecentlyViewedItem';
import { SectionHeading } from '@/components/mobile/ui/headings';

export type Item = {
	imageUrl?: string;
	title: string;
	url: string;
	categoryCode: string;
	position?: number;
};

type Props = {
	title: string;
	items: Item[];
	onClickItem: (categoryCode: string, position?: number) => void;
	onLoadImage: (categoryCode: string, position?: number) => void;
};

/**
 * Recently Viewed Categories
 */
export const RecentlyViewedItems: VFC<Props> = ({
	items,
	title,
	onClickItem,
	onLoadImage,
}) => {
	return (
		<div className={styles.container}>
			<SectionHeading>{title}</SectionHeading>
			<div className={styles.scrollWrapper}>
				<ul className={styles.list}>
					{items.map((item, index) => (
						<RecentlyViewedItem
							key={`${item.title}-${index}`}
							title={item.title}
							imageUrl={item.imageUrl || ''}
							url={item.url}
							categoryCode={item.categoryCode}
							position={item.position}
							onClickItem={onClickItem}
							onLoadImage={onLoadImage}
						/>
					))}
				</ul>
			</div>
		</div>
	);
};
RecentlyViewedItems.displayName = 'RecentlyViewedItems';
