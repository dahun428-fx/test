import { useEffect, useMemo, useState } from 'react';
import { getViewCategoryRepeatRecommend } from '@/api/services/cameleer/getViewCategoryRepeatRecommend';
import { getOrderInfo } from '@/api/services/getOrderInfo';
import { searchCategory } from '@/api/services/searchCategory';
import { useOnMounted } from '@/hooks/lifecycle/useOnMounted';
import { Flag } from '@/models/api/Flag';
import { GetViewCategoryRepeatRecommendResponse } from '@/models/api/cameleer/category/GetViewCategoryRepeatRecommendResponse';
import { Category } from '@/models/api/msm/ect/category/SearchCategoryResponse';
import { GetOrderInfoResponse } from '@/models/api/msm/ect/orderInfo/GetOrderInfoResponse';
import { useSelector } from '@/store/hooks';
import {
	selectAuthenticated,
	selectIsEcUser,
	selectUserPermissions,
} from '@/store/modules/auth';
import { keyBy } from '@/utils/collection';
import { Cookie, getCookie } from '@/utils/cookie';
import { notNull } from '@/utils/predicate';
import { url } from '@/utils/url';

/**
 * 見積伝票
 */
export type Quote = {
	quoteDate?: string;
	quoteSlipNumber?: string;
	quoteItemCount?: number;
	totalPrice?: number;
	statusMessage?: string;
	status?: string;
};

/**
 * 注文情報
 * APIから返却されたものを画面用に整理している
 */
export type OrderInfo = {
	hasOrderInfo: boolean;
	unfitCount: {
		order: number;
		quote: number;
	};
	approvalCount?: {
		pending: number;
		returned: number;
		rejected: number;
	};
	deliveryCount: {
		nextDay: number;
		currentDay: number;
		previousDay: number;
	};
	quoteList: Quote[];
	currencyCode?: string;
	hasUserManagementPermission: boolean;
	hasInvoiceReferencePermission: boolean;
	hasTransactionDetailReferencePermission: boolean;
	showsOrderStatusPanel: boolean;
	isProxyLogin: boolean;
};

export type RecommendCategory = {
	categoryCode: string;
	categoryName: string;
	imageUrl: string;
	url: string;
	position?: number;
};

/**
 * 認証状態を store からロードして返します
 */
export const useAuth = () => {
	/** ログイン済みか */
	const authenticated = useSelector(selectAuthenticated);

	/** 権限 */
	const permissions = useSelector(selectUserPermissions);

	/** EC会員か */
	const isEcUser = useSelector(selectIsEcUser);

	return { authenticated, permissions, isEcUser };
};

/**
 * ログイン後Home画面に必要な注文情報をロードします。
 */
