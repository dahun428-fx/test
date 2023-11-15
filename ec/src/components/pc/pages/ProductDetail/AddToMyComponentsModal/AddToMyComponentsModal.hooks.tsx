import { AddToMyComponentsContent } from '@/components/pc/pages/ProductDetail/AddToMyComponentsModal';
import { useModal } from '@/components/pc/ui/modals/Modal.hooks';

/** Add to my components hook */
export const useAddToMyComponentsModal = (seriesCode: string) => {
	const { showModal } = useModal();

	return async () => {
		// この hook は part number view の CartIn module でしか使われないため、count を指定していません。
		// Since this hook is only used in the CartIn module in the part number view, it's not set count.
		await showModal(<AddToMyComponentsContent seriesCode={seriesCode} />);
	};
};
