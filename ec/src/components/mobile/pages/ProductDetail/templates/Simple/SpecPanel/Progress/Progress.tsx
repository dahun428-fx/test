import classNames from 'classnames';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Progress.module.scss';

type Guide = {
	active: boolean;
};

type Props = {
	maxGuideCount: number;
	guideCount: number;
};

/**
 * Progress
 */
export const Progress: React.VFC<Props> = ({ maxGuideCount, guideCount }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	// arrow width (%)
	const [arrowWidth, setArrowWidth] = useState<number>(0);

	const guideList: Guide[] = useMemo(
		() =>
			Array.from(Array(maxGuideCount).keys()).map(index => ({
				active: index < guideCount,
			})),
		[guideCount, maxGuideCount]
	);

	useLayoutEffect(() => {
		if (containerRef.current && maxGuideCount) {
			const observer = new ResizeObserver(([entry]) => {
				if (entry) {
					const containerWidth = entry.contentRect.width;
					const arrowWidth = containerWidth / maxGuideCount;
					setArrowWidth((arrowWidth / containerWidth) * 100);
				}
			});
			observer.observe(containerRef.current);
			return () => observer.disconnect();
		} else {
			setArrowWidth(0);
		}
	}, [maxGuideCount]);

	return (
		<div className={styles.container} ref={containerRef}>
			{guideList.map((guide, index) => (
				<div
					key={index}
					style={{ width: `${arrowWidth}%` }}
					className={classNames(styles.guide, {
						[String(styles.active)]: guide.active,
					})}
				/>
			))}
		</div>
	);
};
Progress.displayName = 'Progress';
