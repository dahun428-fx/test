import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import styles from './CategoryBalloon.module.scss';
import { Heading } from './Heading';
import { Link } from './Link';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';

type Props = {
	/** カテゴリコード */
	categoryCode: string;
	/** 集合画像URL */
	categoryGroupImageUrl?: string;
	/** カテゴリ名 */
	categoryName?: string;
	/** 子カテゴリ情報リスト */
	childCategoryList: Category[];
	/** click category link handler */
	onClickLink: () => void;
	className?: string;
};

const initialCursor = -1;

/**
 * カテゴリバルーン（子カテゴリリンク一覧）
 */
export const CategoryBalloon: React.VFC<Props> = ({
	categoryCode,
	categoryGroupImageUrl = '',
	categoryName,
	childCategoryList,
	onClickLink,
	className,
}) => {
	// マウスカーソルの乗っているカテゴリのインデックス
	const [cursor, setCursor] = useState(initialCursor);
	/** バルーンの最下部に設定するカテゴリグループイメージのスタイル */
	const imageStyle = useMemo(() => {
		const url =
			cursor < 0
				? categoryGroupImageUrl
				: childCategoryList[cursor]?.categoryGroupImageUrl ||
				  categoryGroupImageUrl;
		return { backgroundImage: `url(${url})` };
	}, [categoryGroupImageUrl, childCategoryList, cursor]);

	return (
		<div className={classNames(styles.wrapper, className)}>
			<div className={styles.balloon}>
				<Heading>{categoryName}</Heading>
				<ul
					className={styles.categoryList}
					onMouseLeave={() => setCursor(initialCursor)}
				>
					{childCategoryList.map((category, index) => (
						<li
							key={category.categoryCode}
							className={styles.categoryItem}
							onMouseOver={() => setCursor(index)}
						>
							<Link
								href={url.category(categoryCode, category.categoryCode)()}
								onClick={onClickLink}
							>
								{category.categoryName}
							</Link>
						</li>
					))}
				</ul>
				<div className={styles.categoryImage} style={imageStyle} />
			</div>
		</div>
	);
};
CategoryBalloon.displayName = 'CategoryBalloon';
