import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MessageModal.module.scss';
import { Button } from '@/components/pc/ui/buttons';
import { Modal } from '@/components/pc/ui/modals';
import { ApplicationError } from '@/errors/ApplicationError';

export type Props = {
	isOpen: boolean;
	title?: string | ReactElement;
	message?: string | ReactElement;
	button?: string | ReactElement;
	onOk?: () => void;
};

/**
 * Message Modal
 */
export const MessageModal: React.FC<Props> = props => {
	const { isOpen, title, message, button, onOk } = { ...props };

	const { t } = useTranslation();

	if (process.env.NODE_ENV === 'development') {
		if (isOpen && !message) {
			throw new ApplicationError('If the modal opens, needs a message.');
		}
	}

	return (
		<Modal isOpen={isOpen} title={title} onCancel={onOk}>
			<div className={styles.message}>{message}</div>

			{button && (
				<div className={styles.buttonContainer}>
					{!button || typeof button === 'string' ? (
						// "If button" props is not specified or string type, use default Button component.
						<Button theme="default" size="m" onClick={onOk}>
							{button ?? t('components.ui.modals.messageModal.close')}
						</Button>
					) : (
						<div onClick={onOk} className={styles.customButtonWrapper}>
							{button}
						</div>
					)}
				</div>
			)}

			{/* TODO：リファクタリング */}
			<button className={styles.closeButton} onClick={onOk} />
		</Modal>
	);
};
MessageModal.displayName = 'MessageModal';
