import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ConfirmModal.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Modal } from '@/components/pc/ui/modals';
import { ApplicationError } from '@/errors/ApplicationError';

export type Props = {
	isOpen: boolean;
	title?: string | ReactElement;
	message: string | ReactElement;
	confirmButton?: string | ReactElement;
	closeButton?: string | ReactElement;
	onConfirm?: () => void;
	onClose?: () => void;
};

/**
 * Confirm Modal
 */
export const ConfirmModal: React.FC<Props> = props => {
	const {
		isOpen,
		title,
		message,
		confirmButton,
		closeButton,
		onConfirm,
		onClose,
	} = { ...props };

	const { t } = useTranslation();

	if (process.env.NODE_ENV === 'development') {
		if (isOpen && !message) {
			throw new ApplicationError('If the modal opens, needs a message.');
		}
	}

	return (
		<Modal isOpen={isOpen} title={title} onCancel={onClose}>
			<div className={styles.message}>{message}</div>

			<div className={styles.buttonContainer}>
				{!confirmButton || typeof confirmButton === 'string' ? (
					<div className={styles.confirm}>
						<Button theme="strong" onClick={onConfirm}>
							{confirmButton ?? t('components.ui.modals.confirmModal.confirm')}
						</Button>
					</div>
				) : (
					<div onClick={onConfirm} className={styles.confirm}>
						{confirmButton}
					</div>
				)}

				{!closeButton || typeof closeButton === 'string' ? (
					<div>
						<Button theme="default" onClick={onClose}>
							{closeButton ?? t('components.ui.modals.confirmModal.close')}
						</Button>
					</div>
				) : (
					<div onClick={onClose}>{closeButton}</div>
				)}
			</div>
		</Modal>
	);
};
ConfirmModal.displayName = 'ConfirmModal';