export const useOrderInfo = (): OrderInfo | null => {
	const [rawOrderInfo, setRawOrderInfo] = useState<GetOrderInfoResponse>();
	const authenticated = useSelector(selectAuthenticated);

	useEffect(() => {
		if (authenticated) {
			getOrderInfo({}).then(response => setRawOrderInfo(response));
		}
	}, [authenticated]);

	return useMemo(() => {
		if (!rawOrderInfo) {
			return null;
		}

		const {
			user,
			customer,
			recentUseFlag,
			requireApprovalFlag,
			permissionList = [],
			proxyLoginFlag,
		} = rawOrderInfo;

		// 子ユーザー管理権限
		const hasUserManagementPermission = permissionList.includes('9');
		// 請求書PDF参照権限
		const hasInvoiceReferencePermission = permissionList.includes('10');
		// 取引明細参照権限
		const hasTransactionDetailReferencePermission =
			permissionList.includes('13');
		// 代理ログインであるか
		const isProxyLogin = proxyLoginFlag === '1';

		// 管理権限がある場合は得意先全体、そうでない場合はユーザー固有の件数を参照する
		const unfitCount =
			(hasUserManagementPermission ? customer?.unfitCount : user?.unfitCount) ||
			{};

		/**
		 * お取り引きステータス表示条件
		 * - 最近利用している
		 * - 承認機能利用あり
		 * - アンフィットな見積 / 注文あり
		 */
		const showsOrderStatusPanel =
			recentUseFlag === '1' ||
			requireApprovalFlag === '1' ||
			(unfitCount.order ?? 0) >= 1 ||
			(unfitCount.quotation ?? 0) >= 1;

		const deliveryCount = customer?.deliveryCount || {};

		const orderInfo = {
			hasOrderInfo: user !== undefined || customer !== undefined,
			unfitCount: {
				order: unfitCount.order ?? 0,
				quote: unfitCount.quotation ?? 0,
			},
			deliveryCount: {
				nextDay: deliveryCount.nextDay ?? 0,
				currentDay: deliveryCount.currentDay ?? 0,
				previousDay: deliveryCount.previousDay ?? 0,
			},
			quoteList: (user?.quotationHistoryList ?? []).map(quote => ({
				quoteDate: quote.quotationDate,
				quoteItemCount: quote.quotationItemCount,
				quoteSlipNumber: quote.quotationSlipNo,
				totalPrice: quote.totalPrice,
				statusMessage: quote.statusMessage,
				status: quote.status,
			})),
			currencyCode: rawOrderInfo.currencyCode,
			hasUserManagementPermission,
			hasInvoiceReferencePermission,
			hasTransactionDetailReferencePermission,
			showsOrderStatusPanel,
			isProxyLogin,
		};

		// 承認機能利用ありの場合、「承認件数」も追加して返す
		if (Flag.isTrue(requireApprovalFlag)) {
			const approvalCount = user?.approvalCount || {};
			return {
				...orderInfo,
				approvalCount: {
					pending: approvalCount.request ?? 0,
					returned: approvalCount.remand ?? 0,
					rejected: approvalCount.reject ?? 0,
				},
			};
		}
		return orderInfo;
	}, [rawOrderInfo]);
};

/**
 * Sort util for recently viewed products/categories
 */
function sort<T>(list: T[], field: keyof T, values: T[keyof T][]): T[] {
	if (typeof field !== 'string') {
		return list;
	}
	const listByField = list.reduce<Record<string, T>>((result, item) => {
		result[`${item[field]}`] = item;
		return result;
	}, {});
	return values.map(code => listByField[`${code}`]).filter(notNull);
}

/**
 * Load recently viewed category list
 */
export const useRecentlyViewedCategories = () => {
	const categoryCodes = getCookie(Cookie.RECENTLY_VIEWED_CATEGORY);
	const [viewCategoryRecommendResponse, setViewCategoryRecommendResponse] =
		useState<GetViewCategoryRepeatRecommendResponse>();
	const [categoryList, setCategoryList] = useState<Category[]>();

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

		if (categoryList && categoryList.length > 0 && categoryCodes) {
			const categoryListByCategoryCode = keyBy(categoryList, 'categoryCode');
			return categoryCodes
				.split(',')
				.map(categoryCode => {
					const found = categoryListByCategoryCode[categoryCode];
					// display only categories with image
					if (found?.categoryImageUrl) {
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
	}, [categoryCodes, categoryList, viewCategoryRecommendResponse]);

	const loadCategory = async () => {
		try {
			const categoryRecommend = await getViewCategoryRepeatRecommend('top');
			if (categoryRecommend && categoryRecommend.recommendItems.length > 0) {
				setViewCategoryRecommendResponse(categoryRecommend);
				return;
			}
		} catch (error) {
			// do nothing here
		}

		try {
			const searchCategoryResponse = await searchCategory({
				categoryCode: categoryCodes,
			});
			if (searchCategoryResponse.categoryList.length > 0 && categoryCodes) {
				const sortedCategoryList = sort(
					searchCategoryResponse.categoryList,
					'categoryCode',
					categoryCodes.split(',')
				);

				setCategoryList(sortedCategoryList);
			}
		} catch (error) {
			// do nothing here
		}
	};

	useOnMounted(loadCategory);

	return {
		categoryList: recommendCategoryList,
		cameleerCategoryRecommendResponse: viewCategoryRecommendResponse,
	};
};
