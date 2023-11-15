import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { EmphasizedRecommend as Presenter } from './EmphasizedRecommend';
import { getGeneralRecommend } from '@/api/services/cameleer/getGeneralRecommend';
import { config } from '@/config';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import {
	generalRecommendLogger,
	GeneralRecommendLogParams,
} from '@/logs/cameleer/generalRecommend';
import { Logger } from '@/logs/datadog/Logger';
import { GeneralRecommendSeriesItem } from '@/models/api/cameleer/getGeneralRecommend/GetGeneralRecommendResponse';
import { last } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';

type Props = {
	recommendCode: GeneralRecommendLogParams['recommendCd'];
	dispPage: GeneralRecommendLogParams['dispPage'];
};

/**
 * 強調表示されるレコメンドコンポーネント container
 * カテゴリ2階層以降のページや商品詳細ページで利用される。
 */
export const EmphasizedRecommend: React.VFC<Props> = ({
	recommendCode,
	dispPage,
}) => {
	const [recommendedItems, setRecommendedItems] = useState<
		GeneralRecommendSeriesItem[] | null
	>();

	const router = useRouter();

	const history = getCookie(Cookie.SERIES_VIEW_HISTORY);
	// 最新履歴１件を使用
	const seriesCode = history && last(history.split('|'));

	const [currentCarouselPage, setCurrentCarouselPage] = useState(1);
	const [viewableItemNumber, setViewableItemNumber] = useState(4); // default 4件(presenter側で動的更新)
	const totalCarouselPages = useMemo(() => {
		return !recommendedItems?.length
			? 1
			: Math.ceil(recommendedItems.length / viewableItemNumber);
	}, [recommendedItems, viewableItemNumber]);

	// 表示開始データ、表示可能件数によって変化する表示内容
	const recommendListPerPage = useMemo(() => {
		const index = (currentCarouselPage - 1) * viewableItemNumber; // ページ表現-1が0スタート用のindex
		return recommendedItems?.slice(index, index + viewableItemNumber);
	}, [recommendedItems, currentCarouselPage, viewableItemNumber]);

	const onUpdateViewableItemNumber = useCallback(
		(newValue: number) => setViewableItemNumber(newValue),
		[]
	);

	const onPagingCarousel = useCallback(
		(page: -1 | 1) => {
			let nextPage = currentCarouselPage + page;
			if (nextPage < 1) {
				nextPage = totalCarouselPages;
			}

			if (nextPage > totalCarouselPages) {
				nextPage = 1;
			}
			setCurrentCarouselPage(nextPage);
		},
		[currentCarouselPage, totalCarouselPages]
	);

	const onClickItem = useCallback(
		(item: GeneralRecommendSeriesItem) => {
			generalRecommendLogger.clickLog({
				seriesCodeOrItemCd: item.seriesCode,
				position: item.position,
				recommendCd: recommendCode,
				dispPage,
			});
			router.push(
				`${config.web.ec.origin}${item.linkUrl}?rid=${recommendCode}_${dispPage}_${item.position}_${item.seriesCode}`
			);
		},
		[dispPage, recommendCode, router]
	);

	const onLoadItem = useCallback(
		(item: GeneralRecommendSeriesItem) => {
			if (item.initialized) {
				return;
			}
			generalRecommendLogger.impressionLog({
				seriesCodeOrItemCd: item.seriesCode,
				position: item.position,
				recommendCd: recommendCode,
				dispPage,
			});
			item.initialized = true;
		},
		[dispPage, recommendCode]
	);

	const load = useCallback(async () => {
		if (!seriesCode) {
			Logger.error('seriesCode is empty');
			return;
		}
		const response = await getGeneralRecommend({
			recommendCd: recommendCode,
			seriesCodeOrItemCd: seriesCode,
		}).catch(() => null);
		setRecommendedItems(response as GeneralRecommendSeriesItem[]);
	}, [seriesCode, recommendCode]);

	useOnMounted(load);

	if (!recommendListPerPage?.length) {
		return null;
	}

	return (
		<Presenter
			dispPage={dispPage}
			recommendCode={recommendCode}
			listPerPage={recommendListPerPage}
			totalPageCount={totalCarouselPages}
			onClickItem={onClickItem}
			onLoadItem={onLoadItem}
			onPagingCarousel={onPagingCarousel}
			onUpdateViewableItemNumber={onUpdateViewableItemNumber}
		/>
	);
};

EmphasizedRecommend.displayName = 'EmphasizedRecommend';
