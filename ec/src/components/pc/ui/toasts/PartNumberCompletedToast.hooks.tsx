import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PartNumberCompletedToast.module.scss';
import { useMessageToast } from '@/components/pc/ui/toasts/MessageToast';
import { Flag } from '@/models/api/Flag';

export function usePartNumberCompletedToast() {
	const [t] = useTranslation();
	const { showMessageToast } = useMessageToast();

	const showPartNumberCompleteToast = useCallback(
		completeFlag => {
			if (Flag.isTrue(completeFlag)) {
				showMessageToast({
					message: t(
						'components.ui.toasts.partNumberCompletedToast.completePartNumberMessage'
					),
					messageTheme: 'PARTNUMER_COMPLETE',
					delayTime: 8000, // set delay 8 seconds before hiding toast message
					className: styles.toast,
				});
			}
		},
		[showMessageToast, t]
	);

	return { showPartNumberCompleteToast };
}
