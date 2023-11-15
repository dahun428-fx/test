import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BannerList } from './BannerList';
import { BulletNav } from './BulletNav';
import styles from './TopBanner.module.scss';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';

const ROTATION_INTERVAL = 4500;

type Props = {
	bannerList: Banner[];
};

/** Top banner component */
export const TopBanner: React.VFC<Props> = ({ bannerList }) => {
	const [cursor, setCursor] = useState(0);
	const intervalIdRef = useRef<number>();

	const endRotating = useCallback(() => {
		if (intervalIdRef.current) {
			window.clearInterval(intervalIdRef.current);
			intervalIdRef.current = undefined;
		}
	}, []);

	const startToRotate = useCallback(() => {
		if (bannerList.length) {
			endRotating();
			intervalIdRef.current = window.setInterval(() => {
				setCursor(prev => (prev + 1 < bannerList.length ? prev + 1 : 0));
			}, ROTATION_INTERVAL);
		}
	}, [bannerList.length, endRotating]);

	const handleClickBullet = useCallback(
		(index: number) => {
			setCursor(index);
			startToRotate();
		},
		[startToRotate]
	);

	useEffect(() => {
		const activateRotation = () => {
			startToRotate();
			// NOTE: 初回のみ有効化
			window.removeEventListener('touchstart', activateRotation);
			window.removeEventListener('scroll', activateRotation);
		};

		// NOTE: ユーザーアクションにより、ローテーションを有効化する
		window.addEventListener('touchstart', activateRotation);
		window.addEventListener('scroll', activateRotation);
		return () => {
			window.removeEventListener('touchstart', activateRotation);
			window.removeEventListener('scroll', activateRotation);
			endRotating();
		};
	}, [endRotating, startToRotate]);

	if (bannerList.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			<div className={styles.bannerListContainer}>
				<BannerList bannerList={bannerList} cursor={cursor} />
			</div>
			<BulletNav
				cursor={cursor}
				bannerCount={bannerList.length}
				onClick={handleClickBullet}
			/>
		</div>
	);
};
TopBanner.displayName = 'TopBanner';
