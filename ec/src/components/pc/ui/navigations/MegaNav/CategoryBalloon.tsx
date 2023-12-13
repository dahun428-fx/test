import React, { useMemo, useState } from 'react';
import styles from './CategoryBalloon.module.scss';
// import styles from './MegaNav.module.scss';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import Image from 'next/image';
import { MegaNavLevel2 } from './MegaNavLevel2';
import { MegaNavLevel3 } from './MegaNavLevel3';

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
	isOpen: boolean;
};

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
	isOpen,
}) => {
	const [targetCategoryList, setTargetCategoryList] = useState<Category[]>([]);
	const [imgSrc, setImgSrc] = useState<string>(categoryGroupImageUrl);

	/**
	 * array seperate for meganav
	 * @param categoryList
	 * @returns
	 */
	const makeMeganavLevel = (categoryList: Category[]): Category[][] => {
		let resultList = [];
		let tempList: Category[] = [];
		for (const category of categoryList) {
			if (tempList.length === 2) {
				resultList.push(tempList);
				tempList = [];
			}
			tempList.push(category);
		}
		if (tempList.length > 0) {
			resultList.push(tempList);
		}
		return resultList;
	};

	const meganavLevel2List =
		useMemo(() => {
			if (childCategoryList.length < 1) return;
			return makeMeganavLevel(childCategoryList) || [];
		}, [categoryCode]) || [];

	const meganavLevel3List =
		useMemo(() => {
			if (targetCategoryList.length < 1) {
				return meganavLevel2List[0];
			} else {
				return targetCategoryList;
			}
		}, [meganavLevel2List, targetCategoryList]) || [];

	const handleMouseEnter = (categoryList: Category[]) => {
		setTargetCategoryList(categoryList);
	};

	return (
		<div
			className={styles.meganavBalloonBox}
			style={isOpen ? { display: 'block' } : { display: 'none' }}
		>
			<div className={styles.meganavBalloonBoxInner}>
				<div className={styles.meganavLevel2}>
					<ul className={styles.meganavLevel2List}>
						<MegaNavLevel2
							categoryCode={categoryCode}
							meganavLevel2List={meganavLevel2List}
							targetCategoryList={targetCategoryList}
							onClickLink={onClickLink}
							setImgSrc={setImgSrc}
							handleMouseEnter={handleMouseEnter}
						/>
					</ul>
				</div>
				<div className={styles.meganavLevel3}>
					<MegaNavLevel3
						categoryCode={categoryCode}
						meganavLevel3List={meganavLevel3List}
						makeMeganavLevel={makeMeganavLevel}
						onClickLink={onClickLink}
					/>
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
