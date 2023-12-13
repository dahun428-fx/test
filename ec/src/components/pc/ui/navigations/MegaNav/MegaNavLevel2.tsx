import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
// import styles from './MegaNav.module.scss';
import styles from './CategoryBalloon.module.scss';
import { Link } from './Link';
import { url } from '@/utils/url';

type Props = {
	categoryCode: string;
	meganavLevel2List: Category[][];
	targetCategoryList: Category[];
	handleMouseEnter: (categoryList: Category[]) => void;
	setImgSrc: (categoryGroupImageUrl: string) => void;
	onClickLink: () => void;
};

export const MegaNavLevel2: React.VFC<Props> = ({
	categoryCode,
	meganavLevel2List,
	targetCategoryList,
	onClickLink,
	handleMouseEnter,
	setImgSrc,
}) => {
	const isOpen = (categoryList: Category[]) => {
		return categoryList[0]?.categoryCode == targetCategoryList[0]?.categoryCode;
	};
	return (
		<>
			{meganavLevel2List &&
				meganavLevel2List.map((categoryList: Category[], index: number) => {
					return (
						<li
							key={`${categoryList[0]?.categoryCode}_level2_${index}`}
							className={isOpen(categoryList) ? styles.on : ''}
							onMouseEnter={() => handleMouseEnter(categoryList)}
						>
							<ul>
								{categoryList.map((category: Category, index: number) => {
									return (
										<li
											key={`${category.categoryCode}_level2_child_${index}`}
											onMouseEnter={() =>
												setImgSrc(category.categoryGroupImageUrl || '')
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
								})}
							</ul>
						</li>
					);
				})}
		</>
	);
};
MegaNavLevel2.displayName = 'MegaNavLevel2';
