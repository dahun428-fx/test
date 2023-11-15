import { datadogRum } from '@datadog/browser-rum';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMessageModal } from '@/components/pc/ui/modals/MessageModal';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { AuthApiError } from '@/errors/api/AuthApiError';
import { TimerCancelError } from '@/errors/timer/TimerCancelError';
import { logout } from '@/store/modules/auth';
import { shouldSendRum } from '@/utils/datadogRUM/rum';
import { DatadogErrorContext } from '@/utils/datadogRUM/type';

// next/react-dev-overlay の無効化
// NOTE: 各component で発生したエラーが未ハンドル or 再スローである場合、
//       当該コンポーネントで共通的にハンドリングするが、next 標準機能の react-dev-overlay も
//       同時に動作してしまい、エラーの動作確認を行うのに不都合であるため、ローカル設定により
//       react-dev-overlay 機能をオフにできるようにしておく。
(() => {
	if (
		process.env.NODE_ENV === 'development' &&
		process.env.NEXT_PUBLIC_DEV_OVERLAY === 'false'
	) {
		const { unregister } =
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			require('next/dist/compiled/@next/react-dev-overlay/client');
		unregister();
	}
})();

/**
 * グローバルイベントハンドラ
 */
export const ErrorHandler: React.FC = () => {
	const { showMessage } = useMessageModal();
	const dispatch = useDispatch();
	const [t] = useTranslation();

	//===========================================================================
	// effects
	//===========================================================================

	useEffect(() => {
		/**
		 * ネイティブ空間で起きたエラーをハンドリングします
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const handleNativeError = (event: ErrorEvent) => {
			// NOTE: This comment is remained to refer to following ticket: NEW_FE-3742, NEW_FE-3245, NEW_FE-3579
			// In fact, this error handler is not necessary, all errors are already sent to datadog.
		};

		/**
		 * Promise の処理で catch されていない reject をハンドリングします
		 *
		 * @param {PromiseRejectionEvent} event
		 */
		const handleUnhandledRejection = async (
			event: PromiseRejectionEvent
		): Promise<void> => {
			const { reason } = event;

			if (
				reason instanceof ApiCancelError ||
				reason instanceof TimerCancelError
			) {
				// NOTE: event.preventDefault() をしないと console にエラー出力される為
				//       明示的に event.preventDefault() を行う
				event.preventDefault();
				return;
			}

			// logout on token refresh 400 error
			// - GREFRESHTOKENHASH の有効期限切れや不正判定された場合、ログアウトする。
			// - TODO: このハンドリングは store/module/auth/operations に書くべきなので、ここからは消して移植する。
			if (reason instanceof AuthApiError && reason.status === 400) {
				logout(dispatch)().then();
				return;
			}

			if (shouldSendRum(reason)) {
				datadogRum.addError(reason, {
					errorPart: 'asynchronous code',
				} as DatadogErrorContext);
			}

			await showMessage(t('components.error.errorHandler.unhandledRejection'));
		};

		// ハンドラ登録
		if (typeof window !== 'undefined') {
			window.addEventListener('error', handleNativeError);
			window.onunhandledrejection = handleUnhandledRejection;
		}

		return () => {
			// ハンドラ削除
			window.removeEventListener('error', handleNativeError);
			window.onunhandledrejection = null;
		};
	}, [dispatch, showMessage, t]);

	//===========================================================================

	return null;
};
ErrorHandler.displayName = 'ErrorHandler';
