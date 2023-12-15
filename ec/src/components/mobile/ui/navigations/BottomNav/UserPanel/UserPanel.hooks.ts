import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getOrderInfo } from '@/api/services/getOrderInfo';
import { Flag } from '@/models/api/Flag';
import { GetOrderInfoResponse } from '@/models/api/msm/ect/orderInfo/GetOrderInfoResponse';
import { useSelector } from '@/store/hooks';
import {
	logout,
	selectSettlementTypes,
	selectAuthenticated,
	selectUser,
	selectIsEcUser,
	selectCouponInfo,
	selectUserPermissions,
} from '@/store/modules/auth';

/**
 * use auth for user panel
 */
export const useAuth = () => {
	/** select authenticated */
	const authenticated = useSelector(selectAuthenticated);

	/** select settlement types */
	const { isCashOnDeliveryUser, isCreditCardUser } = useSelector(
		selectSettlementTypes
	);

	/** select user */
	const user = useSelector(selectUser);

	/** select ec user */
	const isEcUser = useSelector(selectIsEcUser);

	/** select user permission */
	const {
		hasOrderPermission,
		hasCadDownloadPermission,
		hasMyComponentsPermission,
	} = useSelector(selectUserPermissions);

	/** select coupon info */
	const { hasCoupon, unconfirmedCouponCount } = useSelector(selectCouponInfo);

	return {
		authenticated,
		user,
		isEcUser,
		isCashOnDeliveryUser,
		isCreditCardUser,
		hasOrderPermission,
		hasCadDownloadPermission,
		hasMyComponentsPermission,
		hasCoupon,
		unconfirmedCouponCount,
	};
};

/**
 * use logout for user panel
 */
export const useLogout = () => {
	const dispatch = useDispatch();

	return useCallback(() => logout(dispatch)(), [dispatch]);
};

/** Quote type */
export type Quote = {
	quoteDate?: string;
	quoteSlipNumber?: string;
	quoteItemCount?: number;
	totalPrice?: number;
	statusMessage?: string;
};

/** Order Info type */
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
	hasPaymentStatementPermission: boolean;
	hasShipToAdministPermission: boolean;
	showsOrderStatusPanel: boolean;
	isProxyLogin: boolean;
};

/**
 * Hooks to get order info for user panel
 */
export const useOrderInfo = (): OrderInfo | null => {
	const [rawOrderInfo, setRawOrderInfo] = useState<GetOrderInfoResponse>();
	const authenticated = useSelector(selectAuthenticated);

	useEffect(() => {
		if (authenticated) {
			console.log('useOrderInfo excute ====> ');
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

		// has user management permission
		const hasUserManagementPermission = permissionList.includes('9');
		// has invoice reference permission
		const hasInvoiceReferencePermission = permissionList.includes('10');
		// has payment statement permission
		const hasPaymentStatementPermission = permissionList.includes('13');
		// has ship to administ permission
		const hasShipToAdministPermission = permissionList.includes('14');
		// is proxy login
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
			})),
			currencyCode: rawOrderInfo.currencyCode,
			hasUserManagementPermission,
			hasInvoiceReferencePermission,
			hasPaymentStatementPermission,
			hasShipToAdministPermission,
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
