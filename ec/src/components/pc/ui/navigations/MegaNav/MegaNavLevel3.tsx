import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
// import styles from './MegaNav.module.scss';
import styles from './CategoryBalloon.module.scss';
import { url } from '@/utils/url';
import { Link } from './Link';

type Props = {
	categoryCode: string;
	meganavLevel3List: Category[];
	makeMeganavLevel: (categoryList: Category[]) => Category[][];
	onClickLink: () => void;
};

export const MegaNavLevel3: React.VFC<Props> = ({
	categoryCode,
	meganavLevel3List,
	makeMeganavLevel,
	onClickLink,
}) => {
	return (
		<>
			{meganavLevel3List &&
				meganavLevel3List.map((category: Category, index: number) => {
					return (
						<div key={`${category.categoryCode}_level3_${index}`}>
							<h4 className={styles.heading}>{category.categoryName}</h4>
							<ul className={styles.meganavLevel3List}>
								{category.childCategoryList.length > 0 ? (
									makeMeganavLevel(category.childCategoryList).map(
										(childCategoryList: Category[], index: number) => {
											return (
												<li
													key={`${category.categoryCode}_${childCategoryList[0]?.categoryCode}_level3_${index}`}
												>
													<ul>
														{childCategoryList.map(
															(childCategory: Category, index: number) => {
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
																			<span>{childCategory.categoryName}</span>
																		</Link>
																	</li>
																);
															}
														)}
													</ul>
												</li>
											);
										}
									)
								) : (
									<li>
										<ul>
											<li>
												<Link
													href={url.category(
														categoryCode,
														category.categoryCode
													)()}
													onClick={onClickLink}
												>
													<span>{category.categoryName}</span>
												</Link>
											</li>
										</ul>
									</li>
								)}
							</ul>
						</div>
					);
				})}
		</>
	);
};

MegaNavLevel3.displayName = 'MegaNavLevel3';
