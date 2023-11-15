import { getUserAttributes } from '@/logs/analytics/google/helpers';
import { Flag } from '@/models/api/Flag';

/**
 * Set user
 * - ユーザ情報に関する GA のグローバル変数を設定します
 * - 指示書: 「実装指示書_Eカタ_20210705.xlsx」のシート「ログイン後共通」
 */
export function setUser() {
	const { userCode, customerCode, purchaseLinkFlag } = getUserAttributes();
	// EC会員の場合は空文字
	window.ga_custmer = customerCode ?? '';
	window.ga_usercd = userCode;
	// 購買連携ユーザの場合 procurement、それ以外の場合は空文字
	window.ga_user_type = Flag.isTrue(purchaseLinkFlag) ? 'procurement' : '';
}
