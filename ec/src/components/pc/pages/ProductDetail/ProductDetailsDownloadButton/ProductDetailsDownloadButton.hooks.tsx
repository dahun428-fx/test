import { Canceler } from 'axios';
import { useCallback, useRef } from 'react';
import { useLoginModal } from '@/components/pc/modals/LoginModal';
import { useProductDetailsDownloadModal } from '@/components/pc/pages/ProductDetail/ProductDetailsDownloadModal/ProductDetailsDownloadModal.hooks';

/**
 * Product details download button
 * WARN: Experimental. Violates development rules. Container implementation is forbidden, implement with hooks.
 */
export const useProductDetailsDownloadButton = () => {
	const cancelerRefs = useRef<Canceler[]>([]);
	const showProductDetailsDownloadModal =
		useProductDetailsDownloadModal(cancelerRefs);
	const showLoginModal = useLoginModal();

	const handleClick = useCallback(async () => {
		const result = await showProductDetailsDownloadModal();

		if (result && result.type === 'UNAUTHENTICATED') {
			const loginResult = await showLoginModal();

			if (loginResult === 'LOGGED_IN') {
				await showProductDetailsDownloadModal();
			}
		}

		for (const canceler of cancelerRefs.current) {
			await canceler();
		}
		cancelerRefs.current = [];
	}, [showLoginModal, showProductDetailsDownloadModal]);

	return {
		onClick: handleClick,
	};
};
