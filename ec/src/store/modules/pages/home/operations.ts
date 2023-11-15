import { Dispatch } from 'redux';
import { actions } from './slice';
import { getOrderInfo } from '@/api/services/getOrderInfo';

/**
 * ログイン状態に左右されないデータを load します
 */
export function load(/* dispatch: Dispatch */) {
	return async () => {
		// TODO: ログイン状態に関係のないデータ取得をここに書く。Cameleer や SSI コンテンツなど。
	};
}

/**
 * ログイン済みの時にだけ取得すべきデータを load します
 */
export function loadOnAuth(dispatch: Dispatch) {
	return async () => {
		dispatch(actions.update({ loadingOrderInfo: true }));
		try {
			// NOTE: 他の通信も追加する場合は、Promise.allSettled の使用が必要です。
			dispatch(actions.update({ orderInfoResponse: await getOrderInfo({}) }));
		} finally {
			dispatch(actions.update({ loadingOrderInfo: false }));
		}
	};
}
