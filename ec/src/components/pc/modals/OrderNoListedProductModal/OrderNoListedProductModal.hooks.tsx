import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderNoListedProductContent } from './OrderNoListedProductContent';
import { useModal } from '@/components/pc/ui/modals/Modal.hooks';
import { aa } from '@/logs/analytics/adobe';
import { ga } from '@/logs/analytics/google';
import { PartNumber } from '@/models/api/msm/ect/partNumber/SuggestPartNumberResponse';

/** Order no listed product modal hook */
export const useOrderNoListedProductModal = () => {
	const { showModal } = useModal();
	const { t } = useTranslation();

	return useCallback(
		(partNumber: PartNumber) => {
			showModal(
				<OrderNoListedProductContent partNumber={partNumber} />,
				t('components.modals.orderNoListedProductModal.title')
			);
			aa.events.sendOrderNoListedProductModalView(partNumber);
			ga.events.viewNoListedProduct(partNumber);
		},

		[showModal, t]
	);
};
