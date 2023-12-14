import { createSelector } from '@reduxjs/toolkit';
import { OrderInfo } from './types';
import { Flag } from '@/models/api/Flag';
import { AppState } from '@/store';
import { selectIsPurchaseLinkUser } from '@/store/modules/auth';

function selectOrderInfoResponse(state: AppState) {
	return state.home.orderInfoResponse;
}

export function selectLoadingOrderInfo(state: AppState) {
	return state.home.loadingOrderInfo;
}

const selectUnfitCount = createSelector(
	[selectOrderInfoResponse],
	orderInfoResponse => {
		if (!orderInfoResponse) {
			return {};
		}

		const { user, customer, permissionList = [] } = orderInfoResponse;
		const hasUserManagementPermission = permissionList.includes('9');

		// 子ユーザー管理権限がある場合は得意先全体、そうでない場合はユーザー固有の件数を参照する
		const unfitCount =
			(hasUserManagementPermission ? customer?.unfitCount : user?.unfitCount) ||
			{};

		return unfitCount;
	}
);

export const selectOrderInfo = createSelector(
	[selectOrderInfoResponse, selectUnfitCount],
	(orderInfoResponse, unfitCount) => {
		if (!orderInfoResponse) {
			return null;
		}

		const {
			user,
			customer,
			requireApprovalFlag,
			permissionList = [],
			proxyLoginFlag,
		} = orderInfoResponse;

		if (!user && !customer) {
			return null;
		}

		// 子ユーザー管理権限
		const hasUserManagementPermission = permissionList.includes('9');
		// 請求書PDF参照権限
		const hasInvoiceReferencePermission = permissionList.includes('10');
		// 取引明細参照権限
		const hasTransactionDetailReferencePermission =
			permissionList.includes('13');
		// 配送先管理権限
		const hasShipToManagementPermission = permissionList.includes('14');
		// 代理ログインか
		const isProxyLogin = proxyLoginFlag === '1';

		const hasUnitPricePermission = permissionList.includes('11');

		const hasPDFInvoicePermission = permissionList.includes('10');

		const deliveryCount = customer?.deliveryCount || {};

		const orderInfo: OrderInfo = {
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
			})),
			currencyCode: orderInfoResponse.currencyCode,
			hasUserManagementPermission,
			hasUnitPricePermission,
			hasPDFInvoicePermission,
			hasInvoiceReferencePermission,
			hasTransactionDetailReferencePermission,
			hasShipToManagementPermission,
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
	}
);

/**
 * 注文ステータスパネルを表示可能か
 */
export const selectEnableToShowOrderStatusPanel = createSelector(
	[selectOrderInfoResponse, selectUnfitCount, selectIsPurchaseLinkUser],
	(orderInfoResponse, unfitCount, isPurchaseLinkUser) => {
		if (!orderInfoResponse || isPurchaseLinkUser) {
			return false;
		}

		const { recentUseFlag, requireApprovalFlag } = orderInfoResponse;

		/**
		 * お取り引きステータス表示条件
		 * - 最近利用している
		 * - 承認機能利用あり
		 * - アンフィットな見積 / 注文あり
		 */
		return (
			Flag.isTrue(recentUseFlag) ||
			Flag.isTrue(requireApprovalFlag) ||
			(unfitCount.order ?? 0) >= 1 ||
			(unfitCount.quotation ?? 0) >= 1
		);
	}
);
