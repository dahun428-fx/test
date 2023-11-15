import styles from './CategoryLinkList.module.scss';
import { Link } from '@/components/mobile/ui/links';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { isEmpty } from '@/utils/predicate';

type Props = {
	/** リンクとして表示させたいカテゴリのリスト */
	categoryList?: Category[];
	/** ルートから、すべての親のカテゴリコード */
	parentCategoryCodeHierarchy?: string[];
	/** 現在画面上に表示されるカテゴリのコード */
	currentCategoryCode?: string;
};

export const CategoryLinkList: React.VFC<Props> = ({
	categoryList = [],
	parentCategoryCodeHierarchy = [],
	currentCategoryCode,
}) => {
	if (isEmpty(categoryList)) {
		return null;
	}

	return (
		<ul className={styles.linkList}>
			{categoryList.map(category => (
				<li key={category.categoryCode} className={styles.listItem}>
					<Link
						href={pagesPath.vona2
							._categoryCode(
								parentCategoryCodeHierarchy.concat(category.categoryCode)
							)
							.$url()}
						className={styles.link}
						data-active={category.categoryCode === currentCategoryCode}
					>
						{category.categoryName}
					</Link>
				</li>
			))}
		</ul>
	);
};
CategoryLinkList.displayName = 'CategoryLinkList';
