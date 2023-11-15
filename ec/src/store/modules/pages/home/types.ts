import { GetOrderInfoResponse } from '@/models/api/msm/ect/orderInfo/GetOrderInfoResponse';

export type HomeState = {
	orderInfoResponse: GetOrderInfoResponse | null;
	loadingOrderInfo: boolean;
};

export type Quote = {
	quoteDate?: string;
	quoteSlipNumber?: string;
	quoteItemCount?: number;
	totalPrice?: number;
	statusMessage?: string;
};

export type OrderInfo = {
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
	hasShipToManagementPermission: boolean;
	isProxyLogin: boolean;
};
