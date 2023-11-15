import React, { useCallback, useMemo, useState } from 'react';
import { getPurchaseCategoryRecommend } from '@/api/services/cameleer/getPurchaseCategoryRecommended';
import { getPurchaseCategoryRepeatRecommended } from '@/api/services/cameleer/getPurchaseCategoryRepeatRecommended';
import { getViewCategoryRecommend } from '@/api/services/cameleer/getViewCategoryRecommended';
import { RecommendCategoriesSection as Presenter } from '@/components/pc/domain/category/CameleerContents/_legacy/RecommendCategory/RecommendCategoriesSection';
import { RecommendCategory as RecommendCategoryItem } from '@/components/pc/domain/category/CameleerContents/_legacy/RecommendCategory/RecommendCategoriesSection/RecommendCategoryItems';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { cameleer } from '@/logs/cameleer';
import { GetViewCategoryRecommendResponse } from '@/models/api/cameleer/getViewCategoryRecommend/GetViewCategoryRecommendResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

type Props = {
	categories: Category[];
	variant:
		| 'ViewedCategoryRecommend'
		| 'PurchaseCategoryRecommend'
		| 'PurchaseCategoryRepeatRecommend';
};

/**
 * 旧Recommend category recommend container
 * TODO: 不要化が確定されたらフォルダごと削除する
 * @deprecated
 */
export const RecommendCategory: React.VFC<Props> = ({
	categories,
	variant,
}) => {
	const [categoryRecommendResponse, setCategoryRecommendResponse] = useState<
		GetViewCategoryRecommendResponse | GetViewCategoryRecommendResponse
	>();

	const childCategoryCodes = useMemo(() => {
		const rootCategory = categories[1];

		if (!rootCategory) {
			return [];
		}

		return rootCategory.childCategoryList.map(
			category => category.categoryCode
		);
	}, [categories]);

	const categoryList = useMemo<RecommendCategoryItem[]>(() => {
		if (!categoryRecommendResponse) {
			return [];
		}

		const { cameleerId, dispPage, recommendItems } = categoryRecommendResponse;
		return recommendItems.map(item => ({
			categoryCode: item.itemCd,
			categoryName: item.name,
			imageUrl: item.imgUrl,
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
			position: item.position,
		}));
	}, [categoryRecommendResponse]);

	const handleClickCategoryPanel = useCallback(
		(itemCode: string, position: number) => {
			categoryRecommendResponse &&
				cameleer
					.trackClick({
						...categoryRecommendResponse,
						item: { itemCd: itemCode, position },
					})
					.then();
		},
		[categoryRecommendResponse]
	);

	const handleLoadCategoryImage = useCallback(
		(itemCode: string, position: number) => {
			categoryRecommendResponse &&
				cameleer
					.trackImpression({
						...categoryRecommendResponse,
						item: { itemCd: itemCode, position },
					})
					.then();
		},
		[categoryRecommendResponse]
	);

	const load = useCallback(async () => {
		try {
			const categoryCodes = childCategoryCodes.join(',');

			let categoryRecommend = null;

			switch (variant) {
				case 'ViewedCategoryRecommend':
					categoryRecommend = await getViewCategoryRecommend({
						x2: categoryCodes,
						x3: categoryCodes,
					});
					break;

				case 'PurchaseCategoryRecommend':
					categoryRecommend = await getPurchaseCategoryRecommend({
						x2: categoryCodes,
						x3: categoryCodes,
					});
					break;

				case 'PurchaseCategoryRepeatRecommend':
					categoryRecommend = await getPurchaseCategoryRepeatRecommended({
						dispPage: 'ctg2',
					});
					break;

				default:
					break;
			}

			if (categoryRecommend !== null) {
				setCategoryRecommendResponse(categoryRecommend);
			}
		} catch {
			// noop
		}
	}, [childCategoryCodes, variant]);

	useOnMounted(load);

	if (!categoryRecommendResponse || categoryList.length === 0) {
		return null;
	}

	return (
		<Presenter
			categoryList={categoryList}
			title={categoryRecommendResponse.title}
			onClick={handleClickCategoryPanel}
			onLoadImage={handleLoadCategoryImage}
		/>
	);
};

RecommendCategory.displayName = 'RecommendCategory';
