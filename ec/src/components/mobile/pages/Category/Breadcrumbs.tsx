import { VFC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BreadcrumbsPortal } from '@/components/mobile/layouts/footers/Footer/BreadcrumbsPortal';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { SearchSeriesResponse$search } from '@/models/api/msm/ect/series/SearchSeriesResponse$search';
import {
	getBreadcrumbList,
	getCategoryListFromRoot,
	getCategorySpecFromQuery,
} from '@/utils/domain/category';

type Props = {
	categoryCode: string;
	topCategory?: Category;
	seriesResponse?: SearchSeriesResponse$search;
	page?: number;
};

export const Breadcrumbs: VFC<Props> = ({
	categoryCode,
	topCategory,
	seriesResponse,
	page = 1,
}) => {
	const [t] = useTranslation();

	/** "CategorySpec" query parameter */
	const categorySpec = useMemo(() => {
		const categorySpec = new URLSearchParams(location.search).get(
			'CategorySpec'
		);

		return categorySpec && seriesResponse
			? getCategorySpecFromQuery(categorySpec, seriesResponse)
			: null;
	}, [seriesResponse]);

	/** TOP カテゴリから最下位カテゴリまでのカテゴリリスト */
	const categoryList = useMemo(
		() =>
			topCategory ? getCategoryListFromRoot(topCategory, categoryCode) : [],
		[categoryCode, topCategory]
	);

	/** 現在開いているページのカテゴリ */
	const currentCategory = useMemo(() => {
		// 本当は pop などしたくないが、 utils 側がそうなので仕方なし…。
		// また、pop を使っている恐怖から useMemo しています。utils/domain/category 綺麗にしたい…。
		return categoryList.pop();
	}, [categoryList]);

	const breadcrumbList = useMemo(
		() =>
			getBreadcrumbList({
				categoryList,
				currentCategory,
				page,
				categorySpec,
				t,
			}),
		[categoryList, categorySpec, currentCategory, page, t]
	);

	return <BreadcrumbsPortal breadcrumbList={breadcrumbList} dangerouslyHtml />;
};
