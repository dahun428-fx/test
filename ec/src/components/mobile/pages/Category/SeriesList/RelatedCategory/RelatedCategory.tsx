import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from './Breadcrumbs';
import { CategoryLinkList } from './CategoryLinkList';
import styles from './RelatedCategory.module.scss';
import { SectionHeading } from '@/components/mobile/ui/headings';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { pagesPath } from '@/utils/$path';
import { getCategoryListFromRoot } from '@/utils/domain/category';

type Props = {
	topCategoryCode: string;
	categoryCode: string;
	categoryList: Category[];
};

export const RelatedCategory: React.VFC<Props> = ({
	topCategoryCode,
	categoryCode,
	categoryList: rawCategoryList,
}) => {
	const { t } = useTranslation();

	/** TOP カテゴリ */
	const rootCategory = useMemo(
		() =>
			rawCategoryList.find(
				category => category.categoryCode === topCategoryCode
			),
		[rawCategoryList, topCategoryCode]
	);

	/** TOP カテゴリから最下位カテゴリまでのカテゴリのリスト */
	const categoryHierarchy = useMemo(
		() =>
			rootCategory ? getCategoryListFromRoot(rootCategory, categoryCode) : [],
		[categoryCode, rootCategory]
	);

	const currentCategory = useMemo(
		() => categoryHierarchy[categoryHierarchy.length - 1],
		[categoryHierarchy]
	);

	const parentCategory = useMemo(
		() => categoryHierarchy[categoryHierarchy.length - 2],
		[categoryHierarchy]
	);

	const breadcrumbList = useMemo(() => {
		if (categoryHierarchy.length <= 1) {
			return [];
		}

		const parentCategoryHierarchy = categoryHierarchy.slice(0, -1);
		const categoryCodeList = parentCategoryHierarchy.map(
			category => category.categoryCode
		);
		return parentCategoryHierarchy.map((category, index) => ({
			text: category.categoryName,
			href: pagesPath.vona2
				._categoryCode(categoryCodeList.slice(0, index + 1))
				.$url(),
		}));
	}, [categoryHierarchy]);

	return (
		<div>
			<SectionHeading>
				{t('mobile.pages.category.seriesList.relatedCategory.title', {
					categoryName: currentCategory?.categoryName,
				})}
			</SectionHeading>
			<div className={styles.content}>
				<Breadcrumbs breadcrumbList={breadcrumbList} />
				<CategoryLinkList
					categoryList={parentCategory?.childCategoryList}
					parentCategoryCodeHierarchy={categoryHierarchy
						.slice(0, -1)
						.map(category => category.categoryCode)}
					currentCategoryCode={categoryCode}
				/>
				<CategoryLinkList
					categoryList={currentCategory?.childCategoryList}
					parentCategoryCodeHierarchy={categoryHierarchy.map(
						category => category.categoryCode
					)}
				/>
			</div>
		</div>
	);
};
RelatedCategory.displayName = 'RelatedCategory';
