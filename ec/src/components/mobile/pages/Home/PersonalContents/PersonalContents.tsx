import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	useAuth,
	useOrderInfo,
	useRecentlyViewedCategories,
} from './PersonalContents.hooks';
import { AboutMisumi } from '@/components/mobile/pages/Home/AboutMisumi';
import { ViewHistory } from '@/components/mobile/pages/Home/CameleerContents/ViewHistory';
import { ViewHistorySimulPurchase } from '@/components/mobile/pages/Home/CameleerContents/ViewHistorySimulPurchase';
import { OpenOrderStatusButton } from '@/components/mobile/pages/Home/OpenOrderStatusButton';
import { OrderStatusPanel } from '@/components/mobile/pages/Home/OrderStatusPanel';
import { PurchaseSeriesRepeatRecommend } from '@/components/mobile/pages/Home/PurchaseSeriesRepeatRecommend';
import { RecentlyViewedItems } from '@/components/mobile/pages/Home/RecentlyViewedItems';
import { Cookie, getCookie } from '@/utils/cookie';
import { useCookie } from '@/utils/cookie/hooks';

export const PersonalContents: FC = () => {
	/** order info */
	const orderInfo = useOrderInfo();

	const { authenticated } = useAuth();

	/** order status display type cookie */
	const [orderStatusDisplayType, setOrderStatusDisplayType] = useCookie<
		'hide' | 'open'
	>(Cookie.VONAEC_TOP_STATUS);

	/** Order status panel should be hidden or not */
	const hideOrderStatus = orderStatusDisplayType === 'hide';

	const showsOrderStatusPanel =
		authenticated &&
		orderInfo &&
		orderInfo.showsOrderStatusPanel &&
		!hideOrderStatus;

	const [showGuidePopup, setShowGuidePopup] = useState(false);

	/** close Order status panel */
	const handleClickCloseOrderStatus = () => {
		if (!getCookie(Cookie.VONAEC_TOP_STATUS)) {
			setShowGuidePopup(true);
		}
		setOrderStatusDisplayType('hide');
	};

	/** show my order status */
	const handleClickOpenOrderStatus = () => {
		setShowGuidePopup(false);
		setOrderStatusDisplayType('open');
	};

	const [t] = useTranslation();
	const { categoryList, cameleerCategoryRecommendResponse } =
		useRecentlyViewedCategories();

	// NOTE: categories without image is not shown
	const filteredCategoryList = useMemo(
		() => categoryList?.filter(item => item.imageUrl) || [],
		[categoryList]
	);
	const isLoadingCategoryList = categoryList === undefined;
	const showsRecentlyViewedCategories =
		!isLoadingCategoryList && categoryList.length > 0;
	const showsAboutMisumi =
		!showsOrderStatusPanel && !showsRecentlyViewedCategories;

	return (
		<>
			{authenticated && hideOrderStatus && (
				<OpenOrderStatusButton
					showsPopup={showGuidePopup}
					onClick={handleClickOpenOrderStatus}
					onClickClosePopup={() => {
						setShowGuidePopup(false);
					}}
				/>
			)}

			{showsOrderStatusPanel && (
				<OrderStatusPanel
					{...orderInfo}
					onClickClose={handleClickCloseOrderStatus}
				/>
			)}

			<PurchaseSeriesRepeatRecommend />

			{showsRecentlyViewedCategories && (
				<RecentlyViewedItems
					title={t('mobile.pages.home.recentlyViewedCategories')}
					items={filteredCategoryList.map(item => ({
						imageUrl: item.imageUrl,
						title: item.categoryName,
						url: item.url,
						categoryCode: item.categoryCode,
						position: item.position,
					}))}
					cameleerCategoryRecommendResponse={cameleerCategoryRecommendResponse}
				/>
			)}
			{showsAboutMisumi && <AboutMisumi />}
			<ViewHistory />
			<ViewHistorySimulPurchase />
		</>
	);
};
PersonalContents.displayName = 'PersonalContents';
