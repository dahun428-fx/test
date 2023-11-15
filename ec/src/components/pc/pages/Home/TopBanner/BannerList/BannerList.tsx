import classNames from 'classnames';
import React, { memo } from 'react';
import styles from './BannerList.module.scss';
import { BannerTile } from './BannerTile';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';

type Props = {
	bannerList: Banner[];
	bannerWidth: number;
	bannerSize: 'small' | 'larger';
	cursor: number;
	className?: string;
};

export const BannerList = memo<Props>(
	({ bannerList, bannerWidth, bannerSize, cursor, className }) => {
		if (bannerList.length < 1) {
			return null;
		}

		/**
		 * banner count
		 * NOTE: if bannerSize is 'small', disappear first-child and last-child in banner list
		 */
		const bannerCount =
			bannerSize === 'small' ? bannerList.length : bannerList.length + 2;

		const firstBanner = bannerList[0];
		const lastBanner = bannerList[bannerList.length - 1];

		if (!firstBanner || !lastBanner) {
			return null;
		}

		return (
			<ul
				style={{
					width: bannerWidth * bannerCount,
					transform: `translateX(-${bannerWidth * cursor}px)`,
				}}
				className={classNames(className, styles.container)}
				data-banner-size={bannerSize}
			>
				{bannerSize === 'larger' && (
					<BannerTile banner={lastBanner} width={bannerWidth} />
				)}
				{bannerList.map((banner, index) => (
					<BannerTile key={index} banner={banner} width={bannerWidth} />
				))}
				{bannerSize === 'larger' && (
					<BannerTile banner={firstBanner} width={bannerWidth} />
				)}
			</ul>
		);
	}
);
BannerList.displayName = 'BannerList';
