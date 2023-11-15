import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { CategoryRecommend as Presenter } from './CategoryRecommend';
import { getGeneralRecommend } from '@/api/services/cameleer/getGeneralRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	GeneralRecommendLogParams,
	generalRecommendLogger,
} from '@/logs/cameleer/generalRecommend';
import { GeneralRecommendCategoryItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';

export type RecommendCode = 'c12' | 'c13';
type Props = {
	recommendCode: RecommendCode;
	itemCode: string;
	dispPage: GeneralRecommendLogParams['dispPage'];
};

/** 検索結果画面用のGeneralRecommendコンテナ
 * @param recommendCode レコメンドコード
 * @param itemCode アイテムコード(CategoryCodeと同等)
 * @param categoryDepth  カテゴリの階層レベル(dispPageに利用)
 */
export const CategoryRecommend: React.VFC<Props> = ({
	recommendCode,
	itemCode,
	dispPage,
}) => {
	const [recommendedItems, setRecommendedItems] = useState<
		GeneralRecommendCategoryItem[] | null
	>();

	const router = useRouter();

	const load = useCallback(async () => {
		const response = await getGeneralRecommend({
			recommendCd: recommendCode,
			seriesCodeOrItemCd: itemCode,
		}).catch(() => null);
		setRecommendedItems(response as GeneralRecommendCategoryItem[]);
	}, [itemCode, recommendCode]);

	const onLoadItem = useCallback(
		(item: GeneralRecommendCategoryItem) => {
			if (item.initialized) {
				return;
			}
			generalRecommendLogger.impressionLog({
				seriesCodeOrItemCd: item.itemCd,
				position: item.position,
				recommendCd: recommendCode,
				dispPage,
			});
			item.initialized = true;
		},
		[dispPage, recommendCode]
	);

	const onClickItem = useCallback(
		(item: GeneralRecommendCategoryItem) => {
			generalRecommendLogger.clickLog({
				seriesCodeOrItemCd: item.itemCd,
				position: item.position,
				recommendCd: recommendCode,
				dispPage,
			});

			router.push(
				`${item.linkUrl}?rid=${recommendCode}_${dispPage}_${item.position}_${item.itemCd}`
			);
		},
		[dispPage, recommendCode, router]
	);

	useOnMounted(load);

	if (!recommendedItems?.length) {
		return null;
	}

	return (
		<Presenter
			dispPage={dispPage}
			recommendCode={recommendCode}
			recommendedItems={recommendedItems}
			onLoadImage={onLoadItem}
			onClickItem={onClickItem}
		/>
	);
};
CategoryRecommend.displayName = 'CategoryRecommend';
