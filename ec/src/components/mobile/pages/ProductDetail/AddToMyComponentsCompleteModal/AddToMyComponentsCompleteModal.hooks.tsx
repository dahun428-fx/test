import { AddToMyComponentsCompleteContent } from './AddToMyComponentsCompleteContent';
import { useModal } from '@/components/mobile/ui/modals/Modal.hooks';
import { aa } from '@/logs/analytics/adobe';

/**
 * Add to my components modal hook
 */
export const useAddToMyComponentsCompleteModal = () => {
	const { showModal } = useModal();

	return async () => {
		// Send AA log
		// Since this hook is only used in the CartIn module in the part number view, it's not set count.
		aa.events.sendAddToMyComponents();
		await showModal(<AddToMyComponentsCompleteContent />);
	};
};
