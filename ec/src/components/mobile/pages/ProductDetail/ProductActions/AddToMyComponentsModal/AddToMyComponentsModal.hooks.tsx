import { useCallback } from 'react';
import { AddToMyComponentsModalContent } from './AddToMyComponentsModalContent';
import { useModal } from '@/components/mobile/ui/modals/Modal.hooks';

/** Add to my component modal hook */
export const useAddToMyComponentsModal = () => {
	const { showModal } = useModal();

	return useCallback(() => {
		return showModal(<AddToMyComponentsModalContent />);
	}, [showModal]);
};
