import { useRouter } from 'next/router';
import React from 'react';
import { CategoryInfo as Presenter } from './CategoryInfo';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	category: Category;
	categoryList: Category[];
	topCategoryCode: string;
};

/** Category info container */
export const CategoryInfo: React.VFC<Props> = ({
	category,
	categoryList,
	topCategoryCode,
}) => {
	const router = useRouter();

	return (
		<Presenter
			key={router.asPath}
			category={category}
			categoryList={categoryList}
			topCategoryCode={topCategoryCode}
		/>
	);
};
CategoryInfo.displayName = 'CategoryInfo';
