import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { SearchResultRecommend as Presenter } from './SearrhResultRecommend';
import { getGeneralRecommend } from '@/api/services/cameleer/getGeneralRecommend';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { generalRecommendLogger } from '@/logs/cameleer/generalRecommend';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';
import { last } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';

/** 検索結果画面用のGeneralRecommendコンテナ */
export const SearchResultRecommend: React.VFC = () => {
	const [recommendedItems, setRecommendedItems] = useState<
		GeneralRecommendSeriesItem[] | null
	>();

	const router = useRouter();

	const load = useCallback(async () => {
		const history = getCookie(Cookie.SERIES_VIEW_HISTORY);
		// 最新履歴１件を使用
		const seriesCode = history && last(history.split('|'));
		if (!seriesCode) {
			return;
		}
		const response = await getGeneralRecommend({
			recommendCd: 'rid3',
			seriesCodeOrItemCd: seriesCode,
		}).catch(() => null);
		setRecommendedItems(response as GeneralRecommendSeriesItem[]);
	}, []);

	const onLoadItem = useCallback((item: GeneralRecommendSeriesItem) => {
		if (item.initialized) {
			return;
		}
		generalRecommendLogger.impressionLog({
			seriesCodeOrItemCd: item.seriesCode,
			position: item.position,
			recommendCd: 'rid3',
			dispPage: 'searchResult',
		});
		item.initialized = true;
	}, []);

	const onClickItem = useCallback(
		(item: GeneralRecommendSeriesItem) => {
			generalRecommendLogger.clickLog({
				seriesCodeOrItemCd: item.seriesCode,
				position: item.position,
				recommendCd: 'rid3',
				dispPage: 'searchResult',
			});

			router.push(
				`${item.linkUrl}?rid=rid3_searchresult_${item.position}_${item.seriesCode}`
			);
		},
		[router]
	);

	useOnMounted(load);

	if (!recommendedItems?.length) {
		return null;
	}

	return (
		<Presenter
			recommendedItems={recommendedItems}
			onLoadImage={onLoadItem}
			onClickItem={onClickItem}
		/>
	);
};
SearchResultRecommend.displayName = 'SearchResultRecommend';
