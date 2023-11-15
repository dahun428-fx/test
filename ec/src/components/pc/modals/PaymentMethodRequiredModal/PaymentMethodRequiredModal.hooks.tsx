import { useCallback } from 'react';
import { PaymentMethodRequiredContent } from './PaymentMethodRequiredContent';
import { useModal } from '@/components/pc/ui/modals/Modal.hooks';

/** Payment method required modal hook */
export const usePaymentMethodRequiredModal = () => {
	const { showModal } = useModal();

	return useCallback(() => {
		return showModal(<PaymentMethodRequiredContent />);
	}, [showModal]);
};
