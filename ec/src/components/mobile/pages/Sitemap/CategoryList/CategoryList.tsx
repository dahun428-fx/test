import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './CategoryList.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Link } from '@/components/mobile/ui/links';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';

type Props = {
	categoryList: Category[];
};

/**
 * Category list component
 */
export const CategoryList: React.VFC<Props> = ({ categoryList }) => {
	const [t] = useTranslation();

	return (
		<div>
			<SectionHeading>
				{t('mobile.pages.sitemap.categoryList.title')}
			</SectionHeading>

			{categoryList.map(category => (
				<CategoryChildren
					key={category.categoryCode}
					category={category}
					parentCategoryCodeList={[]}
					level={1}
				/>
			))}
		</div>
	);
};
CategoryList.displayName = 'CategoryList';

type ChildrenProps = {
	category: Category;
	parentCategoryCodeList: string[];
	level: number;
};

const CategoryChildren: React.VFC<ChildrenProps> = ({
	category,
	parentCategoryCodeList,
	level,
}) => {
	const categoryCodeList = [...parentCategoryCodeList, category.categoryCode];

	return (
		<>
			<LinkWrapper level={level}>
				<Link
					href={pagesPath.vona2._categoryCode(categoryCodeList).$url()}
					className={styles.link}
				>
					{category.categoryName}
				</Link>
			</LinkWrapper>
			{category.childCategoryList.length > 0 && (
				<ul>
					{category.childCategoryList.map(children => (
						<li
							key={children.categoryCode}
							className={classNames(styles.listItem, {
								[String(styles.listItemLevel3)]: level === 3,
								[String(styles.listItemLevel4OrMore)]: level > 3,
							})}
						>
							<CategoryChildren
								category={children}
								parentCategoryCodeList={categoryCodeList}
								level={level + 1}
							/>
						</li>
					))}
				</ul>
			)}
		</>
	);
};
CategoryChildren.displayName = 'CategoryChildren';

const LinkWrapper: React.FC<{ level: number }> = ({ level, children }) => {
	return (
		<>
			{level === 1 ? (
				<h3 className={styles.categoryTitleLevel1}>{children}</h3>
			) : level === 2 ? (
				<h4 className={styles.categoryTitleLevel2}>{children}</h4>
			) : (
				children
			)}
		</>
	);
};
LinkWrapper.displayName = 'LinkWrapper';
