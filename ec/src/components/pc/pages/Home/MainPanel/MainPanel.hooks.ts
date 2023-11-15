import { useMemo, useState } from 'react';
import { getViewCategoryRepeatRecommend } from '@/api/services/cameleer/getViewCategoryRepeatRecommend';
import { searchCategory } from '@/api/services/searchCategory';
import type { RecommendCategory } from '@/components/pc/pages/Home/ViewCategoryRepeatRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { GetViewCategoryRepeatRecommendResponse } from '@/models/api/cameleer/category/GetViewCategoryRepeatRecommendResponse';
import { SearchCategoryResponse } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { Cookie, getCookie } from '@/utils/cookie';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

export const useViewCategoryRecommend = () => {
	const [viewCategoryRecommendResponse, setViewCategoryRecommendResponse] =
		useState<GetViewCategoryRepeatRecommendResponse>();
	const [categoryResponse, setCategoryResponse] =
		useState<SearchCategoryResponse>();
	const [loading, setLoading] = useState(false);

	/** 最近見たカテゴリ */
	const viewedCategoryCodes = getCookie(Cookie.RECENTLY_VIEWED_CATEGORY);

	const recommendCategoryList = useMemo<RecommendCategory[]>(() => {
		if (
			viewCategoryRecommendResponse &&
			viewCategoryRecommendResponse.recommendItems.length > 0
		) {
			const { cameleerId, dispPage, recommendItems } =
				viewCategoryRecommendResponse;
			return recommendItems.map(item => ({
				categoryCode: item.itemCd,
				categoryName: item.name,
				imageUrl: item.imgUrl,
				position: item.position,
				url: url
					.category(
						...[
							item.categoryCdLv2,
							item.categoryCdLv3,
							item.categoryCdLv4,
							item.categoryCdLv5,
							item.categoryCdLv6,
							item.categoryCdLv7,
						].filter(notNull)
					)
					.fromRecommend(cameleerId, dispPage, item.position, item.itemCd),
			}));
		}

		if (
			categoryResponse &&
			categoryResponse.categoryList.length > 0 &&
			viewedCategoryCodes
		) {
			return viewedCategoryCodes
				.split(',')
				.map(categoryCode => {
					const found = categoryResponse.categoryList.find(
						category => category.categoryCode === categoryCode
					);
					// display only categories with image
					if (found && found.categoryImageUrl) {
						return {
							categoryCode: found.categoryCode,
							categoryName: found.categoryName,
							imageUrl: found.categoryImageUrl,
							url: url.category(
								...found.parentCategoryCodeList,
								found.categoryCode
							)(),
						};
					}
				})
				.filter(notNull);
		}

		return [];
	}, [categoryResponse, viewCategoryRecommendResponse, viewedCategoryCodes]);

	useOnMounted(async () => {
		setLoading(true);

		const categoryRecommend = await getViewCategoryRepeatRecommend('top');
		if (categoryRecommend && categoryRecommend.recommendItems.length > 0) {
			setViewCategoryRecommendResponse(categoryRecommend);
			setLoading(false);
			return;
		}

		if (viewedCategoryCodes) {
			try {
				const categoryResponse = await searchCategory({
					categoryCode: viewedCategoryCodes,
				});
				setCategoryResponse(categoryResponse);
			} catch (error) {
				// do nothing here
			}
		}

		setLoading(false);
	});

	return {
		loadingCategories: loading,
		recommendCategoryList,
		viewCategoryRecommendResponse,
	};
};
