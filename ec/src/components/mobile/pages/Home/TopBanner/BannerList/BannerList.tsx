import classNames from 'classnames';
import React, { memo } from 'react';
import styles from './BannerList.module.scss';
import { BannerTile } from './BannerTile';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';

type Props = {
	bannerList: Banner[];
	cursor: number;
	className?: string;
};

/** Banner list component */
export const BannerList = memo<Props>(({ bannerList, cursor, className }) => {
	return (
		<ul
			style={{
				width: `${100 * bannerList.length}%`,
				marginLeft: `${-100 * cursor}%`,
			}}
			className={classNames(className, styles.container)}
		>
			{bannerList.map((banner, index) => (
				<li key={index} style={{ width: `calc(100% / ${bannerList.length})` }}>
					<BannerTile
						banner={banner}
						priority={index === 0}
						alt={`Banner ${index}`}
					/>
				</li>
			))}
		</ul>
	);
});
BannerList.displayName = 'BannerList';
