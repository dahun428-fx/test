import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { BannerList } from './BannerList';
import { BulletNav } from './BulletNav';
import { Pager } from './Pager';
import styles from './TopBanner.module.scss';
import { Banner } from '@/models/api/cms/home/GetTopBannerResponse';
import { sleep } from '@/utils/timer';

const ROTATION_INTERVAL = 4000;

type BannerSize = 'small' | 'larger';

type Props = {
	bannerList: Banner[];
};

/**
 * ローテーションバナー
 */
export const TopBanner: React.VFC<Props> = ({ bannerList }) => {
	const [cursor, setCursor] = useState(0);
	// small or larger
	const [bannerSize, setBannerSize] = useState<BannerSize>('larger');
	const [bannerWidth, setBannerWidth] = useState(1120);
	// resizing or else
	// NOTE: On resize, change container's margin-left.
	//       It happens banner transition, so stop its transition.
	const [resizing, setResizing] = useState<boolean>(false);
	const intervalIdRef = useRef<number>();
	const containerRef = useRef<HTMLDivElement>(null);

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

	const handleClickPager = useCallback(
		(prevOrNext: 'prev' | 'next') => {
			setCursor(current => {
				if (prevOrNext === 'prev') {
					const next = current - 1;
					return next < 0 ? bannerList.length - 1 : next;
				}
				const next = current + 1;
				return next > bannerList.length - 1 ? 0 : next;
			});
			startToRotate();
		},
		[bannerList.length, startToRotate]
	);

	useEffect(() => {
		if (containerRef.current) {
			const observer = new ResizeObserver(([entry]) => {
				if (entry) {
					const containerWidth = entry.contentRect.width;
					const bannerSize = containerWidth <= 950 ? 'small' : 'larger';
					setResizing(true);
					setBannerSize(bannerSize);
					setBannerWidth(
						bannerSize === 'small' ? containerWidth : containerWidth - 280
					);
				}
			});

			observer.observe(containerRef.current);
			return () => observer.disconnect();
		}
	}, []);

	useEffect(() => {
		// https://developer.mozilla.org/ja/docs/Web/API/Document/readyState
		if (document.readyState === 'complete') {
			// 既に load 済みなら client side 遷移の可能性が高い。直ちに rotation を開始する。
			startToRotate();
			return endRotating;
		} else {
			// NEW_FE-3706 CLS 改善のため、load が発火するまで rotation を開始しない。
			window.addEventListener('load', startToRotate);
			return () => {
				window.removeEventListener('load', startToRotate);
				endRotating();
			};
		}
	}, [endRotating, startToRotate]);

	useEffect(() => {
		if (resizing) {
			// NOTE: 500ms はリサイズしまくったときにバナーが揺れない程度の適当な値
			sleep(500).then(() => setResizing(false));
		}
	}, [resizing]);

	return (
		<div>
			<div
				className={styles.bannerListContainer}
				ref={containerRef}
				onMouseEnter={endRotating}
				{...(document.readyState === 'complete' && {
					onMouseLeave: startToRotate,
				})}
			>
				<BannerList
					bannerList={bannerList}
					bannerWidth={bannerWidth}
					bannerSize={bannerSize}
					cursor={cursor}
					className={classNames(styles.bannerList, {
						[String(styles.stopTransition)]: resizing,
					})}
				/>
				{bannerSize === 'larger' && (
					<Pager onClick={handleClickPager} className={styles.pagerContainer} />
				)}
			</div>
			<BulletNav
				cursor={cursor}
				bannerCount={bannerList.length}
				onClick={handleClickBullet}
			/>
		</div>
	);
};
