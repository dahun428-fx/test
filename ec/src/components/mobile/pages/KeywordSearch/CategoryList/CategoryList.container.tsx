import React from 'react';
import { CategoryList as Presenter } from './CategoryList';
import { useSelector } from '@/store/hooks';
import { selectCategoryResponse } from '@/store/modules/pages/keywordSearch';

type Props = {
	keyword: string;
};

/**
 * Category list container
 */
export const CategoryList: React.VFC<Props> = ({ keyword }) => {
	const response = useSelector(selectCategoryResponse);

	if (!response?.categoryList.length) {
		return null;
	}

	return <Presenter categoryResponse={response} keyword={keyword} />;
};
CategoryList.displayName = 'CategoryList';
