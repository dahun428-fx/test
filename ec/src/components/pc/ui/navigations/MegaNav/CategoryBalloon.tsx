import classNames from 'classnames';
import React, { useMemo, useRef, useState, useEffect } from 'react';
// import styles from './CategoryBalloon.module.scss';
import styles from './MegaNav.module.scss';
import { Heading } from './Heading';
import { Link } from './Link';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';
import { template } from '@babel/core';
import { categoryList } from '@/components/mobile/pages/Category/CategoryList/CategoryList.i18n.en';
import Image from 'next/image';

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
	const [hoverCategoryCode, setHoverCategoryCode] = useState<
		string | undefined
	>('');
	const [hoveredCategoryList, setHoveredCategoryList] = useState<Category[]>(
		[]
	);
	const [meganavLevel2List, setMeganavLevel2List] = useState<Category[][]>([]);
	const [meganavLevel3List, setMeganavLevel3List] = useState<Category[]>([]);
	const [imgSrc, setImgSrc] = useState(categoryGroupImageUrl);

	useEffect(() => {
		const makedList = makeMeganavLevel(childCategoryList);
		console.log(makedList);
		setMeganavLevel2List(makedList);
		setImgSrc(categoryGroupImageUrl);
		return () => {
			setMeganavLevel2List([]);
			setImgSrc('');
		};
	}, [categoryCode]);

	useEffect(() => {
		if (hoveredCategoryList.length < 1) {
			setMeganavLevel3List(meganavLevel2List[0] || []);
		} else {
			setMeganavLevel3List(hoveredCategoryList);
		}
		return () => {
			setMeganavLevel3List([]);
		};
	}, [meganavLevel2List, hoveredCategoryList]);

	const makeMeganavLevel = (categoryList: Category[]): Category[][] => {
		let resultList = [];
		let tempList: Category[] = [];
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
	};

	const handleMouseEnter = (categoryList: Category[]) => {
		setHoverCategoryCode(categoryList[0]?.categoryCode);
		setHoveredCategoryList(categoryList);
	};

	return (
		<div className={styles.meganavBalloonBox}>
			<div className={styles.meganavBalloonBoxInner}>
				<div className={styles.meganavLevel2}>
					<ul className={styles.meganavLevel2List}>
						{meganavLevel2List &&
							meganavLevel2List.map(
								(categoryList: Category[], index: number) => {
									return (
										<li
											key={`${categoryList[0]?.categoryCode}_level2_${index}`}
											className={
												hoverCategoryCode === categoryList[0]?.categoryCode
													? styles.on
													: ''
											}
											onMouseEnter={() => handleMouseEnter(categoryList)}
										>
											<ul>
												{categoryList.map(
													(category: Category, index: number) => {
														return (
															<li
																key={`${category.categoryCode}_level2_child_${index}`}
																onMouseEnter={() =>
																	setImgSrc(
																		category.categoryGroupImageUrl || ''
																	)
																}
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
													}
												)}
											</ul>
										</li>
									);
								}
							)}
					</ul>
				</div>
				<div className={styles.meganavLevel3}>
					{meganavLevel3List &&
						meganavLevel3List.map((category: Category, index: number) => {
							return (
								<div key={`${category.categoryCode}_level3_${index}`}>
									<h4 className={styles.heading}>{category.categoryName}</h4>
									<ul className={styles.meganavLevel3List}>
										{category.childCategoryList &&
											makeMeganavLevel(category.childCategoryList).map(
												(childCategoryList: Category[], index: number) => {
													return (
														<li>
															<ul>
																{childCategoryList.map(
																	(childCategory: Category, index: number) => {
																		// console.log(childCategory);

																		return (
																			<li
																				key={`${category.categoryCode}_${childCategory.categoryCode}_level3_${index}`}
																			>
																				<Link
																					href={url.category(
																						categoryCode,
																						category.categoryCode,
																						childCategory.categoryCode
																					)()}
																					onClick={onClickLink}
																				>
																					<span>
																						{childCategory.categoryName}
																					</span>
																				</Link>
																			</li>
																		);
																	}
																)}
															</ul>
														</li>
													);
												}
											)}
									</ul>
								</div>
							);
						})}
				</div>
				<div className={styles.meganavPromotion}>
					<div className={styles.meganavPromotionPhoto}>
						<div className={styles.image}>
							<Image src={`https:${imgSrc}`} width={300} height={150} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
CategoryBalloon.displayName = 'CategoryBalloon';
