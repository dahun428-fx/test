import { selectUserPermissions } from './selectors';
import { GetUserInfoResponse } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';

/**
 * 認証状態のstate
 * sessionId や refreshTokenHash は Cookie に保持し、
 * auth module では保持しない。
 */
type AuthenticatedState = {
	/** 認証済みか */
	authenticated: true;
	/**
	 * auth store を参照して良い状態になっているか
	 * - restore operation が完了しているか。認証済・未認証とは別軸の存在です。
	 * - REVIEW: こんな作りが許されるかどうか
	 */
	isReady: boolean;
	/** ユーザーコード */
	userCode: string;
	/**
	 * 得意先コード
	 * - NOTE: ec会員の場合はnull
	 */
	customerCode: string | null;
	/** ユーザー情報 */
	user: Readonly<GetUserInfoResponse>;
};

/**
 * 未認証状態のstate
 */
type UnauthenticatedState = {
	authenticated: false;
	isReady: boolean;
	userCode: null;
	customerCode: null;
	user: null;
};

/** ユーザー権限 */
export type UserPermissions = ReturnType<typeof selectUserPermissions>;

/** auth state */
export type AuthState = AuthenticatedState | UnauthenticatedState;

export type UserPermission =
	| 'QUOTE'
	| 'ORDER'
	| 'USER_ADMIN'
	| 'ISSUE_DELIVERY_NOTE'
	| 'LEAD_TIME_PRODUCT_INQUIRY'
	| 'RETURN_OUT_OF_POLICY'
	| 'CUSTOMER_REFERENCE_NUMBER_NATIVE'
	| 'FREIGHT_FREE_CUSTOMER_FLAG'
	| 'ORDERING_SYSTEM'
	| 'ORDER_APPROVE_FLAG';
