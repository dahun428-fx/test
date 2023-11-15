import { useCallback } from 'react';
import styles from './LoginModal.module.scss';
import { LoginResult, LoginModalContent } from './LoginModalContent';
import { useModal } from '@/components/mobile/ui/modals/Modal.hooks';

/** Login modal hook */
export const useLoginModal = () => {
	const { showModal } = useModal();

	return useCallback((): Promise<LoginResult | void> => {
		return showModal(<LoginModalContent />, { className: styles.modal });
	}, [showModal]);
};
