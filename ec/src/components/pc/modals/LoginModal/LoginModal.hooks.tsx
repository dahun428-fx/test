import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginResult, LoginModalContent } from './LoginModalContent';
import { useModal } from '@/components/pc/ui/modals/Modal.hooks';

export const useLoginModal = () => {
	const [t] = useTranslation();
	const { showModal } = useModal();

	return useCallback((): Promise<LoginResult | void> => {
		return showModal(
			<LoginModalContent />,
			t('components.modals.loginModal.title')
		);
	}, [showModal, t]);
};
