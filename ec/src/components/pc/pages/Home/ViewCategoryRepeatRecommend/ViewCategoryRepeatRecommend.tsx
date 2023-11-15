import classNames from 'classnames';
import React, { RefCallback, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ViewCategoryRepeatRecommend.module.scss';
import { Link } from '@/components/pc/ui/links';
import { usePage } from '@/hooks/state/usePage';
import { getHeight } from '@/utils/dom';
import { getWindowSize, WindowSize } from '@/utils/window';

export type RecommendCategory = {
	categoryCode: string;
	categoryName: string;
	imageUrl: string;
	url: string;
	position?: number;
};

type Props = {
	categoryList: RecommendCategory[];
	className?: string;
	inline?: boolean;
	onClickCategory: (categoryCode: string, position?: number) => void;
	onLoadImageCategory: (categoryCode: string, position?: number) => void;
};

function getPageSize(inline?: boolean) {
	const windowSize = getWindowSize();
	if (inline) {
		switch (windowSize) {
			case WindowSize.LARGE:
				return 8;
			case WindowSize.MEDIUM:
				return 7;
			default:
				return 5;
		}
	}

	switch (windowSize) {
		case WindowSize.SMALL:
		case WindowSize.LARGE:
			return 10;
		case WindowSize.MEDIUM:
			return 8;
		default:
			return 10;
	}
}

const ITEM_WIDTH = 165;

/**
 * View Category Repeat Recommend
 */
export const ViewCategoryRepeatRecommend: React.VFC<Props> = ({
	categoryList,
	className,
	inline,
	onClickCategory,
	onLoadImageCategory,
}) => {
	const { t } = useTranslation();
	const [minHeight, setMinHeight] = useState<number>();
	const {
		listPerPage: displayCategoryList,
		pageSize,
		goToNext,
		backToPrev,
		setPageSize,
	} = usePage({
		initialPageSize: getPageSize(inline),
		list: categoryList,
	});

	const listRef = useCallback<RefCallback<HTMLUListElement>>(listElement => {
		if (listElement) {
			setMinHeight(getHeight(listElement));
		}
	}, []);

	useEffect(() => {
		const onResize = () => setPageSize(getPageSize(inline));
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [inline, setPageSize]);

	return (
		<div className={classNames(styles.listOuter, className)}>
			<h2 className={styles.heading}>
				{t('pages.home.viewCategoryRepeatRecommend.title')}
			</h2>
			<div className={styles.listWrap} data-inline={inline}>
				<ul
					className={styles.list}
					ref={listRef}
					style={{
						minHeight,
						width: inline ? ITEM_WIDTH * pageSize : (ITEM_WIDTH * pageSize) / 2,
					}}
				>
					{displayCategoryList.map(category => (
						<li
							className={styles.item}
							key={category.categoryCode}
							onClick={() =>
								onClickCategory(category.categoryCode, category.position)
							}
						>
							<Link className={styles.itemInner} href={category.url}>
								<div className={styles.imageOuter}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										className={styles.image}
										src={category.imageUrl}
										alt={category.categoryName}
										loading="lazy"
										onLoad={() =>
											onLoadImageCategory(
												category.categoryCode,
												category.position
											)
										}
									/>
								</div>
								<p className={styles.label}>{category.categoryName}</p>
							</Link>
						</li>
					))}
				</ul>
				<a
					href=""
					aria-label="Back to previous page"
					className={styles.prevPager}
					onClick={event => {
						event.preventDefault();
						backToPrev();
					}}
				/>
				<a
					href=""
					aria-label="Go to next page"
					className={styles.nextPager}
					onClick={event => {
						event.preventDefault();
						goToNext();
					}}
				/>
			</div>
		</div>
	);
};
ViewCategoryRepeatRecommend.displayName = 'ViewCategoryRepeatRecommend';
