import React, { VFC } from 'react';
import styles from './BannerTile.module.scss';
import { ImagePreloader } from '@/components/mobile/ui/images/ImagePreloader';
import { Flag } from '@/models/api/Flag';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';

type Props = {
	banner: Banner;
	priority?: boolean;
	alt?: string;
};

export const BannerTile: VFC<Props> = ({ banner, priority, alt }) => {
	return (
		<a
			href={banner.url}
			className={styles.bannerLink}
			target={Flag.isTrue(banner.targetBlankFlag) ? '_blank' : undefined}
			rel="noreferrer"
		>
			{priority && <ImagePreloader href={banner.imageUrl} />}
			{/* NOTE: 外部リソースを参照する場合は、next/image を用いないこととなっています。 */}
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={banner.imageUrl} className={styles.image} alt={alt} />
		</a>
	);
};
BannerTile.displayName = 'BannerTile';
