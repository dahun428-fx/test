import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { Meta } from './Meta';
import { SpecSearch as Presenter } from './SpecSearch';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { selectSeriesResponse } from '@/store/modules/pages/category';
import { getOneParams } from '@/utils/query';

type Props = {
	category: Category;
};

/** Spec search container */
export const SpecSearch: React.VFC<Props> = ({ category }) => {
	const seriesResponse = useSelector(selectSeriesResponse);
	const router = useRouter();

	const params = getOneParams(router.query, 'Page', 'CategorySpec');
	const page = params.Page ? parseInt(params.Page) : 1;
	const categorySpecQuery = params.CategorySpec;

	if (!seriesResponse) {
		return null;
	}

	return (
		<>
			<Meta category={category} />
			<Presenter
				category={category}
				seriesResponse={seriesResponse}
				categorySpecQuery={categorySpecQuery}
				page={page}
				key={router.asPath}
			/>
		</>
	);
};
SpecSearch.displayName = 'SpecSearch';
