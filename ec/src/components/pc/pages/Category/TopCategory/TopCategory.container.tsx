import { useRouter } from 'next/router';
import React from 'react';
import { Meta } from './Meta';
import { TopCategory as Presenter } from '@/components/pc/domain/category/TopCategory';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';

type Props = {
	category: Category;
};

/** Top category container */
export const TopCategory: React.VFC<Props> = ({ category }) => {
	const router = useRouter();

	return (
		<>
			<Meta category={category} />
			<Presenter key={router.asPath} category={category} />
		</>
	);
};
TopCategory.displayName = 'TopCategory';
