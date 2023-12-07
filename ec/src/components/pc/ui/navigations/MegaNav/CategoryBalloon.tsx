import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
// import styles from './CategoryBalloon.module.scss';
import styles from './MegaNav.module.scss';
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

	const getCategoryListByLevel = (categoryList: Category[]) =>
		useMemo(() => {
			const listsize = categoryList.length;
			if (listsize <= 0) return [];
			let rslist: any[] = [];
			let templist: Category[] = [];
			let count: number = 0;

			categoryList.forEach((category, index) => {
				if (count < 2) {
					templist.push(category);
					count++;
				} else {
					rslist.push(templist);
					templist = [];
					count = 0;
				}
			});

			if (categoryList.length % 2 != 0 && templist.length > 0) {
				rslist.push(templist);
			}
			console.log(rslist);

			return rslist;
		}, [categoryList]);

	return (
		<div className={styles.meganavBalloonBox}>
			<div className={styles.meganavBalloonBoxInner}>
				<div className={styles.meganavLevel2}>
					<ul className={styles.meganavLevel2List}>
						{getCategoryListByLevel(childCategoryList).map(
							(list: Category[], index: number) => {
								return (
									<li>
										<ul>
											{list.map((category: Category, index: number) => {
												return (
													<li>
														<Link
															href={url.category(
																categoryCode,
																category.categoryCode
															)()}
															onClick={onClickLink}
														>
															{category.categoryName}
															<i className={styles.onIcon}></i>
														</Link>
													</li>
												);
											})}
										</ul>
									</li>
								);
							}
						)}
					</ul>
				</div>
				<div className={styles.meganavLevel3}>
					<div>
						<h4 className="lc-heading"></h4>
						<ul className={styles.meganavLevel3List}></ul>
					</div>
				</div>
				<div className={styles.meganavPromotion}>
					<div className={styles.meganavPromotionPhoto}>
						<div className="lc-image"></div>
					</div>
				</div>
			</div>
		</div>
	);
};
CategoryBalloon.displayName = 'CategoryBalloon';
