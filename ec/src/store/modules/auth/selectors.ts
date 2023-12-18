import { createSelector } from '@reduxjs/toolkit';
import { CustomerType } from '@/models/api/msm/ect/userInfo/GetUserInfoResponse';
import { AppState } from '@/store';
import { stat } from 'fs';

/** auth module */
export function selectAuth(state: AppState) {
	return state.auth;
}

/** auth is ready */
export function selectAuthIsReady(state: AppState) {
	return state.auth.isReady;
}

/** 認証済みか */
export function selectAuthenticated(state: AppState) {
	return state.auth.authenticated;
}

/** ログインユーザー情報 */
export function selectUser(state: AppState) {
	return state.auth.user;
}

/** ユーザーの保有する権限一覧 */
export const selectUserPermissions = createSelector(
	[selectAuthenticated, (state: AppState) => state.auth.user?.permissionList],
	(authenticated, permissionList = []) => {
		if (!authenticated) {
			return {
				authenticated,
				hasCartPermission: false,
				hasMyComponentsPermission: false,
				hasQuotePermission: false,
				hasOrderPermission: false,
				hasOrderHistoryPermission: false,
				hasQuoteHistoryPermission: false,
				hasCadDownloadPermission: false,
				hasPriceCheckPermission: false,
			};
		}
		return {
			authenticated,
			hasCartPermission: permissionList.includes('1'),
			hasMyComponentsPermission: permissionList.includes('2'),
			hasQuotePermission: permissionList.includes('3'),
			hasOrderPermission: permissionList.includes('4'),
			hasQuoteHistoryPermission: permissionList.includes('5'),
			hasOrderHistoryPermission: permissionList.includes('6'),
			hasCadDownloadPermission: permissionList.includes('7'),
			hasPriceCheckPermission: permissionList.includes('8'),
		};
	}
);

/** NetRicoh */
export function selectIsNetRicoh(state: AppState) {
	return (
		(state.auth.user?.styleKey && state.auth.user.styleKey == '1304191708') ||
		false
	);
}

/** isHipus */
export function selectIsHipus(state: AppState) {
	return (
		(state.auth.user?.styleKey && state.auth.user.styleKey == '0708152018') ||
		false
	);
}

/** ログイン済みかつEC会員か */
export function selectIsEcUser(state: AppState) {
	return state.auth.user?.customerType === CustomerType.EC;
}

/** ログイン済みかつ購買連携ユーザか */
export function selectIsPurchaseLinkUser(state: AppState) {
	return state.auth.user?.purchaseLinkFlag === '1';
}

/** ログイン済みかつ購買連携ユーザで、unfit 時にチェックアウト可能か */
export function selectIsAbleToCheckoutWithUnfitProduct(state: AppState) {
	return state.auth.user?.purchase?.unfitCheckoutFlag === '1';
}

/**
 * TODO: 英訳
 * (購買連携ユーザのうち) チェックアウト可能ユーザか
 */
export function selectIsAbleToCheckout(state: AppState) {
	return state.auth.user?.purchase?.checkoutFlag === '1';
}

/** ユーザーのクーポン情報 */
export const selectCouponInfo = createSelector(
	[selectAuthenticated, (state: AppState) => state.auth.user],
	(authenticated, user) => {
		if (!authenticated) {
			return {
				hasCoupon: false,
				unconfirmedCouponCount: undefined,
				availableCouponCount: undefined,
			};
		}
		return {
			/** クーポンメッセージが配信されたことがあるか */
			hasCoupon: user?.couponMessageFlag === '1',
			/** 未確認クーポン件数 */
			unconfirmedCouponCount: user?.unconfirmedCouponCount,
			/** 利用可能クーポン件数 */
			availableCouponCount: user?.availableCouponCount,
		};
	}
);

/** 決済形態 */
export const selectSettlementTypes = createSelector(
	[selectAuthenticated, (state: AppState) => state.auth.user?.settlementType],
	(authenticated, settlementType) => {
		if (!authenticated) {
			return {
				isCreditCardUser: false,
				isCashOnDeliveryUser: false,
			};
		}
		return {
			// NOTE: 必要に応じてこちらに追加する
			/** クレジットカード決済のユーザーであるか */
			isCreditCardUser: settlementType === 'CCD',
			/** 代引きのユーザーであるか */
			isCashOnDeliveryUser: settlementType === 'COD',
		};
	}
);

/**
 * 未確認通知件数
 * Select unconfirmed notification count: the total of messages, coupons, inquiries from technical support site
 */
export function selectNotificationCount(state: AppState) {
	return state.auth.user?.unconfirmedNotificationCount;
}

/** 未確認メッセージ件数 */
export function selectUnconfirmedMessageCount(state: AppState) {
	return state.auth.user?.unconfirmedMessageCount;
}

/** 未確認メッセージ・問い合わせ件数 */
export function selectUnconfirmedMessageAndContactCount(state: AppState) {
	return state.auth.user?.unconfirmedMessageAndContactCount;
}

/**
 * 購買連携ユーザの型番禁止文字
 * - TODO: English comment
 */
export function selectInvalidChars(state: AppState) {
	return state.auth.user?.purchase?.invalidChars?.split('');
}

/**
 * Select purchase checkout max count
 */
export function selectCheckoutMaxCount(state: AppState) {
	return state.auth.user?.purchase?.checkoutMaxCount;
}

/**
 * impressionLog Select user code
 * 未ログインユーザーの場合crmuser、ログイン済みの場合はuserinfoから値を取得
 */
export function selectUserCode(state: AppState) {
	return state.auth.user?.userCode || 'crmuser';
}
