import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { MainPanel as Presenter } from './MainPanel';
import type { PanelType } from '@/components/pc/pages/Home/Home.types';
import { useViewCategoryRecommend } from '@/components/pc/pages/Home/MainPanel/MainPanel.hooks';
import { cameleer } from '@/logs/cameleer';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectAuthIsReady,
	selectIsPurchaseLinkUser,
} from '@/store/modules/auth';
import {
	selectEnableToShowOrderStatusPanel,
	selectLoadingOrderInfo,
} from '@/store/modules/pages/home';
import { Cookie, getCookie } from '@/utils/cookie';
import { useCookie } from '@/utils/cookie/hooks';

type Props = {
	aside: ReactElement;
};

/**
 * 中央メインパネル
 */
export const MainPanel: React.VFC<Props> = ({ aside }) => {
	const authenticated = useSelector(selectAuthenticated);
	const authIsReady = useSelector(selectAuthIsReady);
	const isPurchaseLink = useSelector(selectIsPurchaseLinkUser);
	const loadingOrderInfo = useSelector(selectLoadingOrderInfo);

	const {
		loadingCategories,
		recommendCategoryList,
		viewCategoryRecommendResponse,
	} = useViewCategoryRecommend();

	/** 注文ステータスパネルを表示できるか */
	const enableToShowOrderStatusPanel = useSelector(
		selectEnableToShowOrderStatusPanel
	);

	// 注文ステータスパネルの表示状態 cookie
	const [orderStatusDisplayType, setOrderStatusDisplayType] = useCookie<
		'hide' | 'open'
	>(Cookie.VONAEC_TOP_STATUS);

	/** cookie に基づいて注文ステータスパネルを隠すか */
	const hideOrderStatus = authenticated && orderStatusDisplayType === 'hide';

	// 注文ステータスパネルを再度表示する機能をガイドする popup を表示するか
	const [showsOrderStatusGuidePopup, setShowsOrderStatusGuidePopup] =
		useState(false);

	/** 3種のパネルが切り替わる箇所において、今何を表示すべきか */
	const panelType = useMemo((): PanelType => {
		if (!authIsReady) {
			return 'loading';
		}

		if (authenticated) {
			if (loadingOrderInfo) {
				return 'loading';
			}

			// 直近取引があったり、照会中のUF商品があったり、かつパネルを隠していなければ表示
			// 購買連携ユーザーの場合はどのような状況でも表示しない
			if (
				enableToShowOrderStatusPanel &&
				orderStatusDisplayType !== 'hide' &&
				!isPurchaseLink
			) {
				return 'orderStatus';
			}
		}

		// カテゴリロード中はローダーを表示(Why MISUMI チラつき防止)
		if (loadingCategories) {
			return 'loading';
		}

		// カテゴリがあれば表示
		if (recommendCategoryList.length) {
			return 'category';
		}

		return 'about';
	}, [
		authIsReady,
		authenticated,
		enableToShowOrderStatusPanel,
		isPurchaseLink,
		loadingCategories,
		loadingOrderInfo,
		orderStatusDisplayType,
		recommendCategoryList.length,
	]);

	/** 注文ステータスパネルの閉じるボタンをクリック */
	const handleClickCloseOrderStatus = useCallback(() => {
		if (!getCookie(Cookie.VONAEC_TOP_STATUS)) {
			setShowsOrderStatusGuidePopup(true);
		}
		setOrderStatusDisplayType('hide');
	}, [setOrderStatusDisplayType]);

	/** 一度閉じた注文ステータスパネルを再度表示するリンクをクリック */
	const handleClickOpenOrderStatus = useCallback(() => {
		setShowsOrderStatusGuidePopup(false);
		setOrderStatusDisplayType('open');
	}, [setOrderStatusDisplayType]);

	/** 一度閉じた注文ステータスパネルを再度表示するリンクをガイドするポップアップの閉じるをクリック */
	const handleClickCloseOrderStatusGuidePopup = () =>
		setShowsOrderStatusGuidePopup(false);

	const handleClickCategory = useCallback(
		(categoryCode: string, position?: number) => {
			if (viewCategoryRecommendResponse && position) {
				// NOTE: cameleer_click will be sent in case of having cameleer response only
				cameleer
					.trackClick({
						...viewCategoryRecommendResponse,
						item: {
							itemCd: categoryCode,
							position: position,
						},
					})
					.then();
			}
		},
		[viewCategoryRecommendResponse]
	);

	const handleLoadImageCategory = useCallback(
		(categoryCode: string, position?: number) => {
			if (viewCategoryRecommendResponse && position) {
				// NOTE: cameleer_impression will be sent in case of having cameleer response only
				cameleer
					.trackImpression({
						...viewCategoryRecommendResponse,
						item: {
							itemCd: categoryCode,
							position: position,
						},
					})
					.then();
			}
		},
		[viewCategoryRecommendResponse]
	);

	return (
		<Presenter
			{...{
				panelType,
				recommendCategoryList,
				hideOrderStatus,
				showsOrderStatusGuidePopup,
				onClickCloseOrderStatus: handleClickCloseOrderStatus,
				onClickOpenOrderStatus: handleClickOpenOrderStatus,
				onClickCloseOrderStatusGuidePopup:
					handleClickCloseOrderStatusGuidePopup,
				aside,
				onClickCategory: handleClickCategory,
				onLoadImageCategory: handleLoadImageCategory,
			}}
		/>
	);
};
MainPanel.displayName = 'MainPanel';
