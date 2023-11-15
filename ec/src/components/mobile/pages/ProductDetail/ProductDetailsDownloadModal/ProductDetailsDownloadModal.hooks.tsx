import { Canceler } from 'axios';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
	DownloadProductDetailResult,
	ProductDetailsDownloadContent,
} from './ProductDetailsDownloadContent';
import { useModal } from '@/components/mobile/ui/modals/Modal.hooks';

/** Payment method required modal hook */
export const useProductDetailsDownloadModal = (
	cancelerRefs: React.MutableRefObject<Canceler[] | undefined>
) => {
	const { showModal } = useModal();
	const [t] = useTranslation();

	return useCallback((): Promise<DownloadProductDetailResult | void> => {
		return showModal(
			<ProductDetailsDownloadContent cancelerRefs={cancelerRefs} />,
			{
				title: t(
					'mobile.pages.productDetail.productDetailsDownloadModal.title'
				),
			}
		);
	}, [cancelerRefs, showModal, t]);
};
