import classNames from 'classnames';
import React, { useMemo, useRef, useState } from 'react';
// import styles from './CategoryBalloon.module.scss';
import styles from './MegaNav.module.scss';
import { Heading } from './Heading';
import { Link } from './Link';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';
import { template } from '@babel/core';
import { categoryList } from '@/components/mobile/pages/Category/CategoryList/CategoryList.i18n.en';

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

	const [hoverCategoryCode, setHoverCategoryCode] = useState('');

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
			let resultList = [];
			let tempList: any[] = [];
			for (const category of categoryList) {
				if (tempList.length >= 2) {
					resultList.push(tempList);
					tempList = [];
				}
				tempList.push(category);
			}
			if (categoryList.length % 2 != 0 && tempList.length > 0) {
				resultList.push(tempList);
			}
			return resultList;
		}, [categoryList]);

	const handleMouseEnter = (categoryCode: string) => {
		setHoverCategoryCode(categoryCode);
	};
	const handleMouseLeave = () => {
		setHoverCategoryCode('');
	};
	const hoveringCategory = (categoryList: Category[]) => {
		if (!hoverCategoryCode) {
			return false;
		}
		for (const category of categoryList) {
			console.log('targeting category : ', categoryList);
			if (hoverCategoryCode === category.categoryCode) {
				return true;
			}
		}
		return false;
	};

	return (
		<div className={styles.meganavBalloonBox}>
			<div className={styles.meganavBalloonBoxInner}>
				<div className={styles.meganavLevel2}>
					<ul className={styles.meganavLevel2List}>
						{getCategoryListByLevel(childCategoryList).map(
							(categoryList: Category[], index: number) => {
								return (
									<li
										key={`${categoryList[0]?.categoryCode}_${index}`}
										className={
											hoveringCategory(categoryList)
												? classNames(styles.on)
												: ''
										}
									>
										<ul>
											{categoryList.map((category: Category, index: number) => {
												return (
													<li
														key={`${category.categoryCode}_${index}_${index}`}
														onMouseEnter={() =>
															handleMouseEnter(category.categoryCode)
														}
														onMouseLeave={() => handleMouseLeave()}
													>
														<Link
															href={url.category(
																categoryCode,
																category.categoryCode
															)()}
															onClick={onClickLink}
														>
															<span className={styles.text}>
																{category.categoryName}
															</span>
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
				<div className={styles.meganavLevel3}></div>
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
