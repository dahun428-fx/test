import { useCallback } from 'react';
import { PaymentMethodRequiredContent } from './PaymentMethodRequiredContent';
import { useModal } from '@/components/mobile/ui/modals/Modal.hooks';

export const usePaymentMethodRequiredModal = () => {
	const { showModal } = useModal();

	return useCallback(() => {
		return showModal(<PaymentMethodRequiredContent />);
	}, [showModal]);
};
