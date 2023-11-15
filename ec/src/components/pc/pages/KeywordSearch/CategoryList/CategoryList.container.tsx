import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CategoryList as Presenter } from './CategoryList';
import { useSelector } from '@/store/hooks';
import {
	fetchCategoryByPage,
	selectCategoryResponse,
} from '@/store/modules/pages/keywordSearch';

type Props = {
	className?: string;
	categoryPage?: number;
	keyword: string;
};

/**
 * Category list container
 * WARN: Experimental. Violates development rules. Container implementation is forbidden, implement with hooks.
 */
export const CategoryList: React.VFC<Props> = ({
	className,
	categoryPage = 1,
	keyword,
}) => {
	const dispatch = useDispatch();
	const response = useSelector(selectCategoryResponse);
	const [page, setPage] = useState(categoryPage);

	const onChangePage = useCallback(
		async (page: number) => {
			await fetchCategoryByPage(dispatch)(keyword, page);
			setPage(page);
		},
		[dispatch, keyword]
	);

	if (!response?.categoryList.length) {
		return null;
	}

	return (
		<Presenter
			className={className}
			keyword={keyword}
			response={response}
			page={page}
			onChangePage={onChangePage}
		/>
	);
};
CategoryList.displayName = 'CategoryList';
