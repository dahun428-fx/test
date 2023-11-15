import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
	CancelCadDownloadContent,
	CancelCadDownloadResult,
} from './CancelCadDownloadContent';
import { useModal } from '@/components/pc/ui/modals/Modal.hooks';

/** Cancel CAD download modal hook */
export const useCancelCadDownloadModal = () => {
	const { showModal } = useModal<CancelCadDownloadResult>();
	const { t } = useTranslation();

	return useCallback(
		() =>
			showModal(
				<CancelCadDownloadContent />,
				t(
					'components.ui.layouts.footers.cadDownloadStatusBalloon.cancelCadDownloadModal.title'
				)
			),
		[showModal, t]
	);
};
