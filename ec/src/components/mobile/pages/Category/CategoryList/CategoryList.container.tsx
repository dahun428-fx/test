import React, { useEffect, useState } from 'react';
import { CategoryList as Presenter } from './CategoryList';
import styles from './CategoryList.module.scss';
import { searchCategory } from '@/api/services/searchCategory';
import { Breadcrumbs } from '@/components/mobile/pages/Category/Breadcrumbs';
import {
	LowerCategoryMeta,
	TopCategoryMeta,
} from '@/components/mobile/pages/Category/CategoryList/Meta';
import { BlockLoader } from '@/components/mobile/ui/loaders';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { Logger } from '@/logs/datadog';
import { AncesterType } from '@/models/api/msm/ect/category/SearchCategoryRequest';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { assertNotNull } from '@/utils/assertions';
import { last } from '@/utils/collection';

type Props = {
	topCategoryCode: string;
	currentCategoryCode: string;
	flattenCategoryList: Category[];
};

export const CategoryList: React.VFC<Props> = ({
	topCategoryCode,
	currentCategoryCode,
	flattenCategoryList,
}) => {
	const [primaryCategoryList, setPrimaryCategoryList] = useState<
		Category[] | null
	>(
		// NOTE: TOPカテゴリの場合は、初回のカテゴリ情報のフェッチで直径の最下層のカテゴリまで取得しており、
		//       第3階層まで表示可能であるため、画面表示用のデータとして初期設定する
		//       後続の全カテゴリデータのフェッチ後、上書きされる
		topCategoryCode === currentCategoryCode && flattenCategoryList[0]
			? [flattenCategoryList[0]]
			: null
	);

	const currentCategory = last(flattenCategoryList);
	assertNotNull(currentCategory);

	useEffect(() => {
		searchCategory({
			categoryLevel: 0,
			ancesterType: AncesterType.NO_GET,
		})
			.then(({ categoryList }) => setPrimaryCategoryList(categoryList))
			.catch(error => {
				Logger.warn('Error occurred. [fetch categories]', { error });
				// NOTE: データフェッチに失敗した場合は意図的にエラーバウンダリーを表示する
				throw error;
			});
	}, []);

	useEffect(() => {
		const topCategory = flattenCategoryList[0];
		assertNotNull(topCategory);

		const departmentCode = currentCategory.departmentCode;

		if (topCategoryCode === currentCategoryCode) {
			aa.pageView.category.top({ categoryCode: topCategoryCode }).then();
			ga.pageView.category
				.top({
					categoryCode: topCategoryCode,
					departmentCode,
				})
				.then();
		} else {
			aa.pageView.category
				.lower({
					categoryCodeList: flattenCategoryList.map(
						category => category.categoryCode
					),
				})
				.then();
			ga.pageView.category
				.lower({
					misumiFlag: undefined,
					departmentCode: departmentCode,
					categoryList: flattenCategoryList.slice(1).map(rootCategory => ({
						categoryCode: rootCategory.categoryCode,
						categoryName: rootCategory.categoryName,
					})),
					categoryCode: flattenCategoryList[0]?.categoryCode,
				})
				.then();
		}
	}, [
		topCategoryCode,
		currentCategoryCode,
		flattenCategoryList,
		currentCategory.departmentCode,
	]);

	if (!primaryCategoryList) {
		return (
			<div className={styles.loader}>
				<BlockLoader />
			</div>
		);
	}

	return (
		<>
			{topCategoryCode === currentCategoryCode ? (
				<TopCategoryMeta category={currentCategory} />
			) : (
				<LowerCategoryMeta flattenCategoryList={flattenCategoryList} />
			)}
			<Presenter
				initialCategoryCode={currentCategoryCode}
				topCategoryCode={topCategoryCode}
				categoryList={primaryCategoryList}
			/>
			<Breadcrumbs
				categoryCode={currentCategoryCode}
				topCategory={flattenCategoryList[0]}
			/>
		</>
	);
};
CategoryList.displayName = 'CategoryList';
