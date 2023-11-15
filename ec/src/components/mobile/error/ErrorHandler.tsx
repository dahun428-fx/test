import { datadogRum } from '@datadog/browser-rum';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessageModal } from '@/components/mobile/ui/modals/MessageModal';
import { ApiCancelError } from '@/errors/api/ApiCancelError';
import { TimerCancelError } from '@/errors/timer/TimerCancelError';
import { shouldSendRum } from '@/utils/datadogRUM/rum';
import { DatadogErrorContext } from '@/utils/datadogRUM/type';

// Disable next/react-dev-overlay
// NOTE: In a component, if unhandled errors or re-thrown errors happened、
//       they are caught/processed by the common error boundary component.
// However, react-dev-overlay is also listening to that event and show the error overlay
// which is inconvenient while testing error boundary component behavior.
// Therefore, set flag to false if you want to disable react-dev-overlay.
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
 * Global error handler
 */
export const ErrorHandler: React.FC = () => {
	const { showMessage } = useMessageModal();
	/** i18n translator */
	const [t] = useTranslation();
	//===========================================================================
	// effects
	//===========================================================================

	useEffect(() => {
		/**
		 * Handle native errors
		 */
		const handleNativeError = () => {
			// TODO: 以下のメッセージは event がない時だけ表示するように制御を追加。または単に一切表示しない。関連: NEW_FE-3245
			// NOTE: Relate to NEW_FE-3742, temporary disable this feature
			// Need to consider about how to handle this error
			// showMessage(t('mobile.components.error.errorHandler.nativeError'));
		};

		/**
		 * Handle promise rejections that are not caught
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
				// NOTE: Without event.preventDefault(), error will be logged to the console
				//       -> explicitly call event.preventDefault()
				event.preventDefault();
				return;
			}

			if (shouldSendRum(reason)) {
				datadogRum.addError(reason, {
					errorPart: 'asynchronous code',
				} as DatadogErrorContext);
			}

			await showMessage(
				t('mobile.components.error.errorHandler.unhandledRejection')
			);
		};

		// Register handlers
		if (typeof window !== 'undefined') {
			window.addEventListener('error', handleNativeError);
			window.onunhandledrejection = handleUnhandledRejection;
		}

		return () => {
			// Unregister handlers
			window.removeEventListener('error', handleNativeError);
			window.onunhandledrejection = null;
		};
	}, [showMessage, t]);

	//===========================================================================

	return null;
};
ErrorHandler.displayName = 'ErrorHandler';
