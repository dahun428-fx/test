import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './CategoryList.module.scss';
import { Link } from '@/components/pc/ui/links';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { url } from '@/utils/url';

type Props = {
	categoryList: Category[];
};

export const CategoryList: React.VFC<Props> = ({ categoryList }) => {
	const [t] = useTranslation();

	return (
		<div>
			<h2 className={styles.title}>{t('pages.sitemap.categoryList.title')}</h2>
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
				<Link href={url.category(...categoryCodeList)()}>
					{category.categoryName}
				</Link>
			</LinkWrapper>
			{category.childCategoryList.length > 0 && (
				<ul>
					{category.childCategoryList.map(children => (
						<li
							key={children.categoryCode}
							className={classNames({
								[String(styles.listItemLevel1)]: level === 1,
								[String(styles.listItemLevel2)]: level === 2,
								[String(styles.listItemLevel3OrMore)]: level >= 3,
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

const LinkWrapper: React.FC<{ level: number }> = ({ level, children }) => {
	return (
		<>
			{level === 1 ? (
				<h3 className={styles.categoryTitleLevel1}>{children}</h3>
			) : level === 2 ? (
				<h4 className={styles.categoryTitleLevel2}>{children}</h4>
			) : (
				<>{children}</>
			)}
		</>
	);
};
