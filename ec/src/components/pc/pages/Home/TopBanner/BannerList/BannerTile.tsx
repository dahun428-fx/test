import React, { memo } from 'react';
import styles from './BannerTile.module.scss';
import { Flag } from '@/models/api/Flag';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';

type Props = {
	banner: Banner;
	width: number;
};

export const BannerTile = memo<Props>(({ banner, width }) => {
	return (
		<li className={styles.bannerItem} style={{ width }}>
			<a
				href={banner.url}
				className={styles.bannerLink}
				style={{ backgroundImage: `url(${banner.imageUrl})` }}
				target={Flag.isTrue(banner.targetBlankFlag) ? '_blank' : undefined}
				rel="noreferrer"
			/>
		</li>
	);
});
BannerTile.displayName = 'BannerTile';
