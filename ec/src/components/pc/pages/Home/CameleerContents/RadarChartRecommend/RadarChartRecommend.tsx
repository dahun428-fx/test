import Router from 'next/router';
import { RefCallback, useCallback, useEffect, useState } from 'react';
import styles from './RadarChartRecommend.module.scss';
import { CameleerContents } from '@/components/pc/pages/Home/CameleerContents';
import { Link } from '@/components/pc/ui/links';
import { usePage } from '@/hooks/state/usePage';
import { cameleer } from '@/logs/cameleer';
import {
	GetRadarChartRecommendResponse,
	RecommendItem,
} from '@/models/api/cameleer/radarChartRecommend/GetRadarChartRecommendResponse';
import { trimUrlDomain } from '@/utils/cameleer';
import { getHeight } from '@/utils/dom';
import { removeTags } from '@/utils/string';
import { getWindowSize, WindowSize } from '@/utils/window';

type Props = {
	radarChartRecommend: GetRadarChartRecommendResponse;
};

function getPageSize() {
	const windowSize = getWindowSize();
	switch (windowSize) {
		case WindowSize.LARGE:
			return 6;
		case WindowSize.MEDIUM:
			return 5;
		default:
			return 4;
	}
}

export const RadarChartRecommend: React.VFC<Props> = ({
	radarChartRecommend,
}) => {
	const [minHeight, setMinHeight] = useState<number>();

	const {
		listPerPage: currentPageRecommendList,
		pageSize,
		goToNext,
		backToPrev,
		setPageSize,
	} = usePage({
		initialPageSize: getPageSize(),
		list: radarChartRecommend?.recommendItems ?? [],
	});

	const listRef = useCallback<RefCallback<HTMLUListElement>>(listElement => {
		if (listElement) {
			setMinHeight(getHeight(listElement));
		}
	}, []);

	const resize = useCallback(() => {
		setPageSize(getPageSize());
	}, [setPageSize]);

	const handleClickCategoryPanel = useCallback(
		(item: RecommendItem) => {
			cameleer
				.trackClick({
					...radarChartRecommend,
					item,
				})
				.then();
			if (item.linkUrl) {
				Router.push(trimUrlDomain(item.linkUrl));
			}
		},
		[radarChartRecommend]
	);

	useEffect(() => {
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, [resize]);

	return (
		<CameleerContents
			title={radarChartRecommend.title}
			className={styles.recommendContent}
		>
			<div className={styles.categoryPanelContainer}>
				<ul
					data-page-size={pageSize}
					ref={listRef}
					className={styles.categoryPanelList}
					style={{ minHeight }}
				>
					{currentPageRecommendList.map((recommend, index) => (
						<li
							key={index}
							className={styles.categoryPanel}
							onClick={() => handleClickCategoryPanel(recommend)}
						>
							<div className={styles.imageContainer}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									className={styles.image}
									src={recommend.imgUrl}
									alt={removeTags(recommend.name ?? '')}
									onLoad={() =>
										cameleer
											.trackImpression({
												...radarChartRecommend,
												item: recommend,
											})
											.then()
									}
								/>
							</div>
							<div className={styles.categoryName}>
								<Link
									href={trimUrlDomain(recommend.linkUrl)}
									className={styles.link}
									dangerouslySetInnerHTML={{ __html: recommend.name ?? '' }}
								/>
							</div>
						</li>
					))}
				</ul>
				<div className={styles.previous} onClick={() => backToPrev()}></div>
				<div className={styles.next} onClick={() => goToNext()}></div>
			</div>
		</CameleerContents>
	);
};
RadarChartRecommend.displayName = 'RadarChartRecommend';
